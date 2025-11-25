// Application State Management
const AppState = {
  currentView: 'landing',
  currentCustomer: null,
  selectedRestaurant: null,
  cart: [],
  customerAuthView: 'choice', // 'choice', 'create', 'select'
  
  navigateTo(view) {
    this.currentView = view;
    scrollToTop();
    this.render();
  },
  
  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    let content;
    
    switch (this.currentView) {
      case 'landing':
        content = Views.landing();
        break;
      
      case 'customer-auth':
        content = Views.customerAuth();
        break;
      
      case 'customer-browse':
        content = this.renderCustomerBrowse();
        break;
      
      case 'customer-menu':
        content = this.renderCustomerMenu();
        break;
      
      case 'customer-cart':
        content = this.renderCustomerCart();
        break;
      
      case 'customer-profile':
        content = this.renderCustomerProfile();
        break;
      
      case 'restaurant-list':
        content = this.renderRestaurantList();
        break;
      
      case 'restaurant-profile':
        content = this.renderRestaurantProfile();
        break;
      
      case 'restaurant-create':
        content = this.renderRestaurantCreate();
        break;
      
      default:
        content = Views.landing();
    }
    
    app.appendChild(content);
  },
  
  renderCustomerBrowse() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('NomNomNow', true);
    
    // Main content
    const main = createElement('div', 'max-w-7xl mx-auto px-4 py-8');
    
    // Customer info bar
    const infoBar = createElement('div', 'card p-4 mb-6 flex justify-between items-center');
    
    const customerInfo = createElement('div');
    const welcomeText = createElement('h3', 'text-white', 
      `Welcome, ${this.currentCustomer.name} ${this.currentCustomer.lastName}`);
    const areaText = createElement('p', 'text-green text-sm', 
      `Delivering to: ${this.currentCustomer.area} - ${this.currentCustomer.address}`);
    customerInfo.appendChild(welcomeText);
    customerInfo.appendChild(areaText);
    
    const actions = createElement('div', 'flex gap-3');
    
    const profileBtn = createElement('button', 'btn btn-secondary px-4 py-2');
    profileBtn.textContent = 'My Profile';
    profileBtn.onclick = () => this.navigateTo('customer-profile');
    
    const cartBtn = createElement('button', 'btn btn-primary px-4 py-2 flex items-center gap-2' + 
      (this.cart.length > 0 ? ' relative' : ''));
    cartBtn.appendChild(createIcon('ShoppingCart', 'icon'));
    const cartText = createElement('span', '', `Cart (${getCartItemCount(this.cart)})`);
    cartBtn.appendChild(cartText);
    cartBtn.onclick = () => this.navigateTo('customer-cart');
    
    if (this.cart.length > 0) {
      const badge = createElement('span', 'cart-badge', this.cart.length.toString());
      cartBtn.appendChild(badge);
    }
    
    actions.appendChild(profileBtn);
    actions.appendChild(cartBtn);
    
    infoBar.appendChild(customerInfo);
    infoBar.appendChild(actions);
    
    // Search and filter
    let searchTerm = '';
    let selectedArea = 'All';
    
    const searchFilter = createSearchAndFilter(
      (term) => {
        searchTerm = term;
        renderRestaurants();
      },
      (area) => {
        selectedArea = area;
        renderRestaurants();
      },
      selectedArea
    );
    
    // Restaurants grid
    const restaurantsContainer = createElement('div');
    
    const renderRestaurants = () => {
      const restaurants = DataManager.getRestaurants();
      const filtered = filterRestaurants(restaurants, searchTerm, selectedArea);
      
      restaurantsContainer.innerHTML = '';
      
      if (filtered.length === 0) {
        restaurantsContainer.appendChild(
          createEmptyState('Store', 'No restaurants found', null, null)
        );
        return;
      }
      
      const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-6');
      
      filtered.forEach(restaurant => {
        const card = createRestaurantCard(restaurant, (r) => {
          this.selectedRestaurant = r;
          this.navigateTo('customer-menu');
        });
        grid.appendChild(card);
      });
      
      restaurantsContainer.appendChild(grid);
    };
    
    renderRestaurants();
    
    main.appendChild(infoBar);
    main.appendChild(searchFilter);
    main.appendChild(restaurantsContainer);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderCustomerMenu() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('Restaurant Menu', true);
    
    // Main content
    const main = createElement('div', 'max-w-7xl mx-auto px-4 py-8');
    
    // Restaurant header
    const restaurantHeader = createElement('div', 'card p-6 mb-6');
    const restaurantName = createElement('h2', 'text-white mb-2', this.selectedRestaurant.name);
    const restaurantInfo = createElement('p', 'text-secondary', this.selectedRestaurant.description);
    const restaurantAddress = createElement('p', 'text-green text-sm mt-2', 
      `${this.selectedRestaurant.area} - ${this.selectedRestaurant.address}`);
    
    restaurantHeader.appendChild(restaurantName);
    restaurantHeader.appendChild(restaurantInfo);
    restaurantHeader.appendChild(restaurantAddress);
    
    // Action buttons
    const actionBar = createElement('div', 'flex justify-between items-center mb-6');
    
    const backBtn = createBackButton('Back to Restaurants', () => this.navigateTo('customer-browse'));
    
    const cartBtn = createElement('button', 'btn btn-primary px-6 py-3 flex items-center gap-2' +
      (this.cart.length > 0 ? ' relative' : ''));
    cartBtn.appendChild(createIcon('ShoppingCart', 'icon'));
    const cartText = createElement('span', '', `View Cart (${getCartItemCount(this.cart)})`);
    cartBtn.appendChild(cartText);
    cartBtn.onclick = () => this.navigateTo('customer-cart');
    
    if (this.cart.length > 0) {
      const badge = createElement('span', 'cart-badge', this.cart.length.toString());
      cartBtn.appendChild(badge);
    }
    
    actionBar.appendChild(backBtn);
    actionBar.appendChild(cartBtn);
    
    // Menu items
    const menuItems = DataManager.getMenuItemsByRestaurant(this.selectedRestaurant.restaurantId);
    
    const menuContainer = createElement('div', 'space-y-4');
    
    menuItems.forEach(item => {
      const cartItem = this.cart.find(ci => ci.dishId === item.dishId);
      const quantity = cartItem ? cartItem.quantity : 0;
      
      const card = createMenuItemCard(item, (menuItem) => {
        const existingItem = this.cart.find(ci => ci.dishId === menuItem.dishId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.cart.push({
            dishId: menuItem.dishId,
            restaurantId: menuItem.restaurantId,
            quantity: 1,
            name: menuItem.name,
            price: menuItem.price,
            prepTime: menuItem.prepTime,
            area: menuItem.area
          });
        }
        
        this.render();
      }, quantity);
      
      menuContainer.appendChild(card);
    });
    
    main.appendChild(restaurantHeader);
    main.appendChild(actionBar);
    main.appendChild(menuContainer);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderCustomerCart() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('Your Cart', true);
    
    // Main content
    const main = createElement('div', 'max-w-5xl mx-auto px-4 py-8');
    
    if (this.cart.length === 0) {
      const emptyState = createEmptyState(
        'ShoppingCart',
        'Your cart is empty',
        'Browse Restaurants',
        () => this.navigateTo('customer-browse')
      );
      
      main.appendChild(emptyState);
      container.appendChild(header);
      container.appendChild(main);
      
      return container;
    }
    
    // Back button
    const backBtn = createBackButton('Back to Browsing', () => this.navigateTo('customer-browse'));
    const backBtnWrapper = createElement('div', 'mb-6');
    backBtnWrapper.appendChild(backBtn);
    
    // Cart items
    const cartItemsContainer = createElement('div', 'space-y-4 mb-6');
    
    this.cart.forEach(item => {
      const cartItem = createCartItem(
        item,
        (dishId, quantity) => {
          const cartItem = this.cart.find(ci => ci.dishId === dishId);
          if (cartItem) {
            cartItem.quantity = quantity;
          }
          this.render();
        },
        (dishId) => {
          this.cart = this.cart.filter(ci => ci.dishId !== dishId);
          this.render();
        }
      );
      cartItemsContainer.appendChild(cartItem);
    });
    
    // Order summary
    const summary = createElement('div', 'card p-6');
    
    const summaryTitle = createElement('h3', 'text-white mb-4', 'Order Summary');
    
    const restaurants = getRestaurantsFromCart(this.cart);
    const restaurantAreas = this.cart.map(item => item.area);
    const prepTimes = this.cart.map(item => item.prepTime);
    
    const deliveryTime = calculateDeliveryTime(this.currentCustomer.area, restaurantAreas, prepTimes);
    const totalCost = calculateTotalCost(this.cart);
    const estimatedArrival = calculateEstimatedArrival(deliveryTime);
    
    const infoGrid = createElement('div', 'space-y-2 mb-6 text-secondary');
    
    const restaurantCount = createElement('p', '', 
      `Restaurants: ${restaurants.length} (${restaurants.map(r => r.name).join(', ')})`);
    const itemCount = createElement('p', '', `Items: ${getCartItemCount(this.cart)}`);
    const deliveryTimeEl = createElement('p', '', `Estimated Delivery: ${formatTime(deliveryTime)}`);
    const arrivalEl = createElement('p', '', `Estimated Arrival: ${estimatedArrival}`);
    
    infoGrid.appendChild(restaurantCount);
    infoGrid.appendChild(itemCount);
    infoGrid.appendChild(deliveryTimeEl);
    infoGrid.appendChild(arrivalEl);
    
    const totalLine = createElement('div', 'border-t border-color pt-4 mt-4');
    const totalText = createElement('div', 'flex justify-between items-center');
    const totalLabel = createElement('span', 'text-white text-lg', 'Total Cost:');
    const totalValue = createElement('span', 'text-white text-2xl', formatPrice(totalCost));
    totalText.appendChild(totalLabel);
    totalText.appendChild(totalValue);
    totalLine.appendChild(totalText);
    
    const placeOrderBtn = createElement('button', 'btn btn-primary w-full px-6 py-3 mt-6');
    placeOrderBtn.textContent = 'Place Order';
    placeOrderBtn.onclick = () => {
      // Create order
      const order = {
        area: this.currentCustomer.area,
        orderId: generateId('order'),
        customerId: this.currentCustomer.customerId,
        dishesOrdered: this.cart,
        estimatedArrival: estimatedArrival,
        estimatedTime: deliveryTime,
        status: 'pending',
        totalCost: totalCost,
        createdAt: new Date().toISOString()
      };
      
      const orders = DataManager.getOrders();
      orders.push(order);
      DataManager.saveOrders(orders);
      
      alert(`Order placed successfully! Your order will arrive in approximately ${formatTime(deliveryTime)}.`);
      
      this.cart = [];
      this.navigateTo('customer-browse');
    };
    
    summary.appendChild(summaryTitle);
    summary.appendChild(infoGrid);
    summary.appendChild(totalLine);
    summary.appendChild(placeOrderBtn);
    
    main.appendChild(backBtnWrapper);
    main.appendChild(cartItemsContainer);
    main.appendChild(summary);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderCustomerProfile() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('My Profile', true);
    
    // Main content
    const main = createElement('div', 'max-w-3xl mx-auto px-4 py-8');
    
    // Back button
    const backBtn = createBackButton('Back to Browsing', () => this.navigateTo('customer-browse'));
    const backBtnWrapper = createElement('div', 'mb-6');
    backBtnWrapper.appendChild(backBtn);
    
    const card = createElement('div', 'card p-8');
    
    const title = createElement('h2', 'text-white mb-6', 'Customer Profile');
    
    const form = createElement('form', 'space-y-4');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      this.currentCustomer.name = formData.get('name');
      this.currentCustomer.lastName = formData.get('lastName');
      this.currentCustomer.area = formData.get('area');
      this.currentCustomer.address = formData.get('address');
      this.currentCustomer.phone = formData.get('phone');
      
      const customers = DataManager.getCustomers();
      const index = customers.findIndex(c => c.customerId === this.currentCustomer.customerId);
      if (index !== -1) {
        customers[index] = this.currentCustomer;
        DataManager.saveCustomers(customers);
      }
      
      alert('Profile updated successfully!');
      this.navigateTo('customer-browse');
    };
    
    // Name fields
    const nameGrid = createElement('div', 'grid md:grid-cols-2 gap-4');
    
    const firstNameWrapper = createElement('div');
    const firstNameLabel = createElement('label', 'block text-white mb-2', 'First Name');
    const firstNameInput = createElement('input', 'input-field');
    firstNameInput.type = 'text';
    firstNameInput.name = 'name';
    firstNameInput.value = this.currentCustomer.name;
    firstNameInput.required = true;
    firstNameWrapper.appendChild(firstNameLabel);
    firstNameWrapper.appendChild(firstNameInput);
    
    const lastNameWrapper = createElement('div');
    const lastNameLabel = createElement('label', 'block text-white mb-2', 'Last Name');
    const lastNameInput = createElement('input', 'input-field');
    lastNameInput.type = 'text';
    lastNameInput.name = 'lastName';
    lastNameInput.value = this.currentCustomer.lastName;
    lastNameInput.required = true;
    lastNameWrapper.appendChild(lastNameLabel);
    lastNameWrapper.appendChild(lastNameInput);
    
    nameGrid.appendChild(firstNameWrapper);
    nameGrid.appendChild(lastNameWrapper);
    
    // Area field
    const areaWrapper = createElement('div');
    const areaLabel = createElement('label', 'block text-white mb-2', 'Area');
    const areaSelect = createElement('select', 'input-field');
    areaSelect.name = 'area';
    ['North', 'East', 'West'].forEach(area => {
      const option = createElement('option', '', area);
      option.value = area;
      if (area === this.currentCustomer.area) option.selected = true;
      areaSelect.appendChild(option);
    });
    areaWrapper.appendChild(areaLabel);
    areaWrapper.appendChild(areaSelect);
    
    // Address field
    const addressWrapper = createElement('div');
    const addressLabel = createElement('label', 'block text-white mb-2', 'Address');
    const addressInput = createElement('input', 'input-field');
    addressInput.type = 'text';
    addressInput.name = 'address';
    addressInput.value = this.currentCustomer.address;
    addressInput.required = true;
    addressWrapper.appendChild(addressLabel);
    addressWrapper.appendChild(addressInput);
    
    // Phone field
    const phoneWrapper = createElement('div');
    const phoneLabel = createElement('label', 'block text-white mb-2', 'Phone');
    const phoneInput = createElement('input', 'input-field');
    phoneInput.type = 'tel';
    phoneInput.name = 'phone';
    phoneInput.value = this.currentCustomer.phone;
    phoneInput.required = true;
    phoneWrapper.appendChild(phoneLabel);
    phoneWrapper.appendChild(phoneInput);
    
    // Buttons
    const buttonWrapper = createElement('div', 'flex gap-3 mt-8');
    const cancelBtn = createElement('button', 'btn btn-secondary px-6 py-3', 'Cancel');
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => this.navigateTo('customer-browse');
    
    const submitBtn = createElement('button', 'btn btn-primary px-6 py-3', 'Save Changes');
    submitBtn.type = 'submit';
    
    buttonWrapper.appendChild(cancelBtn);
    buttonWrapper.appendChild(submitBtn);
    
    form.appendChild(nameGrid);
    form.appendChild(areaWrapper);
    form.appendChild(addressWrapper);
    form.appendChild(phoneWrapper);
    form.appendChild(buttonWrapper);
    
    card.appendChild(title);
    card.appendChild(form);
    
    main.appendChild(backBtnWrapper);
    main.appendChild(card);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderRestaurantList() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('Restaurant Management', true);
    
    // Main content
    const main = createElement('div', 'max-w-7xl mx-auto px-4 py-8');
    
    // Action bar
    const actionBar = createElement('div', 'flex justify-between items-center mb-6');
    const actionTitle = createElement('h2', 'text-white', 'Manage Restaurants');
    
    const createBtn = createElement('button', 'btn btn-primary px-6 py-3 flex items-center gap-2');
    createBtn.appendChild(createIcon('Plus', 'icon'));
    const createText = createElement('span', '', 'Create New Restaurant');
    createBtn.appendChild(createText);
    createBtn.onclick = () => this.navigateTo('restaurant-create');
    
    actionBar.appendChild(actionTitle);
    actionBar.appendChild(createBtn);
    
    // Search and filter
    let searchTerm = '';
    let selectedArea = 'All';
    
    const searchFilter = createSearchAndFilter(
      (term) => {
        searchTerm = term;
        renderRestaurants();
      },
      (area) => {
        selectedArea = area;
        renderRestaurants();
      },
      selectedArea
    );
    
    // Restaurants grid
    const restaurantsContainer = createElement('div');
    
    const renderRestaurants = () => {
      const restaurants = DataManager.getRestaurants();
      const filtered = filterRestaurants(restaurants, searchTerm, selectedArea);
      
      restaurantsContainer.innerHTML = '';
      
      if (filtered.length === 0) {
        restaurantsContainer.appendChild(
          createEmptyState('Store', 'No restaurants found', 'Create New Restaurant', 
            () => this.navigateTo('restaurant-create'))
        );
        return;
      }
      
      const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-6');
      
      filtered.forEach(restaurant => {
        const card = createRestaurantCard(restaurant, (r) => {
          this.selectedRestaurant = r;
          this.navigateTo('restaurant-profile');
        });
        grid.appendChild(card);
      });
      
      restaurantsContainer.appendChild(grid);
    };
    
    renderRestaurants();
    
    main.appendChild(actionBar);
    main.appendChild(searchFilter);
    main.appendChild(restaurantsContainer);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderRestaurantProfile() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('Edit Restaurant', true);
    
    // Main content
    const main = createElement('div', 'max-w-5xl mx-auto px-4 py-8');
    
    // Back button
    const backBtn = createBackButton('Back to List', () => this.navigateTo('restaurant-list'));
    const backBtnWrapper = createElement('div', 'mb-6');
    backBtnWrapper.appendChild(backBtn);
    
    // Restaurant form
    const card = createElement('div', 'card p-8 mb-6');
    
    const title = createElement('h2', 'text-white mb-6', 'Restaurant Information');
    
    const form = createElement('form', 'space-y-4');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      this.selectedRestaurant.name = formData.get('name');
      this.selectedRestaurant.description = formData.get('description');
      this.selectedRestaurant.area = formData.get('area');
      this.selectedRestaurant.address = formData.get('address');
      this.selectedRestaurant.phone = formData.get('phone');
      
      const restaurants = DataManager.getRestaurants();
      const index = restaurants.findIndex(r => r.restaurantId === this.selectedRestaurant.restaurantId);
      if (index !== -1) {
        restaurants[index] = this.selectedRestaurant;
        DataManager.saveRestaurants(restaurants);
      }
      
      alert('Restaurant updated successfully!');
      this.navigateTo('restaurant-list');
    };
    
    // Form fields similar to customer profile...
    // Name
    const nameWrapper = createElement('div');
    const nameLabel = createElement('label', 'block text-white mb-2', 'Restaurant Name');
    const nameInput = createElement('input', 'input-field');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.value = this.selectedRestaurant.name;
    nameInput.required = true;
    nameWrapper.appendChild(nameLabel);
    nameWrapper.appendChild(nameInput);
    
    // Description
    const descWrapper = createElement('div');
    const descLabel = createElement('label', 'block text-white mb-2', 'Description');
    const descInput = createElement('textarea', 'input-field');
    descInput.name = 'description';
    descInput.value = this.selectedRestaurant.description;
    descInput.rows = 3;
    descInput.required = true;
    descWrapper.appendChild(descLabel);
    descWrapper.appendChild(descInput);
    
    // Area
    const areaWrapper = createElement('div');
    const areaLabel = createElement('label', 'block text-white mb-2', 'Area');
    const areaSelect = createElement('select', 'input-field');
    areaSelect.name = 'area';
    ['North', 'East', 'West'].forEach(area => {
      const option = createElement('option', '', area);
      option.value = area;
      if (area === this.selectedRestaurant.area) option.selected = true;
      areaSelect.appendChild(option);
    });
    areaWrapper.appendChild(areaLabel);
    areaWrapper.appendChild(areaSelect);
    
    // Address
    const addressWrapper = createElement('div');
    const addressLabel = createElement('label', 'block text-white mb-2', 'Address');
    const addressInput = createElement('input', 'input-field');
    addressInput.type = 'text';
    addressInput.name = 'address';
    addressInput.value = this.selectedRestaurant.address;
    addressInput.required = true;
    addressWrapper.appendChild(addressLabel);
    addressWrapper.appendChild(addressInput);
    
    // Phone
    const phoneWrapper = createElement('div');
    const phoneLabel = createElement('label', 'block text-white mb-2', 'Phone');
    const phoneInput = createElement('input', 'input-field');
    phoneInput.type = 'tel';
    phoneInput.name = 'phone';
    phoneInput.value = this.selectedRestaurant.phone;
    phoneInput.required = true;
    phoneWrapper.appendChild(phoneLabel);
    phoneWrapper.appendChild(phoneInput);
    
    // Buttons
    const buttonWrapper = createElement('div', 'flex gap-3 mt-8');
    const cancelBtn = createElement('button', 'btn btn-secondary px-6 py-3', 'Cancel');
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => this.navigateTo('restaurant-list');
    
    const submitBtn = createElement('button', 'btn btn-primary px-6 py-3', 'Save Changes');
    submitBtn.type = 'submit';
    
    buttonWrapper.appendChild(cancelBtn);
    buttonWrapper.appendChild(submitBtn);
    
    form.appendChild(nameWrapper);
    form.appendChild(descWrapper);
    form.appendChild(areaWrapper);
    form.appendChild(addressWrapper);
    form.appendChild(phoneWrapper);
    form.appendChild(buttonWrapper);
    
    card.appendChild(title);
    card.appendChild(form);
    
    main.appendChild(backBtnWrapper);
    main.appendChild(card);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  },
  
  renderRestaurantCreate() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Header
    const header = createHeader('Create Restaurant', true);
    
    // Main content
    const main = createElement('div', 'max-w-3xl mx-auto px-4 py-8');
    
    // Back button
    const backBtn = createBackButton('Back to List', () => this.navigateTo('restaurant-list'));
    const backBtnWrapper = createElement('div', 'mb-6');
    backBtnWrapper.appendChild(backBtn);
    
    const card = createElement('div', 'card p-8');
    
    const title = createElement('h2', 'text-white mb-6', 'Create New Restaurant');
    
    const form = createElement('form', 'space-y-4');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      const restaurant = {
        restaurantId: generateId('rest'),
        name: formData.get('name'),
        description: formData.get('description'),
        area: formData.get('area'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        image: 'https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
      };
      
      const restaurants = DataManager.getRestaurants();
      restaurants.push(restaurant);
      DataManager.saveRestaurants(restaurants);
      
      alert('Restaurant created successfully!');
      this.navigateTo('restaurant-list');
    };
    
    // Form fields
    const nameWrapper = createElement('div');
    const nameLabel = createElement('label', 'block text-white mb-2', 'Restaurant Name');
    const nameInput = createElement('input', 'input-field');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.placeholder = 'My Restaurant';
    nameInput.required = true;
    nameWrapper.appendChild(nameLabel);
    nameWrapper.appendChild(nameInput);
    
    const descWrapper = createElement('div');
    const descLabel = createElement('label', 'block text-white mb-2', 'Description');
    const descInput = createElement('textarea', 'input-field');
    descInput.name = 'description';
    descInput.placeholder = 'Describe your restaurant...';
    descInput.rows = 3;
    descInput.required = true;
    descWrapper.appendChild(descLabel);
    descWrapper.appendChild(descInput);
    
    const areaWrapper = createElement('div');
    const areaLabel = createElement('label', 'block text-white mb-2', 'Area');
    const areaSelect = createElement('select', 'input-field');
    areaSelect.name = 'area';
    ['North', 'East', 'West'].forEach(area => {
      const option = createElement('option', '', area);
      option.value = area;
      areaSelect.appendChild(option);
    });
    areaWrapper.appendChild(areaLabel);
    areaWrapper.appendChild(areaSelect);
    
    const addressWrapper = createElement('div');
    const addressLabel = createElement('label', 'block text-white mb-2', 'Address');
    const addressInput = createElement('input', 'input-field');
    addressInput.type = 'text';
    addressInput.name = 'address';
    addressInput.placeholder = '123 Main Street';
    addressInput.required = true;
    addressWrapper.appendChild(addressLabel);
    addressWrapper.appendChild(addressInput);
    
    const phoneWrapper = createElement('div');
    const phoneLabel = createElement('label', 'block text-white mb-2', 'Phone');
    const phoneInput = createElement('input', 'input-field');
    phoneInput.type = 'tel';
    phoneInput.name = 'phone';
    phoneInput.placeholder = '555-1234';
    phoneInput.required = true;
    phoneWrapper.appendChild(phoneLabel);
    phoneWrapper.appendChild(phoneInput);
    
    const buttonWrapper = createElement('div', 'flex gap-3 mt-8');
    const cancelBtn = createElement('button', 'btn btn-secondary px-6 py-3', 'Cancel');
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => this.navigateTo('restaurant-list');
    
    const submitBtn = createElement('button', 'btn btn-primary px-6 py-3', 'Create Restaurant');
    submitBtn.type = 'submit';
    
    buttonWrapper.appendChild(cancelBtn);
    buttonWrapper.appendChild(submitBtn);
    
    form.appendChild(nameWrapper);
    form.appendChild(descWrapper);
    form.appendChild(areaWrapper);
    form.appendChild(addressWrapper);
    form.appendChild(phoneWrapper);
    form.appendChild(buttonWrapper);
    
    card.appendChild(title);
    card.appendChild(form);
    
    main.appendChild(backBtnWrapper);
    main.appendChild(card);
    
    container.appendChild(header);
    container.appendChild(main);
    
    return container;
  }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme before rendering
  initTheme();
  DataManager.initialize();
  AppState.render();
});