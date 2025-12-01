import type { Restaurant, MenuItem, Customer, Order, Area } from '../types';

const areas: Area[] = ['North', 'East', 'West'];

const restaurantNames = [
  'The Green Bistro', 'Blue Ocean Grill', 'Mountain View Cafe', 'Sunset Diner',
  'Urban Kitchen', 'Fresh & Fast', 'Golden Plate', 'Spice Garden',
  'Bella Italia', 'Dragon Wok'
];

const mealNames = [
  ['Grilled Salmon', 'Caesar Salad'],
  ['Seafood Platter', 'Fish Tacos'],
  ['Mountain Burger', 'Club Sandwich'],
  ['Sunset Special', 'BBQ Ribs'],
  ['Urban Bowl', 'Avocado Toast'],
  ['Fresh Wrap', 'Power Smoothie Bowl'],
  ['Golden Steak', 'Chicken Parmesan'],
  ['Spicy Curry', 'Tandoori Chicken'],
  ['Margherita Pizza', 'Pasta Carbonara'],
  ['Kung Pao Chicken', 'Sweet & Sour Pork']
];

export function initializeMockData() {
  // Check if data already exists
  if (localStorage.getItem('restaurants')) {
    return;
  }

  const restaurants: Restaurant[] = [];
  const menuItems: MenuItem[] = [];

  areas.forEach((area, areaIndex) => {
    restaurantNames.forEach((name, index) => {
      const restaurantId = `${area.toLowerCase()}-rest-${index + 1}`;
      
      restaurants.push({
        area,
        restaurantId,
        name: `${name} (${area})`,
        description: `Delicious food in the ${area} area`,
        address: `${100 + index} Main Street, ${area} District`,
        phone: `555-${areaIndex}${index}00-${1000 + index}`,
        image: 'https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNjM4Nzk3OTR8MA&ixlib=rb-4.1.0&q=80&w=400'
      });

      // Add 2 meals for each restaurant
      mealNames[index].forEach((mealName, mealIndex) => {
        menuItems.push({
          area,
          dishId: `${restaurantId}-dish-${mealIndex + 1}`,
          restaurantId,
          name: mealName,
          description: `Delicious ${mealName.toLowerCase()} prepared fresh`,
          isAvailable: true,
          prepTime: 15 + mealIndex * 5,
          price: 12.99 + mealIndex * 3,
          image: 'https://images.unsplash.com/photo-1661260652741-65340f04f2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBmb29kJTIwbWVhbHxlbnwxfHx8fDE3NjM5NDgwMjd8MA&ixlib=rb-4.1.0&q=80&w=400'
        });
      });
    });
  });

  // Create some sample customers
  const customers: Customer[] = [
    {
      area: 'North',
      customerId: 'cust-1',
      name: 'John',
      lastName: 'Doe',
      address: '123 Oak Street, North District',
      phone: '555-0001'
    },
    {
      area: 'East',
      customerId: 'cust-2',
      name: 'Jane',
      lastName: 'Smith',
      address: '456 Pine Avenue, East District',
      phone: '555-0002'
    },
    {
      area: 'West',
      customerId: 'cust-3',
      name: 'Bob',
      lastName: 'Johnson',
      address: '789 Maple Drive, West District',
      phone: '555-0003'
    }
  ];

  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
  localStorage.setItem('customers', JSON.stringify(customers));
  localStorage.setItem('orders', JSON.stringify([]));
}

export function getRestaurants(): Restaurant[] {
  const data = localStorage.getItem('restaurants');
  return data ? JSON.parse(data) : [];
}

export function getMenuItems(): MenuItem[] {
  const data = localStorage.getItem('menuItems');
  return data ? JSON.parse(data) : [];
}

export function getCustomers(): Customer[] {
  const data = localStorage.getItem('customers');
  return data ? JSON.parse(data) : [];
}

export function getOrders(): Order[] {
  const data = localStorage.getItem('orders');
  return data ? JSON.parse(data) : [];
}

export function saveRestaurants(restaurants: Restaurant[]) {
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
}

export function saveMenuItems(menuItems: MenuItem[]) {
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

export function saveCustomers(customers: Customer[]) {
  localStorage.setItem('customers', JSON.stringify(customers));
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem('orders', JSON.stringify(orders));
}