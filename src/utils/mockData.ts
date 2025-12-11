
import type { Restaurant, MenuItem, Customer, Order, Area } from '../types';

const API_BASE = 'https://group2functions.azurewebsites.net/api';

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function initializeMockData() {
  try {
    const [restaurantsRes, mealsRes, customersRes] = await Promise.all([
      fetch(`${API_BASE}/restaurants`),
      fetch(`${API_BASE}/meals`),
      fetch(`${API_BASE}/customers`)
    ]);

    const restaurants = await handleJsonResponse<Restaurant[]>(restaurantsRes);
    const meals = await handleJsonResponse<MenuItem[]>(mealsRes);
    const customers = await handleJsonResponse<Customer[]>(customersRes);

    localStorage.setItem('restaurants', JSON.stringify(restaurants ?? []));
    localStorage.setItem('menuItems', JSON.stringify(meals ?? []));
    localStorage.setItem('customers', JSON.stringify(customers ?? []));
    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
    return;
  } catch (err) {
    console.error("Azure fetch failed, fallback mock used.", err);
  }

  // fallback mock generation
  localStorage.setItem('restaurants', JSON.stringify([]));
  localStorage.setItem('menuItems', JSON.stringify([]));
  localStorage.setItem('customers', JSON.stringify([]));
  if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
}

export function getRestaurants(): Restaurant[] {
  return JSON.parse(localStorage.getItem('restaurants') || "[]");
}

export function getMenuItems(): MenuItem[] {
  return JSON.parse(localStorage.getItem('menuItems') || "[]");
}

export function getCustomers(): Customer[] {
  return JSON.parse(localStorage.getItem('customers') || "[]");
}

export function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem('orders') || "[]");
}

export function saveRestaurants(r: Restaurant[]) {
  localStorage.setItem('restaurants', JSON.stringify(r));
}

export function saveMenuItems(m: MenuItem[]) {
  localStorage.setItem('menuItems', JSON.stringify(m));
}

export function saveCustomers(c: Customer[]) {
  localStorage.setItem('customers', JSON.stringify(c));
}

export function saveOrders(o: Order[]) {
  localStorage.setItem('orders', JSON.stringify(o));
}
