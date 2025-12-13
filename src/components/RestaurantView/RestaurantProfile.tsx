import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import type { Restaurant, MenuItem, Area } from '../../types';
import { getMenuItems, saveRestaurants, saveMenuItems, getRestaurants } from '../../utils/mockData';

interface RestaurantProfileProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function RestaurantProfile({ restaurant, onBack }: RestaurantProfileProps) {
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    const allMenuItems = getMenuItems();
    const restaurantMenuItems = allMenuItems.filter(
      item => item.restaurantId === restaurant.restaurantId
    );
    setMenuItems(restaurantMenuItems);
  }, [restaurant.restaurantId]);

  const handleSaveRestaurant = async () => {
    const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';
    
    // send to azure restaurantapi
    try {
      const res = await fetch(`${API_BASE}/restaurantapi`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: formData.restaurantId,
          area: formData.area,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          imageURL: formData.image
        })
      });

      if (!res.ok) {
        console.error('RestaurantApi PUT error', await res.text());
        alert('Failed to update restaurant in Azure');
        return;
      }
    } catch (err) {
      console.error('Failed to update restaurant in Azure', err);
      alert('Failed to update restaurant in Azure');
      return;
    }

    // update local storage for immediate ui update
    const allRestaurants = getRestaurants();
    const updatedRestaurants = allRestaurants.map(r =>
      r.restaurantId === formData.restaurantId ? formData : r
    );
    saveRestaurants(updatedRestaurants);
    alert('Restaurant updated successfully!');
  };

  const handleSaveMeal = async (meal: MenuItem) => {
    const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';
    
    // send to azure menuapi
    try {
      const res = await fetch(`${API_BASE}/menuapi`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishId: meal.dishId,
          area: meal.area,
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
        console.error('MenuApi PUT error', await res.text());
        alert('Failed to update meal in Azure');
        return;
      }
    } catch (err) {
      console.error('Failed to update meal in Azure', err);
      alert('Failed to update meal in Azure');
      return;
    }

    // update local storage for immediate ui update
    const allMenuItems = getMenuItems();
    const updatedMenuItems = allMenuItems.map(m =>
      m.dishId === meal.dishId ? meal : m
    );
    saveMenuItems(updatedMenuItems);
    setMenuItems(menuItems.map(m => m.dishId === meal.dishId ? meal : m));
    setEditingMeal(null);
    alert('Meal updated successfully!');
  };

  const handleDeleteMeal = (dishId: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      const allMenuItems = getMenuItems();
      const updatedMenuItems = allMenuItems.filter(m => m.dishId !== dishId);
      saveMenuItems(updatedMenuItems);
      setMenuItems(menuItems.filter(m => m.dishId !== dishId));
    }
  };

  const handleAddNewMeal = async (mealData: Partial<MenuItem>) => {
    if (!mealData.name || mealData.price === undefined || mealData.price === null) {
      alert('Please fill in all required fields');
      return;
    }

    // generate sequential dish id in format D001, D002, etc.
    const allMenuItems = getMenuItems();
    const existingDishNumbers = allMenuItems
      .map(m => m.dishId)
      .filter(id => id.match(/^D\d+$/))
      .map(id => parseInt(id.substring(1)));
    const maxDishNumber = existingDishNumbers.length > 0 ? Math.max(...existingDishNumbers) : 0;
    const dishId = `D${String(maxDishNumber + 1).padStart(3, '0')}`;

    const meal: MenuItem = {
      area: formData.area,
      dishId,
      restaurantId: formData.restaurantId,
      name: mealData.name,
      description: mealData.description || '',
      isAvailable: mealData.isAvailable ?? true,
      prepTime: mealData.prepTime || 15,
      price: mealData.price,
      image: mealData.image || 'https://images.unsplash.com/photo-1661260652741-65340f04f2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBmb29kJTIwbWVhbHxlbnwxfHx8fDE3NjM5NDgwMjd8MA&ixlib=rb-4.1.0&q=80&w=400'
    };

    const API_BASE = 'https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api';
    
    // send to azure menuapi
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
        alert('Failed to create meal in Azure');
        return;
      }
    } catch (err) {
      console.error('Failed to create meal in Azure', err);
      alert('Failed to create meal in Azure');
      return;
    }

    // update local storage for immediate ui update
    const updatedMenuItems = [...allMenuItems, meal];
    saveMenuItems(updatedMenuItems);
    setMenuItems([...menuItems, meal]);
    setNewMeal(null);
    alert('Meal added successfully!');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--primary-blue)] hover:text-[var(--dark-blue)] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        {/* Restaurant Details */}
        <div className="bg-[var(--bg-card)] rounded-lg shadow-md p-6 mb-8 border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-[var(--text-primary)]">Restaurant Details</h2>
            <button
              onClick={handleSaveRestaurant}
              className="flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-green)] transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--text-primary)] mb-2">Restaurant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] mb-2">Area</label>
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
              <label className="block text-[var(--text-primary)] mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--text-primary)] mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--text-primary)] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-[var(--bg-card)] rounded-lg shadow-md p-6 border border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[var(--text-primary)]">Menu Items</h3>
            <button
              onClick={() => setNewMeal({
                name: '',
                description: '',
                isAvailable: true,
                prepTime: 15,
                price: 0,
                image: 'https://images.unsplash.com/photo-1661260652741-65340f04f2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBmb29kJTIwbWVhbHxlbnwxfHx8fDE3NjM5NDgwMjd8MA&ixlib=rb-4.1.0&q=80&w=400'
              })}
              className="flex items-center gap-2 bg-[var(--primary-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Meal
            </button>
          </div>

          <div className="space-y-4">
            {menuItems.map(meal => (
              <div key={meal.dishId} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-secondary)]">
                {editingMeal === meal.dishId ? (
                  <MealEditor
                    meal={meal}
                    onSave={handleSaveMeal}
                    onCancel={() => setEditingMeal(null)}
                  />
                ) : (
                  <div className="flex items-start gap-4">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[var(--text-primary)] mb-1">{meal.name}</h4>
                          <p className="text-sm text-[var(--text-secondary)] mb-2">{meal.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-[var(--primary-green)]">${meal.price.toFixed(2)}</span>
                            <span className="text-[var(--text-secondary)]">{meal.prepTime} min</span>
                            <span className={meal.isAvailable ? 'text-[var(--primary-green)]' : 'text-red-500'}>
                              {meal.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingMeal(meal.dishId)}
                            className="p-2 text-[var(--primary-blue)] hover:bg-blue-950/30 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(meal.dishId)}
                            className="p-2 text-red-500 hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {newMeal && (
              <div className="border-2 border-dashed border-[var(--primary-blue)] rounded-lg p-4 bg-[var(--bg-secondary)]">
                <h4 className="text-[var(--text-primary)] mb-4">New Meal</h4>
                <MealEditor
                  meal={newMeal as MenuItem}
                  onSave={handleAddNewMeal}
                  onCancel={() => setNewMeal(null)}
                  isNew
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MealEditorProps {
  meal: Partial<MenuItem>;
  onSave: (meal: MenuItem) => void;
  onCancel: () => void;
  isNew?: boolean;
}

function MealEditor({ meal, onSave, onCancel, isNew = false }: MealEditorProps) {
  const [formData, setFormData] = useState(meal);

  const handleSubmit = () => {
    if (isNew) {
      onSave(formData as MenuItem);
    } else {
      onSave(formData as MenuItem);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[var(--text-primary)] mb-1 text-sm">Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
        />
      </div>

      <div>
        <label className="block text-[var(--text-primary)] mb-1 text-sm">Price ($)</label>
        <input
          type="number"
          step="0.01"
          value={formData.price || 0}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
        />
      </div>

      <div>
        <label className="block text-[var(--text-primary)] mb-1 text-sm">Prep Time (min)</label>
        <input
          type="number"
          value={formData.prepTime || 0}
          onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
          className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center gap-2 cursor-pointer">
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
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-[var(--text-primary)] mb-1 text-sm">Image URL</label>
        <input
          type="url"
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-primary)] text-sm"
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
          {isNew ? 'Add Meal' : 'Save'}
        </button>
      </div>
    </div>
  );
}