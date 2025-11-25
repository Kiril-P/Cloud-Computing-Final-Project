import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, MapPin, Phone, Package, Clock } from 'lucide-react';
import type { Customer, Order, Area } from '../../types';
import { getCustomers, saveCustomers, getOrders } from '../../utils/mockData';

interface CustomerProfileProps {
  customer: Customer;
  onBack: () => void;
  onUpdateCustomer: (customer: Customer) => void;
}

export function CustomerProfile({ customer, onBack, onUpdateCustomer }: CustomerProfileProps) {
  const [formData, setFormData] = useState<Customer>(customer);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    const allOrders = getOrders();
    const customerOrders = allOrders
      .filter(order => order.customerId === customer.customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(customerOrders);
  }, [customer.customerId]);

  const handleSaveProfile = () => {
    const allCustomers = getCustomers();
    const updatedCustomers = allCustomers.map(c =>
      c.customerId === formData.customerId ? formData : c
    );
    saveCustomers(updatedCustomers);
    onUpdateCustomer(formData);
    alert('Profile updated successfully!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/50';
      case 'preparing': return 'text-blue-400 bg-blue-500/20 border border-blue-500/50';
      case 'delivering': return 'text-purple-400 bg-purple-500/20 border border-purple-500/50';
      case 'delivered': return 'text-green-400 bg-green-500/20 border border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1825]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] rounded-lg shadow-md p-8 mb-6 text-white border border-[#334155]">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="mb-1 text-white">{formData.name} {formData.lastName}</h2>
              <p className="opacity-90">{formData.area} Area</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1E293B] rounded-lg shadow-md mb-6 border border-[#334155]">
          <div className="flex border-b border-[#334155]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 ${
                activeTab === 'profile'
                  ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 ${
                activeTab === 'orders'
                  ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                <span>Order History</span>
                {orders.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#10B981] text-white rounded-full text-xs">
                    {orders.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-[#1E293B] rounded-lg shadow-md p-6 border border-[#334155]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-white">Personal Information</h3>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#9CA3AF]" />
                    <span>First Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#9CA3AF]" />
                    <span>Last Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                    <span>Area</span>
                  </div>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-white"
                >
                  <option value="North">North</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#9CA3AF]" />
                    <span>Phone</span>
                  </div>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                    <span>Address</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-[#1E293B] rounded-lg shadow-md p-12 text-center border border-[#334155]">
                <Package className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-white mb-2">No orders yet</h3>
                <p className="text-[#9CA3AF]">Start ordering to see your order history here</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="bg-[#1E293B] rounded-lg shadow-md p-6 border border-[#334155]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white">Order #{order.orderId.slice(-8)}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#9CA3AF]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#10B981] mb-1">${order.totalCost.toFixed(2)}</div>
                      <div className="flex items-center gap-1 text-sm text-[#9CA3AF]">
                        <Clock className="w-3 h-3" />
                        <span>{order.estimatedTime} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#334155] pt-4">
                    <div className="space-y-2">
                      {order.dishesOrdered.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-[#9CA3AF]">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}