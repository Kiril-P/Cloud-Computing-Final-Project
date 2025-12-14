import logging
import os
import json

from azure.data.tables import TableServiceClient
import azure.functions as func

JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

TABLE_NAME = "RestaurantTable"


def get_table_client():
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    return service.get_table_client(table_name=TABLE_NAME)


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("RestaurantApi HTTP trigger called")
    method = req.method.upper()

    try:
        if method == "GET":
            return handle_get(req)
        elif method == "POST":
            return handle_post(req)
        elif method == "PUT":
            return handle_put(req)
        else:
            return func.HttpResponse(
                json.dumps({"error": "Method not allowed"}),
                headers=JSON_HEADERS,
                status_code=405,
            )
    except Exception as e:
        logging.exception("Error in RestaurantApi")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            headers=JSON_HEADERS,
            status_code=500,
        )


def handle_get(req: func.HttpRequest) -> func.HttpResponse:
    """
    Search / filter restaurants.

    Query parameters:
      - area          -> matches PartitionKey
      - restaurantId  -> matches RowKey / RestaurantID
    """
    table = get_table_client()

    area = req.params.get("area")
    restaurant_id = req.params.get("restaurantId")

    filters = []

    if area:
        filters.append(f"PartitionKey eq '{area}'")

    if restaurant_id:
        filters.append(f"RowKey eq '{restaurant_id}'")

    filter_expr = " and ".join(filters)

    if filter_expr:
        entities = table.query_entities(query_filter=filter_expr)
    else:
        entities = table.list_entities()

    result = []
    for e in entities:
        result.append({
            "area": e["PartitionKey"],
            "restaurantId": e["RowKey"],
            "address": e.get("Address"),
            "description": e.get("Description"),
            "imageURL": e.get("ImageURL"),
            "name": e.get("Name"),
            "phone": e.get("Phone"),
        })

    return func.HttpResponse(
        json.dumps(result),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_post(req: func.HttpRequest) -> func.HttpResponse:
    """
    Add a new restaurant.

    Expected JSON body:
    {
      "area": "East",
      "restaurantId": "R021",
      "name": "New Restaurant",
      "description": "Some description",
      "address": "Some street, City",
      "phone": "600 000 000",
      "imageURL": "img/some-image"
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
    restaurant_id = body.get("restaurantId")

    if not area or not restaurant_id:
        return func.HttpResponse(
            json.dumps({"error": "area and restaurantId are required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entity = {
        "PartitionKey": area,
        "RowKey": restaurant_id,
        "RestaurantID": restaurant_id,
        "Name": body.get("name", ""),
        "Description": body.get("description", ""),
        "Address": body.get("address", ""),
        "Phone": body.get("phone", ""),
        "ImageURL": body.get("imageURL", ""),
    }

    table.upsert_entity(entity=entity)

    return func.HttpResponse(
        json.dumps({"message": f"Restaurant {restaurant_id} created or updated in area {area}"}),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_put(req: func.HttpRequest) -> func.HttpResponse:
    """
    Edit an existing restaurant.

    Body must contain restaurantId.
    Any of [area, name, description, address, phone, imageURL] that are present
    will be updated.
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

    restaurant_id = body.get("restaurantId")
    if not restaurant_id:
        return func.HttpResponse(
            json.dumps({"error": "restaurantId is required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entities = list(table.query_entities(query_filter=f"RowKey eq '{restaurant_id}'"))
    if not entities:
        return func.HttpResponse(
            json.dumps({"error": "Restaurant not found"}),
            headers=JSON_HEADERS,
            status_code=404,
        )

    entity = entities[0]

    mapping = {
        "area": "PartitionKey",
        "name": "Name",
        "description": "Description",
        "address": "Address",
        "phone": "Phone",
        "imageURL": "ImageURL",
    }

    for json_field, table_field in mapping.items():
        if json_field in body:
            entity[table_field] = body[json_field]

    table.update_entity(entity=entity, mode="merge")

    return func.HttpResponse(
        json.dumps({"message": f"Restaurant {restaurant_id} updated"}),
        headers=JSON_HEADERS,
        status_code=200,
    )
