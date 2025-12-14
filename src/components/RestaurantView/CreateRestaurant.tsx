import { useState } from 'react';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import type { Restaurant, MenuItem, Area } from '../../types';
import { getRestaurants, saveRestaurants, getMenuItems, saveMenuItems } from '../../utils/mockData';

interface CreateRestaurantProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateRestaurant({ onBack, onSuccess }: CreateRestaurantProps) {
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    area: 'North',
    name: '',
    description: '',
    address: '',
    phone: '',
    image: 'https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNjM4Nzk3OTR8MA&ixlib=rb-4.1.0&q=80&w=400'
  });

  const [meals, setMeals] = useState<Partial<MenuItem>[]>([]);
  const [showMealForm, setShowMealForm] = useState(false);

  const handleCreateRestaurant = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // generate sequential restaurant id in format R001, R002, etc.
    const allRestaurants = getRestaurants();
    const existingIds = allRestaurants
      .map(r => r.restaurantId)
      .filter(id => id.match(/^R\d+$/))
      .map(id => parseInt(id.substring(1)));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const restaurantId = `R${String(maxId + 1).padStart(3, '0')}`;
    
    const newRestaurant: Restaurant = {
      area: formData.area as Area,
      restaurantId,
      name: formData.name,
      description: formData.description || '',
      address: formData.address,
      phone: formData.phone,
      image: formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    };

    const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';
    
    // send restaurant to azure restaurantapi
    try {
      const res = await fetch(`${API_BASE}/restaurantapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: newRestaurant.area,
          restaurantId: newRestaurant.restaurantId,
          name: newRestaurant.name,
          description: newRestaurant.description,
          address: newRestaurant.address,
          phone: newRestaurant.phone,
          imageURL: newRestaurant.image
        })
      });

      if (!res.ok) {
        console.error('RestaurantApi POST error', await res.text());
        alert('Failed to create restaurant in Azure');
        return;
      }
    } catch (err) {
      console.error('Failed to create restaurant in Azure', err);
      alert('Failed to create restaurant in Azure');
      return;
    }

    // update local storage for immediate ui update
    saveRestaurants([...allRestaurants, newRestaurant]);

    // save meals to azure if any
    if (meals.length > 0) {
      // generate sequential dish ids in format D001, D002, etc.
      const allMenuItems = getMenuItems();
      const existingDishNumbers = allMenuItems
        .map(m => m.dishId)
        .filter(id => id.match(/^D\d+$/))
        .map(id => parseInt(id.substring(1)));
      const maxDishNumber = existingDishNumbers.length > 0 ? Math.max(...existingDishNumbers) : 0;
      
      const newMenuItems: MenuItem[] = meals.map((meal, index) => ({
        area: formData.area as Area,
        dishId: `D${String(maxDishNumber + index + 1).padStart(3, '0')}`,
        restaurantId,
        name: meal.name || '',
        description: meal.description || '',
        isAvailable: meal.isAvailable ?? true,
        prepTime: meal.prepTime || 15,
        price: meal.price || 0,
        image: meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
      }));

      // send each meal to azure menuapi
      for (const meal of newMenuItems) {
        try {
          const res = await fetch(`${API_BASE}/menuapi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              area: meal.area,
              dishId: meal.dishId,
              name: meal.name,
              description: meal.description,
              price: meal.price,
              restaurantId: meal.restaurantId,
              imageURL: meal.image,
              isAvailable: meal.isAvailable,
              prepTime: meal.prepTime
            })
          });

          if (!res.ok) {
            console.error('MenuApi POST error', await res.text());
            alert(`Failed to create meal "${meal.name}" in Azure`);
            return;
          }
        } catch (err) {
          console.error('Failed to create meal in Azure', err);
          alert(`Failed to create meal "${meal.name}" in Azure`);
          return;
        }
      }

      // update local storage for immediate ui update
      saveMenuItems([...allMenuItems, ...newMenuItems]);
    }

    alert('Restaurant created successfully!');
    onSuccess();
  };

  const handleAddMeal = (meal: Partial<MenuItem>) => {
    setMeals([...meals, meal]);
    setShowMealForm(false);
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#fc542e] text-[#fc542e] hover:bg-[#fc542e] hover:text-white rounded-lg transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[#1a1a1a] font-bold">Create New Restaurant</h2>
              <p className="text-gray-600 mt-1">Fill in the details for your new restaurant</p>
            </div>
            <button
              onClick={handleCreateRestaurant}
              className="flex items-center gap-2 bg-[#fc542e] text-white px-6 py-3 rounded-lg hover:bg-[#e64820] hover:shadow-lg transition-all font-bold shadow-md"
            >
              <Save className="w-5 h-5" />
              Create Restaurant
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Restaurant Name <span className="text-[#fc542e]">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                placeholder="Enter restaurant name"
              />
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
                Phone <span className="text-[#fc542e]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                placeholder="555-1234"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Image URL</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">
                Address <span className="text-[#fc542e]">*</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                placeholder="123 Main Street"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900"
                placeholder="Describe your restaurant"
              />
            </div>
          </div>
        </div>

        {/* meals section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[#1a1a1a] font-bold">Menu Items</h3>
              <p className="text-gray-600 text-sm mt-1">Add meals to your restaurant menu (optional)</p>
            </div>
            {!showMealForm && (
              <button
                onClick={() => setShowMealForm(true)}
                className="flex items-center gap-2 bg-[#fc542e] text-white px-4 py-2 rounded-lg hover:bg-[#e64820] transition-colors font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            )}
          </div>

          {showMealForm && (
            <NewMealForm
              onAdd={handleAddMeal}
              onCancel={() => setShowMealForm(false)}
            />
          )}

          {meals.length > 0 && (
            <div className="space-y-3 mt-6">
              {meals.map((meal, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <img
                    src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-[#1a1a1a] font-semibold">{meal.name}</h4>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1">
                      <span className="text-[#fc542e] font-bold">${meal.price?.toFixed(2)}</span>
                      <span>{meal.prepTime} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMeal(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {meals.length === 0 && !showMealForm && (
            <div className="text-center py-8 text-gray-600">
              No meals added yet. Click "Add Meal" to start building your menu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NewMealFormProps {
  onAdd: (meal: Partial<MenuItem>) => void;
  onCancel: () => void;
}

function NewMealForm({ onAdd, onCancel }: NewMealFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(({
    name: '',
    description: '',
    isAvailable: true,
    prepTime: 15,
    price: 0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }));

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in meal name and price');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="border-2 border-dashed border-[#fc542e] rounded-lg p-4 bg-white">
      <h4 className="text-[#1a1a1a] mb-4 font-bold">New Meal</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Name <span className="text-[#fc542e]">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 text-sm"
            placeholder="Meal name"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Price ($) <span className="text-[#fc542e]">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 text-sm"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Prep Time (min)</label>
          <input
            type="number"
            value={formData.prepTime || ''}
            onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 text-sm"
            placeholder="15"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={formData.isAvailable ?? true}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-[#fc542e] focus:ring-[#fc542e] rounded bg-gray-50 border-gray-300"
            />
            <span className="text-sm text-gray-700 font-medium">Available</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 text-sm"
            placeholder="Describe the meal"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Image URL</label>
          <input
            type="url"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc542e] text-gray-900 text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#fc542e] text-white rounded-lg hover:bg-[#e64820] transition-colors font-bold shadow-md"
          >
            Add Meal
          </button>
        </div>
      </div>
    </div>
  );
}