// Utility Functions

// Calculate delivery time based on area proximity
function calculateDeliveryTime(customerArea, restaurantAreas, prepTimes) {
  const baseTime = Math.max(...prepTimes);
  let travelTime = 0;
  
  // Calculate travel time based on unique restaurant areas
  const uniqueAreas = [...new Set(restaurantAreas)];
  uniqueAreas.forEach(area => {
    if (area === customerArea) {
      travelTime += 10; // Same area: 10 minutes
    } else {
      travelTime += 25; // Different area: 25 minutes
    }
  });
  
  return baseTime + travelTime;
}

// Calculate total cost from cart items
function calculateTotalCost(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Format price to currency
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Format time
function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Create element with class
function createElement(tag, className = '', text = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// Show alert
function showAlert(message, type = 'info') {
  alert(message);
}

// Generate unique ID
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Filter restaurants by search and area
function filterRestaurants(restaurants, searchTerm, area) {
  return restaurants.filter(restaurant => {
    const matchesSearch = !searchTerm || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = area === 'All' || restaurant.area === area;
    return matchesSearch && matchesArea;
  });
}

// Filter menu items by search and availability
function filterMenuItems(menuItems, searchTerm, showUnavailable) {
  return menuItems.filter(item => {
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = showUnavailable || item.isAvailable;
    return matchesSearch && matchesAvailability;
  });
}

// Get cart item count
function getCartItemCount(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get restaurants from cart
function getRestaurantsFromCart(cart) {
  const restaurantIds = [...new Set(cart.map(item => item.restaurantId))];
  return restaurantIds.map(id => DataManager.getRestaurantById(id)).filter(Boolean);
}

// Validate form data
function validateFormData(data, requiredFields) {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return false;
    }
  }
  return true;
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create image element with fallback
function createImageElement(src, alt, className = '') {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  if (className) img.className = className;
  
  img.onerror = function() {
    this.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
  };
  
  return img;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate estimated arrival time
function calculateEstimatedArrival(minutes) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Theme Management
function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light-mode');
  } else {
    root.classList.remove('light-mode');
  }
}

function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

function initTheme() {
  const theme = getTheme();
  applyTheme(theme);
}