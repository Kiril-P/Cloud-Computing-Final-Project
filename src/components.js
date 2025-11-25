// Reusable Components

// Header Component
function createHeader(title, showHomeButton = false) {
  const header = createElement('header', 'header');
  
  const container = createElement('div', 'max-w-7xl mx-auto px-4 py-4 flex items-center justify-between');
  
  // Left side with home button and title
  const leftSide = createElement('div', 'flex items-center gap-3');
  
  if (showHomeButton) {
    const homeBtn = createElement('button', 'home-btn');
    homeBtn.setAttribute('aria-label', 'Go home');
    homeBtn.appendChild(createIcon('Home', 'icon'));
    homeBtn.onclick = () => AppState.navigateTo('landing');
    leftSide.appendChild(homeBtn);
  }
  
  const titleEl = createElement('h1', 'text-white', title);
  leftSide.appendChild(titleEl);
  
  // Right side with theme toggle and logo
  const rightSide = createElement('div', 'flex items-center gap-3');
  
  // Theme toggle button
  const themeToggleBtn = createElement('button', 'theme-toggle-btn');
  themeToggleBtn.setAttribute('aria-label', 'Toggle theme');
  const currentTheme = getTheme();
  const iconName = currentTheme === 'dark' ? 'Sun' : 'Moon';
  themeToggleBtn.appendChild(createIcon(iconName, 'icon'));
  themeToggleBtn.onclick = () => {
    toggleTheme();
    // Re-render to update the icon
    AppState.render();
  };
  rightSide.appendChild(themeToggleBtn);
  
  // Logo
  const logoWrapper = createElement('div', 'icon-wrapper');
  const logoImg = document.createElement('img');
  logoImg.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';
  logoImg.alt = 'NomNomNow';
  logoImg.className = 'header-logo';
  logoWrapper.appendChild(logoImg);
  rightSide.appendChild(logoWrapper);
  
  container.appendChild(leftSide);
  container.appendChild(rightSide);
  header.appendChild(container);
  
  return header;
}

// Search and Filter Component
function createSearchAndFilter(onSearch, onFilter, selectedArea = 'All') {
  const container = createElement('div', 'mb-6');
  
  const wrapper = createElement('div', 'bg-card p-4 rounded-lg border border-color');
  
  const grid = createElement('div', 'grid md:grid-cols-2 gap-4');
  
  // Search input
  const searchWrapper = createElement('div');
  const searchLabel = createElement('label', 'block mb-2');
  searchLabel.style.color = 'var(--text-primary)';
  searchLabel.textContent = 'Search';
  const searchInputWrapper = createElement('div', 'flex gap-2');
  
  const searchInput = createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search...';
  searchInput.className = 'input-field';
  searchInput.oninput = debounce((e) => onSearch(e.target.value), 300);
  
  searchInputWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchLabel);
  searchWrapper.appendChild(searchInputWrapper);
  
  // Area filter
  const filterWrapper = createElement('div');
  const filterLabel = createElement('label', 'block mb-2');
  filterLabel.style.color = 'var(--text-primary)';
  filterLabel.textContent = 'Filter by Area';
  const filterSelect = createElement('select', 'input-field');
  
  ['All', 'North', 'East', 'West'].forEach(area => {
    const option = createElement('option', '', area);
    option.value = area;
    if (area === selectedArea) option.selected = true;
    filterSelect.appendChild(option);
  });
  
  filterSelect.onchange = (e) => onFilter(e.target.value);
  
  filterWrapper.appendChild(filterLabel);
  filterWrapper.appendChild(filterSelect);
  
  grid.appendChild(searchWrapper);
  grid.appendChild(filterWrapper);
  wrapper.appendChild(grid);
  container.appendChild(wrapper);
  
  return container;
}

// Restaurant Card Component
function createRestaurantCard(restaurant, onClick) {
  const card = createElement('button', 'card card-clickable p-6 text-left w-full');
  card.onclick = () => onClick(restaurant);
  
  // Image
  const img = createImageElement(restaurant.image, restaurant.name, 'w-full h-48 object-cover rounded-lg mb-4');
  
  // Content
  const content = createElement('div');
  
  const name = createElement('h3', 'mb-2');
  name.style.color = 'var(--text-primary)';
  name.textContent = restaurant.name;
  const area = createElement('span', 'text-green text-sm', restaurant.area);
  const description = createElement('p', 'text-secondary mt-2 line-clamp-2', restaurant.description);
  const address = createElement('p', 'text-secondary text-sm mt-2', restaurant.address);
  
  content.appendChild(name);
  content.appendChild(area);
  content.appendChild(description);
  content.appendChild(address);
  
  card.appendChild(img);
  card.appendChild(content);
  
  return card;
}

// Menu Item Card Component
function createMenuItemCard(item, onAddToCart, cartQuantity = 0) {
  const card = createElement('div', 'card p-4');
  
  const grid = createElement('div', 'grid md:grid-cols-3 gap-4');
  
  // Image
  const imgWrapper = createElement('div');
  const img = createImageElement(item.image, item.name, 'w-full h-32 object-cover rounded-lg');
  imgWrapper.appendChild(img);
  
  // Details
  const details = createElement('div', 'md:col-span-2 flex flex-col justify-between');
  
  const header = createElement('div');
  const name = createElement('h4', 'text-white mb-1', item.name);
  const description = createElement('p', 'text-secondary text-sm line-clamp-2 mb-2', item.description);
  const info = createElement('div', 'flex gap-4 text-sm text-secondary');
  
  const priceSpan = createElement('span', '', formatPrice(item.price));
  const timeSpan = createElement('span', '', `${item.prepTime} min`);
  const availableSpan = createElement('span', item.isAvailable ? 'text-green' : 'text-red', 
    item.isAvailable ? 'Available' : 'Unavailable');
  
  info.appendChild(priceSpan);
  info.appendChild(timeSpan);
  info.appendChild(availableSpan);
  
  header.appendChild(name);
  header.appendChild(description);
  header.appendChild(info);
  
  // Add button
  const buttonWrapper = createElement('div', 'flex items-center gap-2 mt-2');
  
  if (cartQuantity > 0) {
    const quantityDisplay = createElement('span', 'text-white px-3 py-1 bg-secondary rounded-lg', 
      `In cart: ${cartQuantity}`);
    buttonWrapper.appendChild(quantityDisplay);
  }
  
  if (item.isAvailable) {
    const addBtn = createElement('button', 'btn btn-primary px-4 py-2 text-sm');
    addBtn.textContent = 'Add to Cart';
    addBtn.onclick = () => onAddToCart(item);
    buttonWrapper.appendChild(addBtn);
  }
  
  details.appendChild(header);
  details.appendChild(buttonWrapper);
  
  grid.appendChild(imgWrapper);
  grid.appendChild(details);
  card.appendChild(grid);
  
  return card;
}

// Cart Item Component
function createCartItem(item, onUpdateQuantity, onRemove) {
  const card = createElement('div', 'card p-4');
  
  const flex = createElement('div', 'flex justify-between items-center');
  
  // Left side - item info
  const leftSide = createElement('div', 'flex-1');
  const name = createElement('h4', 'text-white mb-1', item.name);
  const price = createElement('p', 'text-secondary', `${formatPrice(item.price)} each`);
  const restaurant = DataManager.getRestaurantById(item.restaurantId);
  const restaurantName = createElement('p', 'text-green text-sm', restaurant ? restaurant.name : '');
  
  leftSide.appendChild(name);
  leftSide.appendChild(price);
  leftSide.appendChild(restaurantName);
  
  // Right side - quantity controls
  const rightSide = createElement('div', 'flex items-center gap-4');
  
  const quantityControls = createElement('div', 'flex items-center gap-2');
  
  const minusBtn = createElement('button', 'p-2 bg-secondary rounded-lg hover:bg-blue transition-colors');
  minusBtn.appendChild(createIcon('Minus', 'icon-sm'));
  minusBtn.onclick = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.dishId, item.quantity - 1);
    } else {
      if (confirm('Remove this item from cart?')) {
        onRemove(item.dishId);
      }
    }
  };
  
  const quantity = createElement('span', 'text-white px-4', item.quantity.toString());
  
  const plusBtn = createElement('button', 'p-2 bg-secondary rounded-lg hover:bg-blue transition-colors');
  plusBtn.appendChild(createIcon('Plus', 'icon-sm'));
  plusBtn.onclick = () => onUpdateQuantity(item.dishId, item.quantity + 1);
  
  quantityControls.appendChild(minusBtn);
  quantityControls.appendChild(quantity);
  quantityControls.appendChild(plusBtn);
  
  const total = createElement('div', 'text-white', formatPrice(item.price * item.quantity));
  
  const removeBtn = createElement('button', 'p-2 text-red hover:bg-secondary rounded-lg transition-colors');
  removeBtn.appendChild(createIcon('Trash', 'icon'));
  removeBtn.onclick = () => {
    if (confirm('Remove this item from cart?')) {
      onRemove(item.dishId);
    }
  };
  
  rightSide.appendChild(quantityControls);
  rightSide.appendChild(total);
  rightSide.appendChild(removeBtn);
  
  flex.appendChild(leftSide);
  flex.appendChild(rightSide);
  card.appendChild(flex);
  
  return card;
}

// Empty State Component
function createEmptyState(icon, message, buttonText, onButtonClick) {
  const container = createElement('div', 'text-center py-12');
  
  const iconWrapper = createElement('div', 'w-20 h-20 gradient-blue rounded-full flex items-center justify-center mx-auto mb-4');
  iconWrapper.appendChild(createIcon(icon, 'icon-xl'));
  
  const messageEl = createElement('p', 'text-secondary mb-4', message);
  
  if (buttonText && onButtonClick) {
    const button = createElement('button', 'btn btn-primary px-6 py-3');
    button.textContent = buttonText;
    button.onclick = onButtonClick;
    
    container.appendChild(iconWrapper);
    container.appendChild(messageEl);
    container.appendChild(button);
  } else {
    container.appendChild(iconWrapper);
    container.appendChild(messageEl);
  }
  
  return container;
}

// Loading Spinner Component
function createLoadingSpinner() {
  const container = createElement('div', 'flex justify-center items-center py-12');
  const spinner = createElement('div', 'spinner');
  container.appendChild(spinner);
  return container;
}

// Back Button Component
function createBackButton(text, onClick) {
  const button = createElement('button', 'btn btn-secondary px-4 py-2');
  button.innerHTML = '';
  button.appendChild(createIcon('ArrowLeft', 'icon-sm'));
  const span = createElement('span', 'ml-2', text);
  button.appendChild(span);
  button.onclick = onClick;
  return button;
}