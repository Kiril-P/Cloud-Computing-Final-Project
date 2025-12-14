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

  const handleCreateCustomer = async () => {
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

    const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';
    
    // send customer to azure customerapi
    try {
      const res = await fetch(`${API_BASE}/customerapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: newCustomer.area,
          customerId: newCustomer.customerId,
          name: newCustomer.name,
          lastName: newCustomer.lastName,
          address: newCustomer.address,
          phone: newCustomer.phone
        })
      });

      if (!res.ok) {
        console.error('CustomerApi POST error', await res.text());
        alert('Failed to create customer in Azure');
        return;
      }
    } catch (err) {
      console.error('Failed to create customer in Azure', err);
      alert('Failed to create customer in Azure');
      return;
    }

    // update local storage for immediate ui update
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* back button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:text-[#fc542e] hover:border-[#fc542e] transition-colors bg-white font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="mb-4 text-[#1a1a1a] font-bold">
              Welcome to NomNomNow
            </h1>
            <p className="text-xl text-gray-600">How would you like to continue?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setView('create')}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 hover:border-[#fc542e]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-3 text-[#1a1a1a] font-bold">New Customer</h2>
              <p className="text-gray-600">
                Create a new account to start ordering
              </p>
            </button>

            <button
              onClick={() => setView('select')}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-200 hover:border-[#fc542e]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-3 text-[#1a1a1a] font-bold">Existing Customer</h2>
              <p className="text-gray-600">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-[#1a1a1a] mb-6 font-bold">Create New Account</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    First Name <span className="text-[#fc542e]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 placeholder-gray-500"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Last Name <span className="text-[#fc542e]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 placeholder-gray-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Area <span className="text-[#fc542e]">*</span>
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
                  Address <span className="text-[#fc542e]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 placeholder-gray-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Phone <span className="text-[#fc542e]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 placeholder-gray-500"
                  placeholder="555-1234"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setView('choice')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleCreateCustomer}
                className="flex-1 px-6 py-3 bg-[#fc542e] text-white rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all font-bold"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-[#1a1a1a] mb-2 font-bold">Select Your Account</h2>
          <p className="text-gray-600">Choose your customer profile to continue</p>
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
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left group border-2 border-gray-200 hover:border-[#fc542e]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#fc542e] to-[#e64820] rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name[0]}{customer.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1a1a1a] font-semibold">{customer.name} {customer.lastName}</h3>
                  <span className="text-sm text-[#fc542e] font-medium">{customer.area}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="line-clamp-1">{customer.address}</p>
                <p>{customer.phone}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No customers found</p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => setView('choice')}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg text-[#fc542e] hover:bg-gray-100 transition-colors bg-white font-medium"
          >
            ← Back to options
          </button>
        </div>
      </div>
    </div>
  );
}