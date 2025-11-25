import React, { useState, useEffect } from 'react';
import { User, ShoppingCart, Clock, ArrowRight } from 'lucide-react';
import type { Restaurant, Customer, OrderItem, Area } from '../../types';
import { getRestaurants } from '../../utils/mockData';
import { SearchAndFilter } from '../SearchAndFilter';

interface RestaurantBrowseProps {
  customer: Customer;
  cart: OrderItem[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewCart: () => void;
  onViewProfile: () => void;
}

export function RestaurantBrowse({
  customer,
  cart,
  onSelectRestaurant,
  onViewCart,
  onViewProfile
}: RestaurantBrowseProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | 'All'>('All');

  useEffect(() => {
    setRestaurants(getRestaurants());
  }, []);

  const calculateDeliveryTime = (restaurant: Restaurant) => {
    const pickupTime = restaurant.area === customer.area ? 5 : 10;
    const deliveryTime = restaurant.area === customer.area ? 5 : 10;
    return pickupTime + deliveryTime;
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'All' || restaurant.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Sort restaurants - same area first
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    const aIsSameArea = a.area === customer.area;
    const bIsSameArea = b.area === customer.area;
    
    if (aIsSameArea && !bIsSameArea) return -1;
    if (!aIsSameArea && bIsSameArea) return 1;
    return 0;
  });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#0F1825]">
      {/* Top Bar */}
      <div className="bg-[#1A2332] shadow-md sticky top-0 z-40 border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white">Browse Restaurants</h2>
              <p className="text-sm text-[#9CA3AF]">
                Delivering to {customer.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onViewProfile}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
              </button>
              {cartItemCount > 0 && (
                <button
                  onClick={onViewCart}
                  className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="hidden md:inline text-lg">Cart</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-7 h-7 flex items-center justify-center rounded-full font-bold">
                    {cartItemCount}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map(restaurant => {
            const deliveryTime = calculateDeliveryTime(restaurant);
            const isInCart = cart.some(item => item.restaurantId === restaurant.restaurantId);

            return (
              <button
                key={restaurant.restaurantId}
                onClick={() => onSelectRestaurant(restaurant)}
                className="bg-[#1E293B] rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden text-left group relative border-2 border-[#334155] hover:border-[#10B981]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#10B981] text-white px-3 py-1 rounded-full">
                    {restaurant.area}
                  </div>
                  {isInCart && (
                    <div className="absolute top-3 left-3 bg-[#3B82F6] text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      <span className="text-xs">In Cart</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white mb-2">{restaurant.name}</h3>
                  <p className="text-[#9CA3AF] text-sm mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <Clock className="w-4 h-4 text-[#10B981]" />
                      <span>{deliveryTime} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#3B82F6] text-sm">
                      <span>View Menu</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF]">No restaurants found</p>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-full shadow-2xl px-6 py-4 cursor-pointer hover:shadow-xl transition-all z-50"
             onClick={onViewCart}>
          <div className="flex items-center gap-4">
            <ShoppingCart className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-90">{cartItemCount} items</div>
              <div className="font-bold">${cartTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}