# NomNomNow - Food Delivery Platform

A comprehensive food delivery platform built with React, TypeScript, and Tailwind CSS. Designed for deployment on GitHub Pages.

## Features

### Restaurant View
- **Restaurant Management**: Browse all 30 restaurants across 3 areas (North, East, West)
- **Search & Filter**: Find restaurants by name and filter by area
- **Restaurant Profile Editor**: 
  - Update restaurant details (name, address, phone, image)
  - Manage menu items (add, edit, delete, toggle availability)
  - Set preparation times and prices
- **Create New Restaurant**: Add new restaurants with full menu setup

### Customer View
- **Customer Authentication**: Create new customer account or select existing one
- **Restaurant Browsing**: 
  - View all restaurants with delivery time estimates
  - Search by name and filter by area
  - See which restaurants are already in cart
- **Menu Ordering**:
  - Browse restaurant menus
  - Add multiple quantities of items to cart
  - Continue shopping across multiple restaurants
- **Smart Cart System**:
  - Multi-restaurant ordering support
  - Intelligent delivery time calculation
  - Order summary with itemized costs
- **Customer Profile**:
  - Edit personal information
  - View complete order history
  - Track order status

## Delivery Time Calculation

The system uses intelligent delivery time estimation:

**Single Restaurant:**
- Estimated Time = Preparation Time + Fixed Pickup Time + Fixed Delivery Time
- Same area: 5 min pickup + 5 min delivery
- Different area: 10 min pickup + 10 min delivery

**Multiple Restaurants:**
- Estimated Time = Max(Preparation Times) + (Same Area Restaurants × 5) + (Different Area Restaurants × 10) + Max(Delivery Time)

## Data Structure

The application uses 4 main data tables stored in LocalStorage:

1. **RestaurantTable**: area, restaurantId, name, description, address, phone, image
2. **CustomerTable**: area, customerId, name, lastName, address, phone
3. **MenuTable**: area, dishId, restaurantId, name, description, isAvailable, prepTime, price, image
4. **OrderTable**: area, orderId, customerId, dishesOrdered, estimatedArrival, estimatedTime, status, totalCost

## Initial Data

- **30 Restaurants**: 10 in each area (North, East, West)
- **60 Menu Items**: 2 dishes per restaurant (expandable)
- **3 Sample Customers**: 1 in each area

## Color Palette

The application features a professional blue and green aesthetic:
- Primary Blue: `#2563eb`
- Primary Green: `#10b981`
- Dark Blue: `#1e40af`
- Dark Green: `#059669`
- Light Blue: `#dbeafe`
- Light Green: `#d1fae5`

## Technology Stack

- **React** with TypeScript
- **Tailwind CSS** v4.0
- **Lucide React** for icons
- **LocalStorage** for data persistence
- Hash-based routing for GitHub Pages compatibility

## Project Structure

```
/
├── App.tsx                          # Main application with routing
├── components/
│   ├── Header.tsx                   # App header
│   ├── LandingPage.tsx             # Welcome screen
│   ├── SearchAndFilter.tsx         # Reusable search/filter component
│   ├── RestaurantView/
│   │   ├── RestaurantList.tsx      # Restaurant management list
│   │   ├── RestaurantProfile.tsx   # Edit restaurant & menu
│   │   └── CreateRestaurant.tsx    # Create new restaurant
│   └── CustomerView/
│       ├── CustomerAuth.tsx        # Customer login/signup
│       ├── RestaurantBrowse.tsx    # Browse restaurants
│       ├── RestaurantMenu.tsx      # View & order from menu
│       ├── OrderSummary.tsx        # Cart & checkout
│       └── CustomerProfile.tsx     # Profile & order history
├── types/
│   └── index.ts                    # TypeScript interfaces
├── utils/
│   └── mockData.ts                 # Data management functions
└── styles/
    └── globals.css                 # Global styles & Tailwind config
```

## Usage

### Restaurant Management
1. Select "Restaurant View" from the landing page
2. Browse existing restaurants or create a new one
3. Click on a restaurant to edit details and manage menu
4. Add, edit, or remove menu items as needed

### Customer Ordering
1. Select "Customer View" from the landing page
2. Create a new account or select an existing customer
3. Browse restaurants and view menus
4. Add items to cart (can order from multiple restaurants)
5. Review cart and place order
6. View order history in your profile

## GitHub Pages Deployment

This application is designed to work seamlessly with GitHub Pages:
- Uses hash-based routing for proper navigation
- All data persists in browser LocalStorage
- No backend required
- Static asset optimization

## Development

The application uses React functional components with hooks for state management. All data operations are handled through utility functions in `utils/mockData.ts`, making it easy to swap out LocalStorage for a real backend in the future.

## Future Enhancements

- Real-time order tracking
- Payment integration
- Restaurant ratings and reviews
- Delivery driver assignment
- Push notifications
- Backend API integration (Azure Tables as mentioned)