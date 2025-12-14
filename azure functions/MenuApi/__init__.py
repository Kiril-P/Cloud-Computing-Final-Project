import logging
import os
import json

from azure.data.tables import TableServiceClient
import azure.functions as func

JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

TABLE_NAME = "MenuTable"


def get_table_client():
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    return service.get_table_client(table_name=TABLE_NAME)


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("MenuApi HTTP trigger called")
    method = req.method.upper()

    try:
        if method == "GET":
            return handle_get(req)
        elif method == "POST":
            return handle_post(req)
        elif method == "PUT":
            return handle_put(req)
        elif method == "DELETE":
            return handle_delete(req)
        else:
            return func.HttpResponse(
                json.dumps({"error": "Method not allowed"}),
                headers=JSON_HEADERS,
                status_code=405,
            )
    except Exception as e:
        logging.exception("Error in MenuApi")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            headers=JSON_HEADERS,
            status_code=500,
        )


def handle_get(req: func.HttpRequest) -> func.HttpResponse:
    """
    Search / filter meals.

    Query parameters supported:
      - area      -> matches PartitionKey
      - dishId    -> matches RowKey / DishID
      - max_price -> filters by Price <= max_price
    """
    table = get_table_client()

    area = req.params.get("area")
    dish_id = req.params.get("dishId")
    max_price = req.params.get("max_price")

    filters = []

    if area:
        filters.append(f"PartitionKey eq '{area}'")

    if dish_id:
        filters.append(f"RowKey eq '{dish_id}'")

    if max_price:
        try:
            price_val = float(max_price)
            filters.append(f"Price le {price_val}")
        except ValueError:
            return func.HttpResponse(
                json.dumps({"error": "max_price must be a number"}),
                headers=JSON_HEADERS,
                status_code=400,
            )

    filter_expr = " and ".join(filters)

    if filter_expr:
        entities = table.query_entities(query_filter=filter_expr)
    else:
        entities = table.list_entities()

    result = []
    for e in entities:
        result.append({
            "area": e["PartitionKey"],
            "dishId": e["RowKey"],            # same as DishID
            "description": e.get("Description"),
            "name": e.get("Name"),
            "price": e.get("Price"),
            "restaurantId": e.get("RestaurantID"),
            "imageURL": e.get("ImageURL"),
            "isAvailable": e.get("IsAvailable"),
            "prepTime": e.get("PrepTime"),
        })

    return func.HttpResponse(
        json.dumps(result),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_post(req: func.HttpRequest) -> func.HttpResponse:
    """
    Add a new meal.

    Expected JSON body:
    {
      "area": "East",
      "dishId": "D021",
      "name": "Bucket of Chicken",
      "description": "Secret herbs & spices.",
      "price": 12.5,
      "restaurantId": "R011",
      "imageURL": "https://...",
      "isAvailable": true,
      "prepTime": 20
    }
    """
    table = get_table_client()

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    area = body.get("area")
    dish_id = body.get("dishId")

    if not area or not dish_id:
        return func.HttpResponse(
            json.dumps({"error": "area and dishId are required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entity = {
        "PartitionKey": area,
        "RowKey": dish_id,
        "DishID": dish_id,
        "Name": body.get("name", ""),
        "Description": body.get("description", ""),
        "Price": body.get("price", 0),
        "RestaurantID": body.get("restaurantId", ""),
        "ImageURL": body.get("imageURL", ""),
        "IsAvailable": body.get("isAvailable", True),
        "PrepTime": body.get("prepTime", 0),
    }

    table.upsert_entity(entity=entity)

    return func.HttpResponse(
        json.dumps({"message": f"Dish {dish_id} created or updated in area {area}"}),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_put(req: func.HttpRequest) -> func.HttpResponse:
    """
    Edit an existing meal.

    Body must contain dishId.
    Any of [area, name, description, price, restaurantId,
    imageURL, isAvailable, prepTime] that are present will be updated.
    """
    table = get_table_client()

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    dish_id = body.get("dishId")
    if not dish_id:
        return func.HttpResponse(
            json.dumps({"error": "dishId is required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entities = list(table.query_entities(query_filter=f"RowKey eq '{dish_id}'"))
    if not entities:
        return func.HttpResponse(
            json.dumps({"error": "Dish not found"}),
            headers=JSON_HEADERS,
            status_code=404,
        )

    entity = entities[0]

    # Mapping from JSON fields to table columns
    mapping = {
        "area": "PartitionKey",
        "name": "Name",
        "description": "Description",
        "price": "Price",
        "restaurantId": "RestaurantID",
        "imageURL": "ImageURL",
        "isAvailable": "IsAvailable",
        "prepTime": "PrepTime",
    }

    for json_field, table_field in mapping.items():
        if json_field in body:
            entity[table_field] = body[json_field]

    table.update_entity(entity=entity, mode="merge")

    return func.HttpResponse(
        json.dumps({"message": f"Dish {dish_id} updated"}),
        headers=JSON_HEADERS,
        status_code=200,
    )

def handle_delete(req: func.HttpRequest) -> func.HttpResponse:
    """
    Delete an existing meal.
    
    Expected JSON body:
    {
      "dishId": "D021"
    }
    """
    table = get_table_client()
    
    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            headers=JSON_HEADERS,
            status_code=400,
        )
    
    dish_id = body.get("dishId")
    if not dish_id:
        return func.HttpResponse(
            json.dumps({"error": "dishId is required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )
    
    # find the entity first to get partition key
    entities = list(table.query_entities(query_filter=f"RowKey eq '{dish_id}'"))
    if not entities:
        return func.HttpResponse(
            json.dumps({"error": "Dish not found"}),
            headers=JSON_HEADERS,
            status_code=404,
        )
    
    entity = entities[0]
    
    # delete the entity (need partition key and row key)
    table.delete_entity(partition_key=entity["PartitionKey"], row_key=entity["RowKey"])
    
    return func.HttpResponse(
        json.dumps({"message": f"Dish {dish_id} deleted"}),
        headers=JSON_HEADERS,
        status_code=200,
    )
