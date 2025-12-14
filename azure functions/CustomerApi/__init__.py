import logging
import os
import json

from azure.data.tables import TableServiceClient
import azure.functions as func

JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

TABLE_NAME = "CustomerTable"


def get_table_client():
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    return service.get_table_client(table_name=TABLE_NAME)


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("CustomerApi HTTP trigger called")
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
        logging.exception("Error in CustomerApi")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            headers=JSON_HEADERS,
            status_code=500,
        )


def handle_get(req: func.HttpRequest) -> func.HttpResponse:
    """
    Search or filter customers.

    Query parameters:
      - area       -> matches PartitionKey
      - customerId -> matches RowKey / CustomerID
    """
    table = get_table_client()

    area = req.params.get("area")
    customer_id = req.params.get("customerId")

    filters = []

    if area:
        filters.append(f"PartitionKey eq '{area}'")

    if customer_id:
        # RowKey is C011, C012, etc, same as CustomerID
        filters.append(f"RowKey eq '{customer_id}'")

    filter_expr = " and ".join(filters)

    if filter_expr:
        entities = table.query_entities(query_filter=filter_expr)
    else:
        entities = table.list_entities()

    result = []
    for e in entities:
        result.append({
            "area": e["PartitionKey"],
            "customerId": e["RowKey"],
            "address": e.get("Address"),
            "name": e.get("Name"),
            "lastName": e.get("LastName"),
            "phone": e.get("Phone"),
        })

    return func.HttpResponse(
        json.dumps(result),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_post(req: func.HttpRequest) -> func.HttpResponse:
    """
    Add a new customer.

    Expected JSON body:
    {
      "area": "East",
      "customerId": "C021",
      "name": "Ali",
      "lastName": "Samara",
      "address": "IE Tower",
      "phone": "+34 600 000 000"
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
    customer_id = body.get("customerId")

    if not area or not customer_id:
        return func.HttpResponse(
            json.dumps({"error": "area and customerId are required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entity = {
        "PartitionKey": area,
        "RowKey": customer_id,
        "CustomerID": customer_id,
        "Address": body.get("address", ""),
        "Name": body.get("name", ""),
        "LastName": body.get("lastName", ""),
        "Phone": body.get("phone", ""),
    }

    table.upsert_entity(entity=entity)

    return func.HttpResponse(
        json.dumps({"message": f"Customer {customer_id} created or updated in area {area}"}),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_put(req: func.HttpRequest) -> func.HttpResponse:
    """
    Edit an existing customer.

    Body must contain customerId.
    Any of [area, name, lastName, address, phone] that are present
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

    customer_id = body.get("customerId")
    if not customer_id:
        return func.HttpResponse(
            json.dumps({"error": "customerId is required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entities = list(table.query_entities(query_filter=f"RowKey eq '{customer_id}'"))
    if not entities:
        return func.HttpResponse(
            json.dumps({"error": "Customer not found"}),
            headers=JSON_HEADERS,
            status_code=404,
        )

    entity = entities[0]

    mapping = {
        "area": "PartitionKey",
        "name": "Name",
        "lastName": "LastName",
        "address": "Address",
        "phone": "Phone",
    }

    for json_field, table_field in mapping.items():
        if json_field in body:
            entity[table_field] = body[json_field]

    table.update_entity(entity=entity, mode="merge")

    return func.HttpResponse(
        json.dumps({"message": f"Customer {customer_id} updated"}),
        headers=JSON_HEADERS,
        status_code=200,
    )
