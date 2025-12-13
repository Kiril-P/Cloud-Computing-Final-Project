import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Clock, MapPin, Check, Plus, Minus, Trash2 } from 'lucide-react';
import type { OrderItem, Customer, Order } from '../../types';
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

  const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';

  const handlePlaceOrder = async () => {
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

    // send to Azure OrderApi
    try {
      const res = await fetch(`${API_BASE}/orderapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: newOrder.area,
          orderId: newOrder.orderId,
          customerId: newOrder.customerId,
          dishesOrdered: newOrder.dishesOrdered,
          estimatedTime: newOrder.estimatedTime,
          estimatedArrival: newOrder.estimatedArrival,
          totalCost: `${newOrder.totalCost.toFixed(2)}€`,
          status: newOrder.status
        })
      });

      if (!res.ok) {
        console.error('OrderApi error', await res.text());
      }
    } catch (err) {
      console.error('Failed to send order to Azure', err);
    }

    // still keep local copy so UI/history keeps working
    const allOrders = getOrders();
    saveOrders([...allOrders, newOrder]);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0F1825] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-[#334155]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#22C55E]/10 to-[#3B82F6]/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <p className="text-sm text-[#9CA3AF]">Order confirmed</p>
                <h2 className="text-lg font-semibold text-white">Thank you for your order!</h2>
              </div>
            </div>
          </div>

          <div className="bg-[#020617] rounded-xl p-4 mb-4 border border-[#1F2937]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111827] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Estimated arrival</p>
                  <p className="text-sm font-medium text-white">{estimatedArrival}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-xs text-[#22C55E] border border-[#22C55E]/30">
                {estimatedTime} min
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF]">Delivering to</p>
                <p className="text-sm font-medium text-white">
                  {customer.name} {customer.lastName}
                </p>
                <p className="text-xs text-[#9CA3AF]">{customer.address}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <MapPin className="w-3 h-3 text-[#3B82F6]" />
                <span>{customer.area} area</span>
              </div>
            </div>
          </div>

          <div className="bg-[#020617] rounded-xl p-4 border border-[#1F2937] mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Order summary</p>
                <p className="text-sm font-medium text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items from {restaurants.length} restaurants
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {restaurants.map(restaurantId => (
                <div key={restaurantId} className="border border-[#1F2937] rounded-lg p-3 bg-[#020617]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white">Restaurant {restaurantId}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#111827] text-[#9CA3AF]">
                      {itemsByRestaurant[restaurantId].length} items
                    </span>
                  </div>
                  <div className="space-y-2">
                    {itemsByRestaurant[restaurantId].map(item => (
                      <div key={item.dishId} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#9CA3AF]">×{item.quantity}</span>
                          <span className="text-white">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                          <p className="text-[10px] text-[#6B7280]">{item.prepTime} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-[#1F2937] pt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-[#9CA3AF]">Items total</span>
                <span className="text-white">{totalCost.toFixed(2)}€</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#6B7280]">Delivery & service fees</span>
                <span className="text-[#6B7280]">Included</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-white">Total paid</span>
                <span className="text-[#22C55E]">{totalCost.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-2.5 mt-2 text-sm text-[#E5E7EB] border border-[#374151] rounded-lg hover:bg-[#111827] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (dishId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(dishId, newQuantity);
  };

  const handleRemoveItem = (dishId: string) => {
    onUpdateQuantity(dishId, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Order Review */}
        <div className="lg:col-span-3 space-y-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to restaurant selection
          </button>

          <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl shadow-black/40">
            <div className="border-b border-[#1F2937] p-4 flex justify-between items-center bg-gradient-to-r from-[#020617] to-[#020617]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <h1 className="text-base font-semibold text-white">Review and confirm your order</h1>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  Delivering to {customer.address} ({customer.area} area)
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#111827] border border-[#1F2937]">
                <span className="text-[11px] text-[#9CA3AF]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items • {restaurants.length} restaurants
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
              {restaurants.map(restaurantId => (
                <div key={restaurantId} className="border border-[#1F2937] rounded-xl bg-[#020617] p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-xs font-medium text-white">Restaurant {restaurantId}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {itemsByRestaurant[restaurantId].length} items • Area: {itemsByRestaurant[restaurantId][0].area}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-[#3B82F6]" />
                      <span className="text-[#9CA3AF]">
                        ~
                        {Math.max(
                          ...itemsByRestaurant[restaurantId].map(item => item.prepTime)
                        )}{' '}
                        min
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {itemsByRestaurant[restaurantId].map(item => (
                      <div
                        key={item.dishId}
                        className="flex items-center justify-between py-2 px-2 rounded-lg bg-[#020617] hover:bg-[#020617] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => handleQuantityChange(item.dishId, item.quantity + 1)}
                              className="w-5 h-5 rounded-full bg-[#111827] flex items-center justify-center hover:bg-[#1F2937]"
                            >
                              <Plus className="w-3 h-3 text-[#E5E7EB]" />
                            </button>
                            <span className="text-xs text-white font-medium mt-1 mb-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.dishId, item.quantity - 1)}
                              className="w-5 h-5 rounded-full bg-[#111827] flex items-center justify-center hover:bg-[#1F2937]"
                            >
                              <Minus className="w-3 h-3 text-[#E5E7EB]" />
                            </button>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-white">{item.name}</p>
                            <p className="text-[11px] text-[#6B7280]">{item.description}</p>
                            <p className="text-[11px] text-[#6B7280] mt-1">
                              {item.prepTime} min • {item.area} area
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold text-white">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.dishId)}
                            className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#F97373] hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-10 flex flex-col items-center justify-center text-center text-[#6B7280]">
                  <div className="w-10 h-10 rounded-full bg-[#020617] flex items-center justify-center mb-3">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <p className="text-xs">Your cart is empty</p>
                  <p className="text-[11px]">Go back to browse restaurants and add some dishes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                Delivery summary
              </h2>
              <span className="px-2 py-1 rounded-full bg-[#111827] text-[11px] text-[#9CA3AF]">
                {estimatedTime} min • ETA {estimatedArrival}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Items total</span>
                <span className="text-white">{totalCost.toFixed(2)}€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Delivery & service fees</span>
                <span className="text-[#9CA3AF]">Included</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]">
                <span className="text-white font-medium">Total due</span>
                <span className="text-[#22C55E] font-semibold">{totalCost.toFixed(2)}€</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="bg-[#020617] border border-[#1F2937] rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Delivery address</p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {customer.address}, {customer.area} area
                    </p>
                    <p className="text-[11px] text-[#6B7280] mt-1">
                      {restaurants.length} restaurant(s) across {uniqueAreas.length} area(s)
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#22C55E] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-[#3B82F6]"
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
