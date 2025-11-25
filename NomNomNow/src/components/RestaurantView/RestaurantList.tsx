import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone } from 'lucide-react';
import { Restaurant, Area } from '../../types';
import { getRestaurants } from '../../utils/mockData';
import { SearchAndFilter } from '../SearchAndFilter';

interface RestaurantListProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onCreateNew: () => void;
}

export function RestaurantList({ onSelectRestaurant, onCreateNew }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | 'All'>('All');

  useEffect(() => {
    setRestaurants(getRestaurants());
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'All' || restaurant.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="min-h-screen bg-[#0F1825]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-white">Restaurant Management</h2>
            <p className="text-[#9CA3AF] mt-2">
              Select a restaurant to edit or create a new one
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
          >
            <Plus className="w-5 h-5" />
            New Restaurant
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <button
              key={restaurant.restaurantId}
              onClick={() => onSelectRestaurant(restaurant)}
              className="bg-[#1E293B] rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden text-left group border-2 border-[#334155] hover:border-[#3B82F6]"
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
              </div>
              <div className="p-4">
                <h3 className="text-white mb-2">{restaurant.name}</h3>
                <p className="text-[#9CA3AF] text-sm mb-3 line-clamp-2">
                  {restaurant.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <MapPin className="w-4 h-4 text-[#10B981]" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <Phone className="w-4 h-4 text-[#3B82F6]" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF]">No restaurants found</p>
          </div>
        )}
      </div>
    </div>
  );
}