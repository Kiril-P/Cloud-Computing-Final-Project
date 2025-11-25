import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { RestaurantList } from './components/RestaurantView/RestaurantList';
import { RestaurantProfile } from './components/RestaurantView/RestaurantProfile';
import { CreateRestaurant } from './components/RestaurantView/CreateRestaurant';
import { CustomerAuth } from './components/CustomerView/CustomerAuth';
import { RestaurantBrowse } from './components/CustomerView/RestaurantBrowse';
import { RestaurantMenu } from './components/CustomerView/RestaurantMenu';
import { OrderSummary } from './components/CustomerView/OrderSummary';
import { CustomerProfile } from './components/CustomerView/CustomerProfile';
import { initializeMockData } from './utils/mockData';
import type { Restaurant, Customer, OrderItem } from './types';

type View = 
  | 'landing'
  | 'restaurant-list'
  | 'restaurant-profile'
  | 'restaurant-create'
  | 'customer-auth'
  | 'customer-browse'
  | 'customer-menu'
  | 'customer-cart'
  | 'customer-profile';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    initializeMockData();
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Restaurant View Handlers
  const handleNavigateToRestaurantView = () => {
    setView('restaurant-list');
  };

  const handleSelectRestaurantForEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setView('restaurant-profile');
  };

  const handleCreateNewRestaurant = () => {
    setView('restaurant-create');
  };

  const handleBackToRestaurantList = () => {
    setSelectedRestaurant(null);
    setView('restaurant-list');
  };

  // Customer View Handlers
  const handleNavigateToCustomerView = () => {
    setView('customer-auth');
  };

  const handleCustomerSelect = (customer: Customer) => {
    setCurrentCustomer(customer);
    setView('customer-browse');
  };

  const handleSelectRestaurantForMenu = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setView('customer-menu');
  };

  const handleBackToRestaurantBrowse = () => {
    setSelectedRestaurant(null);
    setView('customer-browse');
  };

  const handleAddToCart = (item: OrderItem) => {
    const existingItem = cart.find(cartItem => cartItem.dishId === item.dishId);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.dishId === item.dishId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.dishId !== dishId));
    } else {
      setCart(cart.map(item =>
        item.dishId === dishId ? { ...item, quantity } : item
      ));
    }
  };

  const handleViewCart = () => {
    setView('customer-cart');
  };

  const handleViewProfile = () => {
    setView('customer-profile');
  };

  const handlePlaceOrder = () => {
    setCart([]);
    setView('customer-browse');
  };

  const handleUpdateCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
  };

  const handleBackToLanding = () => {
    setView('landing');
    setSelectedRestaurant(null);
    setCurrentCustomer(null);
    setCart([]);
  };

  // Render appropriate view
  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={(type) => {
              if (type === 'restaurant') {
                handleNavigateToRestaurantView();
              } else {
                handleNavigateToCustomerView();
              }
            }}
          />
        );

      case 'restaurant-list':
        return (
          <>
            <Header title="Restaurant Management" onHomeClick={handleBackToLanding} />
            <RestaurantList
              onSelectRestaurant={handleSelectRestaurantForEdit}
              onCreateNew={handleCreateNewRestaurant}
            />
          </>
        );

      case 'restaurant-profile':
        return (
          <>
            <Header title="Edit Restaurant" onHomeClick={handleBackToLanding} />
            {selectedRestaurant && (
              <RestaurantProfile
                restaurant={selectedRestaurant}
                onBack={handleBackToRestaurantList}
              />
            )}
          </>
        );

      case 'restaurant-create':
        return (
          <>
            <Header title="Create Restaurant" onHomeClick={handleBackToLanding} />
            <CreateRestaurant
              onBack={handleBackToRestaurantList}
              onSuccess={handleBackToRestaurantList}
            />
          </>
        );

      case 'customer-auth':
        return <CustomerAuth onCustomerSelect={handleCustomerSelect} onBack={handleBackToLanding} />;

      case 'customer-browse':
        return (
          <>
            <Header title="NomNomNow" onHomeClick={handleBackToLanding} />
            {currentCustomer && (
              <RestaurantBrowse
                customer={currentCustomer}
                cart={cart}
                onSelectRestaurant={handleSelectRestaurantForMenu}
                onViewCart={handleViewCart}
                onViewProfile={handleViewProfile}
              />
            )}
          </>
        );

      case 'customer-menu':
        return (
          <>
            <Header title="Restaurant Menu" onHomeClick={handleBackToLanding} />
            {currentCustomer && selectedRestaurant && (
              <RestaurantMenu
                restaurant={selectedRestaurant}
                customer={currentCustomer}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onBack={handleBackToRestaurantBrowse}
                onViewCart={handleViewCart}
              />
            )}
          </>
        );

      case 'customer-cart':
        return (
          <>
            <Header title="Your Cart" onHomeClick={handleBackToLanding} />
            {currentCustomer && (
              <OrderSummary
                customer={currentCustomer}
                cart={cart}
                onBack={handleBackToRestaurantBrowse}
                onPlaceOrder={handlePlaceOrder}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
          </>
        );

      case 'customer-profile':
        return (
          <>
            <Header title="My Profile" onHomeClick={handleBackToLanding} />
            {currentCustomer && (
              <CustomerProfile
                customer={currentCustomer}
                onBack={handleBackToRestaurantBrowse}
                onUpdateCustomer={handleUpdateCustomer}
              />
            )}
          </>
        );

      default:
        return <LandingPage onNavigate={(type) => {
          if (type === 'restaurant') {
            handleNavigateToRestaurantView();
          } else {
            handleNavigateToCustomerView();
          }
        }} />;
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
}