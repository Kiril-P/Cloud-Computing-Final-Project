import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Restaurant, MenuItem, OrderItem, Customer } from '../../types';
import { getMenuItems } from '../../utils/mockData';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  customer: Customer;
  cart: OrderItem[];
  onAddToCart: (item: OrderItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onBack: () => void;
  onViewCart: () => void;
}

export function RestaurantMenu({
  restaurant,
  customer,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onBack,
  onViewCart
}: RestaurantMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const allMenuItems = getMenuItems();
    const restaurantMenuItems = allMenuItems.filter(
      item => item.restaurantId === restaurant.restaurantId && item.isAvailable
    );
    setMenuItems(restaurantMenuItems);
  }, [restaurant.restaurantId]);

  const getItemQuantityInCart = (dishId: string) => {
    const cartItem = cart.find(item => item.dishId === dishId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (meal: MenuItem) => {
    const orderItem: OrderItem = {
      dishId: meal.dishId,
      restaurantId: meal.restaurantId,
      quantity: 1,
      name: meal.name,
      price: meal.price,
      prepTime: meal.prepTime,
      area: meal.area
    };
    onAddToCart(orderItem);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0F1825]">
      {/* Restaurant Header */}
      <div className="bg-[#1A2332] shadow-md border-b border-[#334155]">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
          <div className="flex items-start gap-6">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-32 h-32 object-cover rounded-lg shadow-md hidden md:block"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white mb-2">{restaurant.name}</h2>
                  <p className="text-[#9CA3AF] mb-3">{restaurant.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-sm border border-[#10B981]">
                      {restaurant.area}
                    </span>
                    <span className="text-sm text-[#9CA3AF]">{restaurant.phone}</span>
                  </div>
                </div>
                {cartItemCount > 0 && (
                  <button
                    onClick={onViewCart}
                    className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                      {cartItemCount}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-white mb-6">Menu</h3>

        <div className="space-y-4">
          {menuItems.map(meal => {
            const quantityInCart = getItemQuantityInCart(meal.dishId);

            return (
              <div
                key={meal.dishId}
                className="bg-[#1E293B] rounded-lg shadow-md p-4 hover:shadow-lg transition-all border border-[#334155]"
              >
                <div className="flex gap-4">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white mb-1">{meal.name}</h4>
                        <p className="text-sm text-[#9CA3AF] mb-2">{meal.description}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-[#10B981]">${meal.price.toFixed(2)}</span>
                          <span className="text-[#9CA3AF]">Prep: {meal.prepTime} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-[#0F1825] rounded-lg p-1 border border-[#334155]">
                            <button
                              onClick={() => onUpdateQuantity(meal.dishId, quantityInCart - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-[#1E293B] rounded-md hover:bg-[#334155] text-[#3B82F6] transition-colors border border-[#334155]"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-white">{quantityInCart}</span>
                            <button
                              onClick={() => onUpdateQuantity(meal.dishId, quantityInCart + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-[#1E293B] rounded-md hover:bg-[#334155] text-[#3B82F6] transition-colors border border-[#334155]"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-sm text-[#10B981]">Added to cart</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(meal)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#334155]">
            <p className="text-[#9CA3AF]">No menu items available</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-8">
            <button
              onClick={onViewCart}
              className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-[#3B82F6]"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Cart ({cartItemCount} items)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}