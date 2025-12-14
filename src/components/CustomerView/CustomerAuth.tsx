import { useState } from 'react';
import { UserPlus, Users, ArrowLeft } from 'lucide-react';
import type { Customer, Area } from '../../types';
import { getCustomers, saveCustomers } from '../../utils/mockData';
import { SearchAndFilter } from '../SearchAndFilter';

interface CustomerAuthProps {
  onCustomerSelect: (customer: Customer) => void;
  onBack: () => void;
}

export function CustomerAuth({ onCustomerSelect, onBack }: CustomerAuthProps) {
  const [view, setView] = useState<'choice' | 'create' | 'select'>('choice');
  const [customers] = useState<Customer[]>(getCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | 'All'>('All');
  const [formData, setFormData] = useState<Partial<Customer>>({
    area: 'North',
    name: '',
    lastName: '',
    address: '',
    phone: ''
  });

  const handleCreateCustomer = () => {
    if (!formData.name || !formData.lastName || !formData.address || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // generate customer id in format C011, C012, etc.
    const allCustomers = getCustomers();
    const existingIds = allCustomers
      .map(c => c.customerId)
      .filter(id => /^C\d+$/.test(id))
      .map(id => parseInt(id.substring(1), 10))
      .filter(num => !isNaN(num));
    
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 11;
    const customerId = `C${nextId.toString().padStart(3, '0')}`;

    const newCustomer: Customer = {
      area: formData.area as Area,
      customerId,
      name: formData.name,
      lastName: formData.lastName,
      address: formData.address,
      phone: formData.phone
    };

    saveCustomers([...allCustomers, newCustomer]);
    onCustomerSelect(newCustomer);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'All' || customer.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  if (view === 'choice') {
    return (
      <div className="min-h-screen bg-[#0F1825] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#334155] rounded-lg text-[#9CA3AF] hover:text-white hover:border-[#3B82F6] transition-colors bg-[#1E293B]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="mb-4 text-white">
              Welcome to NomNomNow
            </h1>
            <p className="text-xl text-[#9CA3AF]">How would you like to continue?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setView('create')}
              className="group bg-[#1E293B] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-[#334155] hover:border-[#10B981]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-3 text-white">New Customer</h2>
              <p className="text-[#9CA3AF]">
                Create a new account to start ordering
              </p>
            </button>

            <button
              onClick={() => setView('select')}
              className="group bg-[#1E293B] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-[#334155] hover:border-[#3B82F6]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-3 text-white">Existing Customer</h2>
              <p className="text-[#9CA3AF]">
                Sign in to your account to continue ordering
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-[#0F1825] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 border border-[#334155]">
            <h2 className="text-white mb-6">Create New Account</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white placeholder-[#9CA3AF]"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white placeholder-[#9CA3AF]"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                >
                  <option value="North">North</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white placeholder-[#9CA3AF]"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1825] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white placeholder-[#9CA3AF]"
                  placeholder="555-1234"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setView('choice')}
                className="flex-1 px-6 py-3 border-2 border-[#334155] text-[#9CA3AF] rounded-lg hover:bg-[#334155] hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateCustomer}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg hover:shadow-lg transition-all border-2 border-[#3B82F6]"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1825]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-white mb-2">Select Your Account</h2>
          <p className="text-[#9CA3AF]">Choose your customer profile to continue</p>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <button
              key={customer.customerId}
              onClick={() => onCustomerSelect(customer)}
              className="bg-[#1E293B] rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left group border-2 border-[#334155] hover:border-[#10B981]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#10B981] rounded-full flex items-center justify-center text-white">
                  {customer.name[0]}{customer.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-white">{customer.name} {customer.lastName}</h3>
                  <span className="text-sm text-[#10B981]">{customer.area}</span>
                </div>
              </div>
              <div className="text-sm text-[#9CA3AF] space-y-1">
                <p className="line-clamp-1">{customer.address}</p>
                <p>{customer.phone}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF] mb-4">No customers found</p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => setView('choice')}
            className="px-4 py-2 border-2 border-[#334155] rounded-lg text-[#3B82F6] hover:bg-[#334155] hover:text-white transition-colors bg-[#1E293B]"
          >
            ← Back to options
          </button>
        </div>
      </div>
    </div>
  );
}