import logging
import os
import json
from datetime import datetime

from azure.data.tables import TableServiceClient
from azure.storage.queue import QueueClient
import azure.functions as func

JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

TABLE_NAME = "OrderTable"
QUEUE_NAME = "invalid-orders-queue"


def get_table_client():
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    return service.get_table_client(table_name=TABLE_NAME)


def get_queue_client():
    """Create a Queue client for storing invalid orders"""
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    return QueueClient.from_connection_string(
        conn_str=connection_string,
        queue_name=QUEUE_NAME
    )


def validate_order(body):
    """
    Validate order data and return a tuple: (is_valid, error_messages)
    
    Required fields:
    - area (must be non-empty string)
    - orderId (must be non-empty string)
    - customerId (must be non-empty string)
    - dishesOrdered (must be non-empty list)
    """
    errors = []
    
    # Check if body exists
    if not body:
        errors.append("Request body is empty")
        return False, errors
    
    # Check required fields
    area = body.get("area")
    if not area or not isinstance(area, str) or not area.strip():
        errors.append("Missing or invalid 'area' field")
    
    order_id = body.get("orderId")
    if not order_id or not isinstance(order_id, str) or not order_id.strip():
        errors.append("Missing or invalid 'orderId' field")
    
    customer_id = body.get("customerId")
    if not customer_id or not isinstance(customer_id, str) or not customer_id.strip():
        errors.append("Missing or invalid 'customerId' field")
    
    dishes = body.get("dishesOrdered")
    if not dishes:
        errors.append("Missing 'dishesOrdered' field")
    elif not isinstance(dishes, list):
        errors.append("'dishesOrdered' must be a list")
    elif len(dishes) == 0:
        errors.append("'dishesOrdered' cannot be empty - at least one dish is required")
    
    # Optional: validate estimatedTime is a positive number if provided
    estimated_time = body.get("estimatedTime")
    if estimated_time is not None:
        try:
            time_value = int(estimated_time)
            if time_value < 0:
                errors.append("'estimatedTime' must be a positive number")
        except (ValueError, TypeError):
            errors.append("'estimatedTime' must be a valid number")
    
    # Optional: validate totalCost format if provided
    total_cost = body.get("totalCost")
    if total_cost is not None and not isinstance(total_cost, (str, int, float)):
        errors.append("'totalCost' must be a string or number")
    
    is_valid = len(errors) == 0
    return is_valid, errors


def send_to_invalid_queue(body, errors, request_info=None):
    """
    Send invalid order to Azure Queue Storage
    
    Args:
        body: The invalid order data
        errors: List of validation error messages
        request_info: Additional request metadata (optional)
    """
    try:
        queue_client = get_queue_client()
        
        # Prepare message with all relevant info
        invalid_order_message = {
            "timestamp": datetime.utcnow().isoformat(),
            "validationErrors": errors,
            "originalRequest": body,
            "requestInfo": request_info or {}
        }
        
        # Convert to JSON string
        message_content = json.dumps(invalid_order_message)
        
        # Send to queue
        queue_client.send_message(message_content)
        
        logging.info(f"Invalid order sent to queue: {errors}")
        
    except Exception as e:
        logging.error(f"Failed to send message to queue: {str(e)}")
        # Don't raise - we still want to return error to user even if queue fails


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("OrderApi HTTP trigger called")
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
        logging.exception("Error in OrderApi")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            headers=JSON_HEADERS,
            status_code=500,
        )


def handle_get(req: func.HttpRequest) -> func.HttpResponse:
    """
    Show orders.

    Query parameters:
      - customerId -> list all orders for that customer
      - orderId    -> get one order
      - area       -> optional filter by PartitionKey
    """
    table = get_table_client()

    customer_id = req.params.get("customerId")
    order_id = req.params.get("orderId")
    area = req.params.get("area")

    filters = []

    if area:
        filters.append(f"PartitionKey eq '{area}'")

    if customer_id:
        filters.append(f"CustomerID eq '{customer_id}'")

    if order_id:
        filters.append(f"RowKey eq '{order_id}'")

    filter_expr = " and ".join(filters)

    if filter_expr:
        entities = table.query_entities(query_filter=filter_expr)
    else:
        entities = table.list_entities()

    result = []
    for e in entities:
        # DishesOrdered is probably stored as a string like "[D001, D002]"
        dishes_raw = e.get("DishesOrdered")
        try:
            # try to parse JSON if stored that way
            dishes = json.loads(dishes_raw) if isinstance(dishes_raw, str) else dishes_raw
        except Exception:
            dishes = dishes_raw

        result.append({
            "area": e["PartitionKey"],
            "orderId": e.get("OrderID") or e["RowKey"],
            "customerId": e.get("CustomerID"),
            "dishesOrdered": dishes,
            "estimatedTime": e.get("EstimatedTime"),
            "estimatedArrival": e.get("EstimatedArrival"),
            "totalCost": e.get("TotalCost"),
            "status": e.get("Status"),
        })

    return func.HttpResponse(
        json.dumps(result),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_post(req: func.HttpRequest) -> func.HttpResponse:
    """
    Add a new order.
    
    NOW WITH VALIDATION: Invalid orders are sent to Azure Queue Storage.

    Expected JSON body, example:
    {
      "area": "North",
      "orderId": "O002",
      "customerId": "C001",
      "dishesOrdered": ["D007", "D021"],
      "estimatedTime": 35,
      "estimatedArrival": "2025-11-26T11:30:00",
      "totalCost": "19.80€",
      "status": "Pending"
    }
    """
    table = get_table_client()

    # Parse request body
    try:
        body = req.get_json()
    except ValueError:
        # Invalid JSON - send to queue
        error_msg = "Invalid JSON body"
        send_to_invalid_queue(
            body=None,
            errors=[error_msg],
            request_info={"raw_body": req.get_body().decode('utf-8', errors='replace')}
        )
        return func.HttpResponse(
            json.dumps({
                "error": error_msg,
                "message": "Invalid request logged to queue"
            }),
            headers=JSON_HEADERS,
            status_code=400,
        )

    # VALIDATE THE ORDER
    is_valid, validation_errors = validate_order(body)
    
    if not is_valid:
        # Send invalid order to queue
        send_to_invalid_queue(
            body=body,
            errors=validation_errors,
            request_info={
                "url": req.url,
                "method": req.method
            }
        )
        
        # Return error response to user
        return func.HttpResponse(
            json.dumps({
                "error": "Order validation failed",
                "validationErrors": validation_errors,
                "message": "Invalid order has been logged for review"
            }),
            headers=JSON_HEADERS,
            status_code=400,
        )

    # Order is valid - proceed with normal processing
    area = body.get("area")
    order_id = body.get("orderId")
    customer_id = body.get("customerId")
    dishes = body.get("dishesOrdered", [])
    
    # Store list as JSON string if needed
    if isinstance(dishes, list):
        dishes_value = json.dumps(dishes)
    else:
        dishes_value = str(dishes)

    entity = {
        "PartitionKey": area,
        "RowKey": order_id,
        "OrderID": order_id,
        "CustomerID": customer_id,
        "DishesOrdered": dishes_value,
        "EstimatedTime": body.get("estimatedTime", 0),
        "EstimatedArrival": body.get("estimatedArrival", ""),
        "TotalCost": body.get("totalCost", ""),
        "Status": body.get("status", "Pending"),
    }

    table.upsert_entity(entity=entity)

    return func.HttpResponse(
        json.dumps({
            "message": f"Order {order_id} created successfully for customer {customer_id} in area {area}",
            "orderId": order_id
        }),
        headers=JSON_HEADERS,
        status_code=200,
    )


def handle_put(req: func.HttpRequest) -> func.HttpResponse:
    """
    Edit an existing order.

    Body must contain orderId.
    You can update any of:
      area, customerId, dishesOrdered, estimatedTime,
      estimatedArrival, totalCost, status
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

    order_id = body.get("orderId")
    if not order_id:
        return func.HttpResponse(
            json.dumps({"error": "orderId is required"}),
            headers=JSON_HEADERS,
            status_code=400,
        )

    entities = list(table.query_entities(query_filter=f"RowKey eq '{order_id}'"))
    if not entities:
        return func.HttpResponse(
            json.dumps({"error": "Order not found"}),
            headers=JSON_HEADERS,
            status_code=404,
        )

    entity = entities[0]

    mapping = {
        "area": "PartitionKey",
        "customerId": "CustomerID",
        "estimatedTime": "EstimatedTime",
        "estimatedArrival": "EstimatedArrival",
        "totalCost": "TotalCost",
        "status": "Status",
    }

    for json_field, table_field in mapping.items():
        if json_field in body:
            entity[table_field] = body[json_field]

    if "dishesOrdered" in body:
        dishes = body["dishesOrdered"]
        if isinstance(dishes, list):
            entity["DishesOrdered"] = json.dumps(dishes)
        else:
            entity["DishesOrdered"] = str(dishes)

    table.update_entity(entity=entity, mode="merge")

    return func.HttpResponse(
        json.dumps({"message": f"Order {order_id} updated"}),
        headers=JSON_HEADERS,
        status_code=200,
    )