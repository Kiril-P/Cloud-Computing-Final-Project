import { useState, useEffect } from 'react';
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
      case 'pending': return 'text-yellow-700 bg-yellow-100 border border-yellow-300';
      case 'preparing': return 'text-blue-700 bg-blue-100 border border-blue-300';
      case 'delivering': return 'text-purple-700 bg-purple-100 border border-purple-300';
      case 'delivered': return 'text-green-700 bg-green-100 border border-green-300';
      default: return 'text-gray-700 bg-gray-100 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#fc542e] hover:text-[#e64820] mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* profile header */}
        <div className="bg-gradient-to-r from-[#fc542e] to-[#e64820] rounded-lg shadow-md p-8 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="mb-1 text-white font-bold">{formData.name} {formData.lastName}</h2>
              <p className="opacity-90 font-medium">{formData.area} Area</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-medium ${
                activeTab === 'profile'
                  ? 'text-[#fc542e] border-b-2 border-[#fc542e]'
                  : 'text-gray-600 hover:text-[#fc542e]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-medium ${
                activeTab === 'orders'
                  ? 'text-[#fc542e] border-b-2 border-[#fc542e]'
                  : 'text-gray-600 hover:text-[#fc542e]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                <span>Order History</span>
                {orders.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#fc542e] text-white rounded-full text-xs font-bold">
                    {orders.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* profile tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-[#1a1a1a] font-bold">Personal Information</h3>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-[#fc542e] text-white px-4 py-2 rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all font-bold shadow-md"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#fc542e]" />
                    <span>First Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#fc542e]" />
                    <span>Last Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#fc542e]" />
                    <span>Area</span>
                  </div>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 font-medium"
                >
                  <option value="North">North</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#fc542e]" />
                    <span>Phone</span>
                  </div>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#fc542e]" />
                    <span>Address</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* orders tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-[#1a1a1a] mb-2 font-bold">No orders yet</h3>
                <p className="text-gray-600">Start ordering to see your order history here</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[#1a1a1a] font-semibold">Order #{order.orderId.slice(-8)}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
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
                      <div className="text-[#fc542e] mb-1 font-bold">${order.totalCost.toFixed(2)}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{order.estimatedTime} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      {order.dishesOrdered.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-[#1a1a1a] font-medium">
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