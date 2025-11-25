import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Restaurant, MenuItem, Area } from '../../types';
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

  const handleCreateRestaurant = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const restaurantId = `${formData.area?.toLowerCase()}-rest-${Date.now()}`;
    const newRestaurant: Restaurant = {
      area: formData.area as Area,
      restaurantId,
      name: formData.name,
      description: formData.description || '',
      address: formData.address,
      phone: formData.phone,
      image: formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    };

    const allRestaurants = getRestaurants();
    saveRestaurants([...allRestaurants, newRestaurant]);

    // Save meals if any
    if (meals.length > 0) {
      const allMenuItems = getMenuItems();
      const newMenuItems: MenuItem[] = meals.map((meal, index) => ({
        area: formData.area as Area,
        dishId: `${restaurantId}-dish-${index + 1}`,
        restaurantId,
        name: meal.name || '',
        description: meal.description || '',
        isAvailable: meal.isAvailable ?? true,
        prepTime: meal.prepTime || 15,
        price: meal.price || 0,
        image: meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
      }));
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--primary-blue)] hover:text-white rounded-lg transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        <div className="bg-[var(--bg-card)] rounded-lg shadow-md p-6 mb-8 border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[var(--text-primary)]">Create New Restaurant</h2>
              <p className="text-[var(--text-secondary)] mt-1">Fill in the details for your new restaurant</p>
            </div>
            <button
              onClick={handleCreateRestaurant}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-green)] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              Create Restaurant
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--text-primary)] mb-2">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] mb-2">
                Area <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              >
                <option value="North">North</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-primary)] mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
                placeholder="555-1234"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--text-primary)] mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
                placeholder="123 Main Street"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--text-primary)] mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
                placeholder="Describe your restaurant"
              />
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="bg-[var(--bg-card)] rounded-lg shadow-md p-6 border border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[var(--text-primary)]">Menu Items</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Add meals to your restaurant menu (optional)</p>
            </div>
            {!showMealForm && (
              <button
                onClick={() => setShowMealForm(true)}
                className="flex items-center gap-2 bg-[var(--primary-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition-colors"
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
                <div key={index} className="flex items-center gap-4 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
                  <img
                    src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-[var(--text-primary)]">{meal.name}</h4>
                    <div className="flex gap-3 text-sm text-[var(--text-secondary)] mt-1">
                      <span className="text-[var(--primary-green)]">${meal.price?.toFixed(2)}</span>
                      <span>{meal.prepTime} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMeal(index)}
                    className="p-2 text-red-500 hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {meals.length === 0 && !showMealForm && (
            <div className="text-center py-8 text-[var(--text-secondary)]">
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
    <div className="border-2 border-dashed border-[var(--primary-blue)] rounded-lg p-4 bg-[var(--bg-secondary)]">
      <h4 className="text-[var(--text-primary)] mb-4">New Meal</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[var(--text-primary)] mb-1 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
            placeholder="Meal name"
          />
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-1 text-sm">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-1 text-sm">Prep Time (min)</label>
          <input
            type="number"
            value={formData.prepTime || ''}
            onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
            placeholder="15"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={formData.isAvailable ?? true}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-[var(--primary-green)] focus:ring-[var(--primary-green)] rounded bg-[var(--bg-primary)] border-[var(--border-color)]"
            />
            <span className="text-sm text-[var(--text-primary)]">Available</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[var(--text-primary)] mb-1 text-sm">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
            placeholder="Describe the meal"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[var(--text-primary)] mb-1 text-sm">Image URL</label>
          <input
            type="url"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--primary-green)] text-white rounded-lg hover:bg-[var(--dark-green)] transition-colors"
          >
            Add Meal
          </button>
        </div>
      </div>
    </div>
  );
}