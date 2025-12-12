
import type { Restaurant, MenuItem, Customer, Order, Area } from '../types';

const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';

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
      fetch(`${API_BASE}/restaurantapi`),
      fetch(`${API_BASE}/menuapi`),
      fetch(`${API_BASE}/customerapi`)
    ]);

    const restaurantsRaw = await handleJsonResponse<any[]>(restaurantsRes);
    const mealsRaw = await handleJsonResponse<any[]>(mealsRes);
    const customers = await handleJsonResponse<Customer[]>(customersRes);

    const restaurants: Restaurant[] = (restaurantsRaw ?? []).map(r => ({
      area: r.area,
      restaurantId: r.restaurantId,
      name: r.name,
      description: r.description,
      address: r.address,
      phone: r.phone,
      image: r.imageURL ?? r.image ?? ''
    }));

    const meals: MenuItem[] = (mealsRaw ?? []).map(m => ({
      area: m.area,
      dishId: m.dishId,
      restaurantId: m.restaurantId,
      name: m.name,
      description: m.description,
      isAvailable: !!m.isAvailable,
      prepTime: Number(m.prepTime ?? 0),
      price: typeof m.price === 'number'
        ? m.price
        : parseFloat(String(m.price).replace(/[^\d.]/g, '')) || 0,
      image: m.imageURL ?? m.image ?? ''
    }));

    localStorage.setItem('restaurants', JSON.stringify(restaurants ?? []));
    localStorage.setItem('menuItems', JSON.stringify(meals ?? []));
    localStorage.setItem('customers', JSON.stringify(customers ?? []));
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
    return;
  } catch (err) {
    console.error('Azure fetch failed, fallback mock used.', err);
  }

  // fallback if Azure fails
  localStorage.setItem('restaurants', JSON.stringify([]));
  localStorage.setItem('menuItems', JSON.stringify([]));
  localStorage.setItem('customers', JSON.stringify([]));
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
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
