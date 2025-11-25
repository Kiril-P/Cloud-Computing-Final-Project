// Mock Data Management
const DataManager = {
  areas: ['North', 'East', 'West'],
  
  restaurantNames: [
    'The Green Bistro', 'Blue Ocean Grill', 'Mountain View Cafe', 'Sunset Diner',
    'Urban Kitchen', 'Fresh & Fast', 'Golden Plate', 'Spice Garden',
    'Bella Italia', 'Dragon Wok'
  ],
  
  mealNames: [
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
  ],

  initialize() {
    // Check if data already exists
    if (localStorage.getItem('restaurants')) {
      return;
    }

    const restaurants = [];
    const menuItems = [];

    this.areas.forEach((area, areaIndex) => {
      this.restaurantNames.forEach((name, index) => {
        const restaurantId = `${area.toLowerCase()}-rest-${index + 1}`;
        
        restaurants.push({
          area,
          restaurantId,
          name: `${name} (${area})`,
          description: `Delicious food in the ${area} area`,
          address: `${100 + index} Main Street, ${area} District`,
          phone: `555-${areaIndex}${index}00-${1000 + index}`,
          image: 'https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
        });

        // Add 2 meals for each restaurant
        this.mealNames[index].forEach((mealName, mealIndex) => {
          menuItems.push({
            area,
            dishId: `${restaurantId}-dish-${mealIndex + 1}`,
            restaurantId,
            name: mealName,
            description: `Delicious ${mealName.toLowerCase()} prepared fresh`,
            isAvailable: true,
            prepTime: 15 + mealIndex * 5,
            price: 12.99 + mealIndex * 3,
            image: 'https://images.unsplash.com/photo-1661260652741-65340f04f2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
          });
        });
      });
    });

    // Create some sample customers
    const customers = [
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
  },

  getRestaurants() {
    const data = localStorage.getItem('restaurants');
    return data ? JSON.parse(data) : [];
  },

  getMenuItems() {
    const data = localStorage.getItem('menuItems');
    return data ? JSON.parse(data) : [];
  },

  getCustomers() {
    const data = localStorage.getItem('customers');
    return data ? JSON.parse(data) : [];
  },

  getOrders() {
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
  },

  saveRestaurants(restaurants) {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  },

  saveMenuItems(menuItems) {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  },

  saveCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
  },

  saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
  },

  getRestaurantById(restaurantId) {
    const restaurants = this.getRestaurants();
    return restaurants.find(r => r.restaurantId === restaurantId);
  },

  getMenuItemsByRestaurant(restaurantId) {
    const menuItems = this.getMenuItems();
    return menuItems.filter(item => item.restaurantId === restaurantId);
  },

  getCustomerById(customerId) {
    const customers = this.getCustomers();
    return customers.find(c => c.customerId === customerId);
  }
};
