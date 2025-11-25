// Views Module - Contains all view rendering functions

const Views = {
  // Landing Page View
  landing() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    // Navigation Bar
    const nav = createElement('nav', 'nav-bar');
    const navContainer = createElement('div', 'max-w-7xl mx-auto px-4 py-3');
    const navFlex = createElement('div', 'flex items-center justify-between');
    
    const navLeft = createElement('div', 'flex items-center gap-3');
    const logo = createElement('span', 'text-2xl text-white', 'NomNomNow');
    navLeft.appendChild(logo);
    
    const navRight = createElement('div', 'hidden md:flex items-center gap-8');
    
    const createNavLink = (text, href) => {
      const link = createElement('a', 'nav-link', text);
      link.href = href;
      return link;
    };
    
    navRight.appendChild(createNavLink('Features', '#features'));
    navRight.appendChild(createNavLink('How It Works', '#how-it-works'));
    navRight.appendChild(createNavLink('Our Team', '#team'));
    
    const restaurantBtn = createElement('button', 'nav-link', 'Restaurants');
    restaurantBtn.onclick = () => AppState.navigateTo('restaurant-list');
    navRight.appendChild(restaurantBtn);
    
    const customerBtn = createElement('button', 'nav-link', 'Customer');
    customerBtn.onclick = () => AppState.navigateTo('customer-auth');
    navRight.appendChild(customerBtn);
    
    // Theme toggle button
    const themeToggleBtn = createElement('button', 'theme-toggle-btn nav-theme-toggle');
    themeToggleBtn.setAttribute('aria-label', 'Toggle theme');
    const currentTheme = getTheme();
    const iconName = currentTheme === 'dark' ? 'Sun' : 'Moon';
    themeToggleBtn.appendChild(createIcon(iconName, 'icon'));
    themeToggleBtn.onclick = () => {
      toggleTheme();
      AppState.render();
    };
    navRight.appendChild(themeToggleBtn);
    
    navFlex.appendChild(navLeft);
    navFlex.appendChild(navRight);
    navContainer.appendChild(navFlex);
    nav.appendChild(navContainer);
    
    // Hero Section
    const hero = createElement('section', 'hero-section');
    const heroContainer = createElement('div', 'max-w-7xl mx-auto px-4 text-center');
    
    const heroTitle = createElement('h1', 'text-white mb-3 flex justify-center');
    const heroLogo = document.createElement('img');
    heroLogo.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';
    heroLogo.alt = 'NomNomNow';
    heroLogo.className = 'logo-img';
    heroTitle.appendChild(heroLogo);
    
    const heroSubtitle = createElement('p', 'text-2xl text-white opacity-90 mb-0', 
      'Your favorite food, delivered fast');
    
    heroContainer.appendChild(heroTitle);
    heroContainer.appendChild(heroSubtitle);
    hero.appendChild(heroContainer);
    
    // Get Started Section
    const getStarted = createElement('section', 'py-8 bg-primary scroll-mt-16');
    getStarted.id = 'customer';
    const getStartedContainer = createElement('div', 'max-w-7xl mx-auto px-4');
    
    const getStartedTitle = createElement('h2', 'text-center text-white mb-10', 'Get Started');
    
    const viewGrid = createElement('div', 'grid md:grid-cols-2 gap-8 max-w-4xl mx-auto');
    
    // Customer View Card
    const customerCard = createElement('button', 
      'group card p-8 border-2 border-color cursor-pointer transition-all hover:shadow-2xl');
    customerCard.onclick = () => AppState.navigateTo('customer-auth');
    
    const customerIcon = createElement('div', 
      'w-20 h-20 gradient-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover-scale transition-transform');
    customerIcon.appendChild(createIcon('ShoppingBag', 'icon-xl'));
    
    const customerTitle = createElement('h3', 'mb-3 text-white', 'Customer View');
    const customerDesc = createElement('p', 'text-secondary mb-6', 
      'Browse restaurants, place orders, and track your delivery');
    const customerBtn = createElement('div', 'inline-block px-6 py-3 bg-green text-white rounded-lg border-2 border-dark-green transition-colors', 
      'Order Now');
    
    customerCard.appendChild(customerIcon);
    customerCard.appendChild(customerTitle);
    customerCard.appendChild(customerDesc);
    customerCard.appendChild(customerBtn);
    
    // Restaurant View Card
    const restaurantCard = createElement('button', 
      'group card p-8 border-2 border-color cursor-pointer transition-all hover:shadow-2xl');
    restaurantCard.onclick = () => AppState.navigateTo('restaurant-list');
    
    const restaurantIcon = createElement('div', 
      'w-20 h-20 gradient-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover-scale transition-transform');
    restaurantIcon.appendChild(createIcon('Store', 'icon-xl'));
    
    const restaurantTitle = createElement('h3', 'mb-3 text-white', 'Restaurant View');
    const restaurantDesc = createElement('p', 'text-secondary mb-6', 
      'Manage your restaurant profile, update your menu, and add new dishes');
    const restaurantBtn = createElement('div', 'inline-block px-6 py-3 bg-blue text-white rounded-lg border-2 border-dark-blue transition-colors', 
      'Manage Restaurant');
    
    restaurantCard.appendChild(restaurantIcon);
    restaurantCard.appendChild(restaurantTitle);
    restaurantCard.appendChild(restaurantDesc);
    restaurantCard.appendChild(restaurantBtn);
    
    viewGrid.appendChild(customerCard);
    viewGrid.appendChild(restaurantCard);
    
    getStartedContainer.appendChild(getStartedTitle);
    getStartedContainer.appendChild(viewGrid);
    getStarted.appendChild(getStartedContainer);
    
    // Features Section
    const features = this.createFeaturesSection();
    
    // How It Works Section
    const howItWorks = this.createHowItWorksSection();
    
    // Team Section
    const team = this.createTeamSection();
    
    // Footer
    const footer = this.createFooter();
    
    container.appendChild(nav);
    container.appendChild(hero);
    container.appendChild(getStarted);
    container.appendChild(features);
    container.appendChild(howItWorks);
    container.appendChild(team);
    container.appendChild(footer);
    
    return container;
  },

  createFeaturesSection() {
    const section = createElement('section', 'py-12 bg-secondary scroll-mt-16');
    section.id = 'features';
    
    const container = createElement('div', 'max-w-7xl mx-auto px-4');
    const title = createElement('h2', 'text-center text-white mb-12', 'Why Choose NomNomNow?');
    
    const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-8');
    
    const features = [
      { icon: 'MapPin', title: 'Area-Based Delivery', desc: 'Browse restaurants and meals available in your specific delivery area', color: 'green' },
      { icon: 'Zap', title: 'Lightning Fast', desc: 'Powered by serverless Azure architecture for instant order processing', color: 'blue' },
      { icon: 'UtensilsCrossed', title: 'Multiple Restaurants', desc: 'Order from different restaurants in a single delivery', color: 'green' },
      { icon: 'DollarSign', title: 'Transparent Pricing', desc: 'See exact costs and delivery times before you order', color: 'blue' },
      { icon: 'Shield', title: 'Secure & Reliable', desc: 'Built on Microsoft Azure cloud infrastructure', color: 'green' },
      { icon: 'Smartphone', title: 'Easy to Use', desc: 'Simple, intuitive interface that works on any device', color: 'blue' }
    ];
    
    features.forEach(feature => {
      const card = createElement('div', `feature-card ${feature.color}`);
      
      const iconWrapper = createElement('div', 
        `w-14 h-14 gradient-${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`);
      iconWrapper.appendChild(createIcon(feature.icon, 'icon-lg'));
      
      const featureTitle = createElement('h3', 'text-center text-white mb-3', feature.title);
      const featureDesc = createElement('p', 'text-secondary text-center', feature.desc);
      
      card.appendChild(iconWrapper);
      card.appendChild(featureTitle);
      card.appendChild(featureDesc);
      
      grid.appendChild(card);
    });
    
    container.appendChild(title);
    container.appendChild(grid);
    section.appendChild(container);
    
    return section;
  },

  createHowItWorksSection() {
    const section = createElement('section', 'py-20 bg-primary scroll-mt-16');
    section.id = 'how-it-works';
    
    const container = createElement('div', 'max-w-7xl mx-auto px-4');
    const title = createElement('h2', 'text-center text-white mb-16', 'How It Works');
    
    const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto');
    
    const steps = [
      { num: '1', title: 'Create Your Profile', desc: 'Tell us who you are and where you are — so we can show you restaurants that deliver to you.' },
      { num: '2', title: 'Discover Great Food', desc: 'Browse a curated list of restaurants in your area and beyond.' },
      { num: '3', title: 'Mix & Match Meals', desc: 'Add dishes from different restaurants into one easy order.' },
      { num: '4', title: 'Confirm & Relax', desc: 'Review your cart, check your delivery time, and place your order. We\'ll handle the rest.' }
    ];
    
    steps.forEach(step => {
      const stepCard = createElement('div', 'text-center');
      
      const numberCircle = createElement('div', 
        'w-20 h-20 gradient-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg');
      const number = createElement('span', 'text-3xl text-white', step.num);
      numberCircle.appendChild(number);
      
      const stepTitle = createElement('h3', 'text-white mb-4', step.title);
      const stepDesc = createElement('p', 'text-secondary', step.desc);
      
      stepCard.appendChild(numberCircle);
      stepCard.appendChild(stepTitle);
      stepCard.appendChild(stepDesc);
      
      grid.appendChild(stepCard);
    });
    
    container.appendChild(title);
    container.appendChild(grid);
    section.appendChild(container);
    
    return section;
  },

  createTeamSection() {
    const section = createElement('section', 'py-20 bg-secondary scroll-mt-16');
    section.id = 'team';
    
    const container = createElement('div', 'max-w-7xl mx-auto px-4');
    const title = createElement('h2', 'text-center text-white mb-16', 'Our Team - Group 2');
    
    const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto');
    
    const team = [
      { name: 'Kiril Petrovski', role: 'Milestone 1: Project Bootstrap & Setup' },
      { name: 'Nicolás Daniel Grass López de Silanes', role: 'Milestone 2: Restaurant Ecosystem & Data' },
      { name: 'Rodrigo Blanco Maldonado', role: 'Milestone 3: Frontend Design & UI' },
      { name: 'Ali Ahmad Lutfi Samara', role: 'Milestone 4: Azure Functions Integration' },
      { name: 'Iciar Adeliño Ordax', role: 'Milestone 5: Final Polish & Presentation' },
      { name: 'Christoph Rintz', role: 'Milestone 6: Advanced Features & Enhancements' }
    ];
    
    team.forEach(member => {
      const card = createElement('div', 'card p-6 border-l-4 border-blue transition-shadow');
      
      const memberName = createElement('h3', 'text-white mb-2', member.name);
      const memberRole = createElement('p', 'text-secondary', member.role);
      
      card.appendChild(memberName);
      card.appendChild(memberRole);
      
      grid.appendChild(card);
    });
    
    container.appendChild(title);
    container.appendChild(grid);
    section.appendChild(container);
    
    return section;
  },

  createFooter() {
    const footer = createElement('footer', 'footer');
    const container = createElement('div', 'max-w-7xl mx-auto px-4 text-center');
    
    const footerTitle = document.createElement('h2');
    footerTitle.className = 'text-white mb-1 text-lg';
    footerTitle.innerHTML = 'NomNomNow <span class="opacity-70">- A Cloud Computing Project</span>';
    
    const footerSubtitle = createElement('p', 'text-white opacity-80 mb-4 text-sm', 
      'IE University | Fall 2025 | Group 2');
    
    const badgeContainer = createElement('div', 'flex flex-wrap justify-center gap-2 mb-4');
    
    ['Azure Functions', 'Azure Storage', 'GitHub Pages', 'Python'].forEach(tech => {
      const badge = createElement('span', 'tech-badge', tech);
      badgeContainer.appendChild(badge);
    });
    
    const disclaimer = createElement('p', 'text-white opacity-60 text-xs', 
      'For educational purposes only');
    
    container.appendChild(footerTitle);
    container.appendChild(footerSubtitle);
    container.appendChild(badgeContainer);
    container.appendChild(disclaimer);
    footer.appendChild(container);
    
    return footer;
  },

  // Customer Authentication View
  customerAuth() {
    const container = createElement('div', 'min-h-screen bg-primary');
    
    if (AppState.customerAuthView === 'choice') {
      return this.customerAuthChoice();
    } else if (AppState.customerAuthView === 'create') {
      return this.customerAuthCreate();
    } else {
      return this.customerAuthSelect();
    }
  },

  customerAuthChoice() {
    const container = createElement('div', 'min-h-screen bg-primary flex items-center justify-center p-4');
    const wrapper = createElement('div', 'max-w-4xl w-full');
    
    // Back button
    const backBtnWrapper = createElement('div', 'mb-6');
    const backBtn = createBackButton('Back to Home', () => AppState.navigateTo('landing'));
    backBtnWrapper.appendChild(backBtn);
    
    // Title
    const titleWrapper = createElement('div', 'text-center mb-12');
    const title = createElement('h1', 'mb-4 text-white', 'Welcome to NomNomNow');
    const subtitle = createElement('p', 'text-xl text-secondary', 'How would you like to continue?');
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(subtitle);
    
    // Choice cards
    const grid = createElement('div', 'grid md:grid-cols-2 gap-6');
    
    // New Customer Card
    const newCustomerCard = createElement('button', 
      'group card p-8 border-2 border-color cursor-pointer transition-all hover:shadow-2xl');
    newCustomerCard.onclick = () => {
      AppState.customerAuthView = 'create';
      AppState.render();
    };
    
    const newCustomerIcon = createElement('div', 
      'w-20 h-20 gradient-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover-scale transition-transform');
    newCustomerIcon.appendChild(createIcon('UserPlus', 'icon-xl'));
    
    const newCustomerTitle = createElement('h2', 'mb-3 text-white', 'New Customer');
    const newCustomerDesc = createElement('p', 'text-secondary', 'Create a new account to start ordering');
    
    newCustomerCard.appendChild(newCustomerIcon);
    newCustomerCard.appendChild(newCustomerTitle);
    newCustomerCard.appendChild(newCustomerDesc);
    
    // Existing Customer Card
    const existingCustomerCard = createElement('button', 
      'group card p-8 border-2 border-color cursor-pointer transition-all hover:shadow-2xl');
    existingCustomerCard.onclick = () => {
      AppState.customerAuthView = 'select';
      AppState.render();
    };
    
    const existingCustomerIcon = createElement('div', 
      'w-20 h-20 gradient-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover-scale transition-transform');
    existingCustomerIcon.appendChild(createIcon('Users', 'icon-xl'));
    
    const existingCustomerTitle = createElement('h2', 'mb-3 text-white', 'Existing Customer');
    const existingCustomerDesc = createElement('p', 'text-secondary', 'Sign in to your account to continue ordering');
    
    existingCustomerCard.appendChild(existingCustomerIcon);
    existingCustomerCard.appendChild(existingCustomerTitle);
    existingCustomerCard.appendChild(existingCustomerDesc);
    
    grid.appendChild(newCustomerCard);
    grid.appendChild(existingCustomerCard);
    
    wrapper.appendChild(backBtnWrapper);
    wrapper.appendChild(titleWrapper);
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
    
    return container;
  },

  customerAuthCreate() {
    const container = createElement('div', 'min-h-screen bg-primary flex items-center justify-center p-4');
    const wrapper = createElement('div', 'max-w-2xl w-full');
    const card = createElement('div', 'card p-8 border border-color');
    
    const title = createElement('h2', 'text-white mb-6', 'Create New Account');
    
    const form = createElement('form', 'space-y-4');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const customer = {
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        area: formData.get('area'),
        address: formData.get('address'),
        phone: formData.get('phone')
      };
      
      if (!validateFormData(customer, ['name', 'lastName', 'area', 'address', 'phone'])) {
        alert('Please fill in all required fields');
        return;
      }
      
      customer.customerId = generateId('cust');
      const customers = DataManager.getCustomers();
      customers.push(customer);
      DataManager.saveCustomers(customers);
      
      AppState.currentCustomer = customer;
      AppState.navigateTo('customer-browse');
    };
    
    // Name fields
    const nameGrid = createElement('div', 'grid md:grid-cols-2 gap-4');
    
    const firstNameWrapper = createElement('div');
    const firstNameLabel = document.createElement('label');
    firstNameLabel.className = 'block text-white mb-2';
    firstNameLabel.innerHTML = 'First Name <span class="text-red">*</span>';
    const firstNameInput = createElement('input', 'input-field');
    firstNameInput.type = 'text';
    firstNameInput.name = 'name';
    firstNameInput.placeholder = 'John';
    firstNameInput.required = true;
    firstNameWrapper.appendChild(firstNameLabel);
    firstNameWrapper.appendChild(firstNameInput);
    
    const lastNameWrapper = createElement('div');
    const lastNameLabel = document.createElement('label');
    lastNameLabel.className = 'block text-white mb-2';
    lastNameLabel.innerHTML = 'Last Name <span class="text-red">*</span>';
    const lastNameInput = createElement('input', 'input-field');
    lastNameInput.type = 'text';
    lastNameInput.name = 'lastName';
    lastNameInput.placeholder = 'Doe';
    lastNameInput.required = true;
    lastNameWrapper.appendChild(lastNameLabel);
    lastNameWrapper.appendChild(lastNameInput);
    
    nameGrid.appendChild(firstNameWrapper);
    nameGrid.appendChild(lastNameWrapper);
    
    // Area field
    const areaWrapper = createElement('div');
    const areaLabel = document.createElement('label');
    areaLabel.className = 'block text-white mb-2';
    areaLabel.innerHTML = 'Area <span class="text-red">*</span>';
    const areaSelect = createElement('select', 'input-field');
    areaSelect.name = 'area';
    ['North', 'East', 'West'].forEach(area => {
      const option = createElement('option', '', area);
      option.value = area;
      areaSelect.appendChild(option);
    });
    areaWrapper.appendChild(areaLabel);
    areaWrapper.appendChild(areaSelect);
    
    // Address field
    const addressWrapper = createElement('div');
    const addressLabel = document.createElement('label');
    addressLabel.className = 'block text-white mb-2';
    addressLabel.innerHTML = 'Address <span class="text-red">*</span>';
    const addressInput = createElement('input', 'input-field');
    addressInput.type = 'text';
    addressInput.name = 'address';
    addressInput.placeholder = '123 Main Street';
    addressInput.required = true;
    addressWrapper.appendChild(addressLabel);
    addressWrapper.appendChild(addressInput);
    
    // Phone field
    const phoneWrapper = createElement('div');
    const phoneLabel = document.createElement('label');
    phoneLabel.className = 'block text-white mb-2';
    phoneLabel.innerHTML = 'Phone <span class="text-red">*</span>';
    const phoneInput = createElement('input', 'input-field');
    phoneInput.type = 'tel';
    phoneInput.name = 'phone';
    phoneInput.placeholder = '555-1234';
    phoneInput.required = true;
    phoneWrapper.appendChild(phoneLabel);
    phoneWrapper.appendChild(phoneInput);
    
    // Buttons
    const buttonWrapper = createElement('div', 'flex gap-3 mt-8');
    const backBtn = createElement('button', 'btn btn-secondary px-6 py-3', 'Back');
    backBtn.type = 'button';
    backBtn.onclick = () => {
      AppState.customerAuthView = 'choice';
      AppState.render();
    };
    
    const submitBtn = createElement('button', 'btn btn-primary px-6 py-3', 'Create Account');
    submitBtn.type = 'submit';
    
    buttonWrapper.appendChild(backBtn);
    buttonWrapper.appendChild(submitBtn);
    
    form.appendChild(nameGrid);
    form.appendChild(areaWrapper);
    form.appendChild(addressWrapper);
    form.appendChild(phoneWrapper);
    form.appendChild(buttonWrapper);
    
    card.appendChild(title);
    card.appendChild(form);
    wrapper.appendChild(card);
    container.appendChild(wrapper);
    
    return container;
  },

  customerAuthSelect() {
    const container = createElement('div', 'min-h-screen bg-primary');
    const wrapper = createElement('div', 'max-w-5xl mx-auto px-4 py-8');
    
    const header = createElement('div', 'mb-8');
    const title = createElement('h2', 'text-white mb-2', 'Select Your Account');
    const subtitle = createElement('p', 'text-secondary', 'Choose your customer profile to continue');
    header.appendChild(title);
    header.appendChild(subtitle);
    
    const customers = DataManager.getCustomers();
    
    const grid = createElement('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-6');
    
    customers.forEach(customer => {
      const card = createElement('button', 'card card-clickable p-6 text-left w-full');
      card.onclick = () => {
        AppState.currentCustomer = customer;
        AppState.navigateTo('customer-browse');
      };
      
      const flex = createElement('div', 'flex items-center gap-3 mb-3');
      
      const avatar = createElement('div', 
        'w-12 h-12 gradient-blue-green rounded-full flex items-center justify-center text-white',
        customer.name[0] + customer.lastName[0]);
      
      const info = createElement('div', 'flex-1');
      const name = createElement('h3', 'text-white', `${customer.name} ${customer.lastName}`);
      const area = createElement('span', 'text-sm text-green', customer.area);
      info.appendChild(name);
      info.appendChild(area);
      
      flex.appendChild(avatar);
      flex.appendChild(info);
      
      const details = createElement('div', 'text-sm text-secondary space-y-1');
      const address = createElement('p', 'line-clamp-1', customer.address);
      const phone = createElement('p', '', customer.phone);
      details.appendChild(address);
      details.appendChild(phone);
      
      card.appendChild(flex);
      card.appendChild(details);
      
      grid.appendChild(card);
    });
    
    const backBtnWrapper = createElement('div', 'mt-6');
    const backBtn = createBackButton('Back to options', () => {
      AppState.customerAuthView = 'choice';
      AppState.render();
    });
    backBtnWrapper.appendChild(backBtn);
    
    wrapper.appendChild(header);
    wrapper.appendChild(grid);
    wrapper.appendChild(backBtnWrapper);
    container.appendChild(wrapper);
    
    return container;
  }
};