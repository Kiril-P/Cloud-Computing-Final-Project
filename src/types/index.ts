export type Area = 'North' | 'East' | 'West';

export interface Restaurant {
  area: Area;
  restaurantId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
}

export interface Customer {
  area: Area;
  customerId: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface MenuItem {
  area: Area;
  dishId: string;
  restaurantId: string;
  name: string;
  description: string;
  isAvailable: boolean;
  prepTime: number; // in minutes
  price: number;
  image: string;
}

export interface OrderItem {
  dishId: string;
  restaurantId: string;
  quantity: number;
  name: string;
  price: number;
  prepTime: number;
  area: Area;
}

export interface Order {
  area: Area;
  orderId: string;
  customerId: string;
  dishesOrdered: OrderItem[];
  estimatedArrival: string;
  estimatedTime: number; // in minutes
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  totalCost: number;
  createdAt: string;
}
