import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Restaurant, MenuItem, OrderItem, Customer } from '../../types';
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
    <div className="min-h-screen bg-gray-50">
      {/* restaurant header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#fc542e] hover:text-[#e64820] mb-4 font-medium"
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
                  <h2 className="text-[#1a1a1a] mb-2 font-bold">{restaurant.name}</h2>
                  <p className="text-gray-600 mb-3">{restaurant.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#fc542e]/10 text-[#fc542e] rounded-full text-sm border border-[#fc542e] font-medium">
                      {restaurant.area}
                    </span>
                    <span className="text-sm text-gray-600">{restaurant.phone}</span>
                  </div>
                </div>
                {cartItemCount > 0 && (
                  <button
                    onClick={onViewCart}
                    className="relative flex items-center gap-2 px-10 py-8 bg-[#fc542e] text-white rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all font-bold"
                  >
                    <ShoppingCart className="w-10 h-10" />
                    <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* menu items */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-[#1a1a1a] mb-6 font-bold">Menu</h3>

        <div className="space-y-4">
          {menuItems.map(meal => {
            const quantityInCart = getItemQuantityInCart(meal.dishId);

            return (
              <div
                key={meal.dishId}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all border border-gray-200"
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
                        <h4 className="text-[#1a1a1a] mb-1 font-semibold">{meal.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-[#fc542e] font-bold">${meal.price.toFixed(2)}</span>
                          <span className="text-gray-600">Prep: {meal.prepTime} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-300">
                            <button
                              onClick={() => onUpdateQuantity(meal.dishId, quantityInCart - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-gray-100 text-[#fc542e] transition-colors border border-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-[#1a1a1a] font-medium">{quantityInCart}</span>
                            <button
                              onClick={() => onUpdateQuantity(meal.dishId, quantityInCart + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-gray-100 text-[#fc542e] transition-colors border border-gray-300"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-sm text-[#fc542e] font-medium">Added to cart</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(meal)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#fc542e] text-white rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all font-bold"
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No menu items available</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-8">
            <button
              onClick={onViewCart}
              className="w-full py-4 bg-[#fc542e] text-white rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold"
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