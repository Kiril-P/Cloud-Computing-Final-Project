// src/utils/mockData.ts
import {
  TableClient,
  AzureSASCredential,
} from "@azure/data-tables";
import type { Restaurant, MenuItem, Customer, Order, Area } from "../types";

// .env (root of project):
// VITE_STORAGE_ACCOUNT_NAME=group2database
// VITE_TABLES_SAS=?sv=... (SAS token with table read/write as needed)
const accountName = import.meta.env.VITE_STORAGE_ACCOUNT_NAME;
const sasToken = import.meta.env.VITE_TABLES_SAS!;

const tableEndpoint = `https://${accountName}.table.core.windows.net`;
const credential = new AzureSASCredential(sasToken);

// ---- TABLE CLIENTS (your real table names) ----
const restaurantTable = new TableClient(tableEndpoint, "RestaurantTable", credential);
const menuTable       = new TableClient(tableEndpoint, "MenuTable", credential);
const customerTable   = new TableClient(tableEndpoint, "CustomerTable", credential);
const orderTable      = new TableClient(tableEndpoint, "OrderTable", credential);

// If App.tsx still calls this from the old mock: keep as no-op
export function initializeMockData() {
  // no seeding; data comes from Azure
}

// ---- MAPPERS: Azure entity -> your front-end types ----
// PartitionKey = Area (North/East/West)

function mapRestaurantEntity(entity: any): Restaurant {
  return {
    area: entity.partitionKey as Area,
    restaurantId: entity.RestaurantID, // your column
    name: entity.Name,
    description: entity.Description,
    address: entity.Address,
    phone: entity.Phone,
    image: entity.ImageURL ?? "",
  };
}

function mapMenuEntity(entity: any): MenuItem {
  return {
    area: entity.partitionKey as Area,
    dishId: entity.DishID,
    restaurantId: entity.RestaurantID,
    name: entity.Name,
    description: entity.Description,
    isAvailable: Boolean(entity.IsAvailable),
    prepTime: Number(entity.PrepTime),
    price: Number(entity.Price),
    image: entity.ImageURL ?? "",
  };
}

function mapCustomerEntity(entity: any): Customer {
  return {
    area: entity.partitionKey as Area,
    customerId: entity.CustomerID,
    name: entity.Name,
    lastName: entity.LastName,
    address: entity.Address,
    phone: entity.Phone,
  };
}

function mapOrderEntity(entity: any): Order {
  return {
    area: entity.partitionKey as Area,
    orderId: entity.OrderID,
    customerId: entity.CustomerID,
    dishesOrdered:
      typeof entity.DishesOrdered === "string"
        ? JSON.parse(entity.DishesOrdered) // e.g. '["dish1","dish2"]'
        : entity.DishesOrdered,
    status: entity.Status,
    estimatedTime: Number(entity.EstimatedTime),
    estimatedArrival: entity.EstimatedArrival,
    totalCost: Number(entity.TotalCost),
    createdAt: entity.Timestamp ?? entity.timestamp,
  };
}

// ---- PUBLIC API USED BY YOUR COMPONENTS (now async) ----

export async function getRestaurants(): Promise<Restaurant[]> {
  const results: Restaurant[] = [];
  for await (const entity of restaurantTable.listEntities()) {
    results.push(mapRestaurantEntity(entity));
  }
  return results;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const results: MenuItem[] = [];
  for await (const entity of menuTable.listEntities()) {
    results.push(mapMenuEntity(entity));
  }
  return results;
}

export async function getCustomers(): Promise<Customer[]> {
  const results: Customer[] = [];
  for await (const entity of customerTable.listEntities()) {
    results.push(mapCustomerEntity(entity));
  }
  return results;
}

export async function getOrders(): Promise<Order[]> {
  const results: Order[] = [];
  for await (const entity of orderTable.listEntities()) {
    results.push(mapOrderEntity(entity));
  }
  return results;
}

// ---- OPTIONAL: stubs or real saves to Azure ----
// For now you can leave these as no-ops if the UI only reads data.

export async function saveRestaurants(_restaurants: Restaurant[]) {}

export async function saveMenuItems(_menuItems: MenuItem[]) {}

export async function saveCustomers(_customers: Customer[]) {}

export async function saveOrders(_orders: Order[]) {}
