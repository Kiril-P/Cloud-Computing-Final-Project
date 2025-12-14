import datetime
import logging
import os

import azure.functions as func
from azure.data.tables import TableServiceClient

TABLE_NAME = "OrderTable"


def get_table_client():
    connection_string = os.environ.get("AzureWebJobsStorage")
    if not connection_string:
        raise RuntimeError("Missing AzureWebJobsStorage setting")
    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    return service.get_table_client(table_name=TABLE_NAME)


def main(mytimer: func.TimerRequest) -> None:
    logging.info("OrderStatusUpdater started")

    # connect to OrderTable
    try:
        table = get_table_client()
    except Exception as e:
        logging.error(f"Could not get table client: {e}")
        return

    # current time in UTC
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    updated = 0

    # get all orders
    try:
        entities = table.list_entities()
    except Exception as e:
        logging.error(f"Failed to list entities: {e}")
        return

    for entity in entities:
        try:
            # 1) only handle orders that are pending
            raw_status = entity.get("Status") or entity.get("status") or ""
            if str(raw_status).lower() != "pending":
                continue

            # 2) need a valid Timestamp
            ts = entity.get("Timestamp")
            if not isinstance(ts, datetime.datetime):
                logging.warning(f"Order {entity.get('RowKey')} missing Timestamp")
                continue

            # normalize timestamp to aware UTC
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=datetime.timezone.utc)
            else:
                ts = ts.astimezone(datetime.timezone.utc)

            # 3) get per-order estimated time in minutes
            est_raw = entity.get("EstimatedTime") or entity.get("estimatedTime")
            if est_raw is None:
                logging.warning(f"Order {entity.get('RowKey')} missing EstimatedTime")
                continue

            try:
                est_minutes = int(est_raw)
            except (TypeError, ValueError):
                logging.warning(
                    f"Order {entity.get('RowKey')} has invalid EstimatedTime={est_raw}"
                )
                continue

            expected_delivery = ts + datetime.timedelta(minutes=est_minutes)

            # 4) only mark delivered when its estimated time has passed
            if now_utc < expected_delivery:
                continue

            update_entity = {
                "PartitionKey": entity["PartitionKey"],
                "RowKey": entity["RowKey"],
                "Status": "delivered",
            }
            table.update_entity(entity=update_entity, mode="merge")
            updated += 1

        except Exception as e:
            logging.error(f"Error processing order {entity.get('RowKey')}: {e}")

    logging.info(f"OrderStatusUpdater finished. Updated {updated} orders.")
