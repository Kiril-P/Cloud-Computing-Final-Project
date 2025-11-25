import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Clock, MapPin, Check, Plus, Minus, Trash2 } from 'lucide-react';
import { OrderItem, Customer, Order } from '../../types';
import { getOrders, saveOrders } from '../../utils/mockData';

interface OrderSummaryProps {
  customer: Customer;
  cart: OrderItem[];
  onBack: () => void;
  onPlaceOrder: () => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
}

export function OrderSummary({ customer, cart, onBack, onPlaceOrder, onUpdateQuantity }: OrderSummaryProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Group cart items by restaurant
  const itemsByRestaurant = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = [];
    }
    acc[item.restaurantId].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  const restaurants = Object.keys(itemsByRestaurant);
  const uniqueAreas = [...new Set(cart.map(item => item.area))];

  // Calculate delivery time
  const calculateDeliveryTime = () => {
    if (restaurants.length === 0) return 0;

    // Get max prep time across all items (longest prep time from a single restaurant)
    const maxPrepTime = Math.max(
      ...Object.values(itemsByRestaurant).map(items =>
        Math.max(...items.map(item => item.prepTime))
      )
    );

    // Count restaurants in same area and different areas
    const sameAreaRestaurants = cart.filter(item => item.area === customer.area).length > 0 
      ? new Set(cart.filter(item => item.area === customer.area).map(item => item.restaurantId)).size 
      : 0;
    const differentAreaRestaurants = cart.filter(item => item.area !== customer.area).length > 0
      ? new Set(cart.filter(item => item.area !== customer.area).map(item => item.restaurantId)).size
      : 0;

    const pickupTime = (sameAreaRestaurants * 5) + (differentAreaRestaurants * 10);
    
    // Max delivery time (10 min if any restaurant is in different area, 5 min otherwise)
    const deliveryTime = differentAreaRestaurants > 0 ? 10 : 5;

    return maxPrepTime + pickupTime + deliveryTime;
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedTime = calculateDeliveryTime();
  const estimatedArrival = new Date(Date.now() + estimatedTime * 60000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      area: customer.area,
      orderId: `order-${Date.now()}`,
      customerId: customer.customerId,
      dishesOrdered: cart,
      estimatedArrival,
      estimatedTime,
      status: 'pending',
      totalCost,
      createdAt: new Date().toISOString()
    };

    const allOrders = getOrders();
    saveOrders([...allOrders, newOrder]);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0F1825] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-xl p-8 text-center border border-[#334155]">
          <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white mb-3">Order Placed Successfully!</h2>
          <p className="text-[#9CA3AF] mb-6">
            Your order has been confirmed and is being prepared
          </p>
          <div className="bg-[#0F1825] rounded-lg p-4 mb-6 space-y-2 border border-[#334155]">
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Estimated arrival:</span>
              <span className="text-white">{estimatedArrival}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Estimated time:</span>
              <span className="text-white">{estimatedTime} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Total:</span>
              <span className="text-[#10B981]">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onPlaceOrder}
            className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1825]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-lg transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
          <div className="bg-[#1E293B] rounded-lg shadow-md p-12 text-center border border-[#334155]">
            <ShoppingCart className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-white mb-2">Your cart is empty</h3>
            <p className="text-[#9CA3AF] mb-6">Add some delicious food to get started!</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1825]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-lg transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1E293B] rounded-lg shadow-md p-6 border border-[#334155]">
              <h2 className="text-white mb-4">Order Summary</h2>

              {Object.entries(itemsByRestaurant).map(([restaurantId, items]) => (
                <div key={restaurantId} className="mb-6 last:mb-0">
                  <h4 className="text-white mb-3 pb-2 border-b border-[#334155]">
                    Restaurant Order
                  </h4>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.dishId} className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p className="text-white">{item.name}</p>
                          <p className="text-sm text-[#9CA3AF]">${item.price.toFixed(2)} each</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#0F1825] rounded-lg p-1 border border-[#334155]">
                            <button
                              onClick={() => onUpdateQuantity(item.dishId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#1E293B] rounded-md hover:bg-[#334155] text-[#3B82F6] transition-colors border border-[#334155]"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.dishId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-[#1E293B] rounded-md hover:bg-[#334155] text-[#3B82F6] transition-colors border border-[#334155]"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => onUpdateQuantity(item.dishId, 0)}
                            className="w-7 h-7 flex items-center justify-center bg-red-500/20 rounded-md hover:bg-red-500/30 text-red-400 transition-colors border border-red-500/50"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <span className="text-[#10B981] min-w-[80px] text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1E293B] rounded-lg shadow-md p-6 border border-[#334155]">
              <h3 className="text-white mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#10B981] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#9CA3AF]">Delivering to</p>
                    <p className="text-white">{customer.address}</p>
                    <p className="text-sm text-[#9CA3AF]">{customer.area} Area</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#9CA3AF]">Estimated delivery</p>
                    <p className="text-white">{estimatedArrival}</p>
                    <p className="text-sm text-[#9CA3AF]">~{estimatedTime} minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-lg shadow-md p-6 sticky top-6 border border-[#334155]">
              <h3 className="text-white mb-4">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Subtotal</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Delivery Fee</span>
                  <span className="text-[#10B981]">Free</span>
                </div>
                <div className="border-t border-[#334155] pt-3 flex justify-between">
                  <span className="text-white">Total</span>
                  <span className="text-[#10B981]">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#0F1825] rounded-lg p-4 mb-6 space-y-2 text-sm border border-[#334155]">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Items:</span>
                  <span className="text-white">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Restaurants:</span>
                  <span className="text-white">{restaurants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Areas:</span>
                  <span className="text-white">{uniqueAreas.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-[#3B82F6]"
              >
                <Check className="w-5 h-5" />
                Place Order
              </button>

              <p className="text-xs text-[#9CA3AF] text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}