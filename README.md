# NomNomNow - Food Delivery Platform

A serverless multi-restaurant food ordering platform built with React, TypeScript, and Microsoft Azure.

---

## 👥 Team Members (Group 2)

- **Kiril Petrovski** - Milestone 1: Project Bootstrap & Setup
- **Nicolás Daniel Grass López de Silanes** - Milestone 2: Restaurant Ecosystem & Data
- **Rodrigo Blanco Maldonado** - Milestone 3: Frontend Design & UI
- **Ali Ahmad Lutfi Samara** - Milestone 4: Azure Functions Integration
- **Icíar Adeliño Ordax** - Milestone 5: Final Polish & Presentation
- **Christoph Rintz** - Milestone 6: Advanced Features & Enhancements

---

## 🎯 Project Vision

NomNomNow is a cloud-based food ordering platform that connects restaurants with customers in their delivery area. Built using serverless Azure architecture, the platform showcases:

- **Area-based delivery system** - Customers browse meals available in their area (North, East, West)
- **Multi-restaurant ordering** - Order from multiple restaurants in a single delivery
- **Restaurant management** - Restaurants can register and update their menu offerings
- **Smart order processing** - Calculate delivery times and costs dynamically based on prep time and location
- **Real-time status updates** - Automated order status tracking with Azure Functions

This project demonstrates real-world cloud computing concepts including serverless functions, NoSQL storage, queue-based error handling, and static web hosting.

---

## 🏗️ Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS v3.4** for modern, responsive design
- **Lucide React** for consistent iconography
- **Hash-based routing** for GitHub Pages compatibility
- **Hosted on GitHub Pages** with automated CI/CD via GitHub Actions

### **Backend**
- **Azure Functions** (Python 3.x)
- **HTTP-triggered API endpoints** (RestaurantApi, CustomerApi, MenuApi, OrderApi)
- **Timer-triggered functions** (OrderStatusUpdater - runs every 5 minutes)

### **Storage**
- **Azure Table Storage** for NoSQL data (4 tables: Restaurant, Customer, Menu, Order)
- **Azure Queue Storage** for error handling and invalid order logging (`invalid-orders-queue`)
- **LocalStorage** as client-side cache for performance

### **DevOps**
- **GitHub Actions** for automated deployment
- **GitHub Pages** for static hosting
- **Azure Functions** deployed to `group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net`

---

## 📁 Project Structure

```
Cloud-Computing-Final-Project/
├── src/                          # React frontend source
│   ├── components/
│   │   ├── CustomerView/         # Customer-facing components
│   │   │   ├── CustomerAuth.tsx
│   │   │   ├── CustomerProfile.tsx
│   │   │   ├── RestaurantBrowse.tsx
│   │   │   ├── RestaurantMenu.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── RestaurantView/       # Restaurant management
│   │   │   ├── RestaurantList.tsx
│   │   │   ├── RestaurantProfile.tsx
│   │   │   └── CreateRestaurant.tsx
│   │   ├── Header.tsx
│   │   └── LandingPage.tsx
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── mockData.ts           # API client & data management
│   └── App.tsx                   # Main application router
├── azure functions/              # Azure Functions backend
│   ├── RestaurantApi/            # Restaurant CRUD operations
│   ├── CustomerApi/              # Customer CRUD operations
│   ├── MenuApi/                  # Menu CRUD operations
│   ├── OrderApi/                 # Order management + validation
│   ├── OrderStatusUpdater/       # Timer-triggered status updates
│   ├── requirements.txt          # Python dependencies
│   └── host.json                 # Azure Functions config
├── .github/workflows/
│   └── deploy.yml                # GitHub Pages deployment
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 📋 Milestones

- [x] **Milestone 1**: Bootstrap & Setup (Sep 30) - Kiril
- [x] **Milestone 2**: Restaurant Ecosystem & Data (Oct 19) - Nicolás
- [x] **Milestone 3**: Frontend Design (Nov 9) - Rodrigo
- [x] **Milestone 4**: Azure Functions Integration (Nov 23) - Ali
- [x] **Milestone 5**: Final Delivery & Presentation (Dec 14) - Icíar
- [x] **Milestone 6**: Advanced Features & Enhancements - Christoph

---

## 🚀 Current Status

### ✅ **Completed Features**

#### **Frontend (100% Complete)**
- ✅ Modern React + TypeScript SPA with full routing
- ✅ Landing page with hero, features, team, and how-it-works sections
- ✅ Customer View:
  - Customer authentication (create/select account)
  - Restaurant browsing with search and area filtering
  - Menu viewing with item availability
  - Multi-restaurant cart system
  - Smart delivery time calculation
  - Order summary and checkout
  - Customer profile management
  - Order history tracking
- ✅ Restaurant View:
  - Restaurant list with search/filter
  - Restaurant profile editor
  - Menu management (add/edit/delete/toggle availability)
  - Create new restaurant functionality
- ✅ Responsive design with Tailwind CSS
- ✅ Client-side caching with LocalStorage
- ✅ Deployed to GitHub Pages with automated CI/CD

#### **Backend (100% Complete)**
- ✅ **RestaurantApi** (GET, POST, PUT)
  - Query by area and restaurantId
  - Create/update restaurant details
- ✅ **CustomerApi** (GET, POST, PUT)
  - Query by area and customerId
  - Create/update customer profiles
- ✅ **MenuApi** (GET, POST, PUT, DELETE)
  - Query by area, dishId, and max_price
  - Full CRUD operations for menu items
- ✅ **OrderApi** (GET, POST, PUT)
  - Query by area, orderId, and customerId
  - Order validation with error queue integration
  - Invalid orders sent to Azure Queue Storage
- ✅ **OrderStatusUpdater** (Timer-triggered)
  - Runs every 5 minutes
  - Automatically updates order status from "pending" to "delivered"
  - Based on order timestamp + estimated delivery time

#### **Storage & Infrastructure**
- ✅ Azure Table Storage with 4 tables:
  - **RestaurantTable**: Partition by area, Row key = restaurantId
  - **CustomerTable**: Partition by area, Row key = customerId
  - **MenuTable**: Partition by area, Row key = dishId
  - **OrderTable**: Partition by area, Row key = orderId
- ✅ Azure Queue Storage:
  - `invalid-orders-queue` for error logging and monitoring
- ✅ CORS enabled for cross-origin requests
- ✅ Frontend fetches data from live Azure Functions on initialization
- ✅ GitHub Actions workflow for automated deployment

#### **Data**
- ✅ 30 restaurants (10 per area: North, East, West)
- ✅ 60+ menu items (2+ dishes per restaurant)
- ✅ 3 sample customers (1 per area)
- ✅ Real-time data sync between Azure and frontend

---

## 🔗 Links

- **Live Demo**: https://kiril-p.github.io/Cloud-Computing-Final-Project/
- **Azure Functions API**: `https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api/`
- **GitHub Repository**: https://github.com/Kiril-P/Cloud-Computing-Final-Project
- **Course**: Cloud Computing (BCSAI2025N-CSAI.2.M.A_C2_493749)
- **Instructor**: Eduardo Rodríguez Lorenzo
- **Institution**: IE University

---

## 🚀 Getting Started

### **Running Locally**

```bash
# Clone the repository
git clone https://github.com/Kiril-P/Cloud-Computing-Final-Project.git
cd Cloud-Computing-Final-Project

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Deploying to GitHub Pages**

The project automatically deploys to GitHub Pages on every push to `main` via GitHub Actions.

Manual deployment:
```bash
npm run deploy
```

---

## 📊 Architecture Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  React Frontend (GitHub Pages)      │
│  - Client-side routing               │
│  - LocalStorage cache                │
│  - Fetch API integration             │
└────────┬────────────────────────────┘
         │
         ↓ HTTPS
┌─────────────────────────────────────┐
│  Azure Functions (Python)           │
│  - RestaurantApi (GET/POST/PUT)     │
│  - CustomerApi (GET/POST/PUT)       │
│  - MenuApi (GET/POST/PUT/DELETE)    │
│  - OrderApi (GET/POST/PUT)          │
│  - OrderStatusUpdater (Timer)       │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────┬──────────────────┐
│                 │                  │
↓                 ↓                  ↓
┌────────────┐  ┌──────────────┐  ┌─────────────┐
│   Azure    │  │    Azure     │  │   Azure     │
│   Table    │  │    Queue     │  │    Blob     │
│  Storage   │  │   Storage    │  │   Storage   │
│            │  │              │  │  (future)   │
│ 4 Tables:  │  │ Error Queue: │  │             │
│ Restaurant │  │  - Invalid   │  │ - Images    │
│ Customer   │  │    orders    │  │             │
│ Menu       │  │              │  │             │
│ Order      │  │              │  │             │
└────────────┘  └──────────────┘  └─────────────┘
```

---

## 💡 Key Features

### **Intelligent Delivery Time Calculation**

**Single Restaurant Order:**
- Estimated Time = Max Prep Time + Pickup Time + Delivery Time
- Same area: 5 min pickup + 5 min delivery
- Different area: 10 min pickup + 10 min delivery

**Multiple Restaurant Order:**
- Estimated Time = Max(All Prep Times) + (Same Area Restaurants × 5) + (Different Area Restaurants × 10) + Max(Delivery Time)

### **Order Validation & Error Handling**

Invalid orders are automatically captured and sent to Azure Queue Storage for review:
- Missing required fields (area, orderId, customerId, dishesOrdered)
- Invalid data types
- Empty dish lists
- Malformed JSON

### **Automated Order Status Updates**

The `OrderStatusUpdater` function runs every 5 minutes and:
1. Queries all "pending" orders
2. Checks if estimated delivery time has passed
3. Updates status to "delivered" automatically

---

## 🗂️ Data Schema

### **RestaurantTable**
| Field | Type | Description |
|-------|------|-------------|
| PartitionKey | string | Area (North/East/West) |
| RowKey | string | restaurantId |
| Name | string | Restaurant name |
| Description | string | Description |
| Address | string | Physical address |
| Phone | string | Contact phone |
| ImageURL | string | Restaurant image URL |

### **CustomerTable**
| Field | Type | Description |
|-------|------|-------------|
| PartitionKey | string | Area (North/East/West) |
| RowKey | string | customerId |
| Name | string | First name |
| LastName | string | Last name |
| Address | string | Delivery address |
| Phone | string | Contact phone |

### **MenuTable**
| Field | Type | Description |
|-------|------|-------------|
| PartitionKey | string | Area (North/East/West) |
| RowKey | string | dishId |
| RestaurantID | string | Associated restaurant |
| Name | string | Dish name |
| Description | string | Dish description |
| Price | float | Price in currency |
| PrepTime | int | Preparation time (minutes) |
| IsAvailable | bool | Availability status |
| ImageURL | string | Dish image URL |

### **OrderTable**
| Field | Type | Description |
|-------|------|-------------|
| PartitionKey | string | Area (North/East/West) |
| RowKey | string | orderId |
| CustomerID | string | Customer who placed order |
| DishesOrdered | JSON string | Array of dish objects |
| EstimatedTime | int | Delivery time (minutes) |
| EstimatedArrival | string | ISO timestamp |
| TotalCost | string | Total cost with currency |
| Status | string | pending/preparing/delivering/delivered |
| Timestamp | datetime | Auto-generated by Azure |

---

## 📚 API Endpoints

**Base URL**: `https://group2functions-btcnfpg4gmbefact.spaincentral-01.azurewebsites.net/api/`

### **RestaurantApi**
- `GET /restaurantapi?area=North` - Get all restaurants in area
- `GET /restaurantapi?restaurantId=R001` - Get specific restaurant
- `POST /restaurantapi` - Create new restaurant
- `PUT /restaurantapi` - Update restaurant

### **CustomerApi**
- `GET /customerapi?area=East` - Get all customers in area
- `GET /customerapi?customerId=C001` - Get specific customer
- `POST /customerapi` - Create new customer
- `PUT /customerapi` - Update customer

### **MenuApi**
- `GET /menuapi?area=West` - Get all menu items in area
- `GET /menuapi?restaurantId=R001` - Get menu for restaurant
- `GET /menuapi?max_price=15.0` - Filter by max price
- `POST /menuapi` - Create new menu item
- `PUT /menuapi` - Update menu item
- `DELETE /menuapi` - Delete menu item

### **OrderApi**
- `GET /orderapi?customerId=C001` - Get customer's orders
- `GET /orderapi?orderId=O001` - Get specific order
- `POST /orderapi` - Create new order (with validation)
- `PUT /orderapi` - Update order status

---

## 📚 Resources

- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure Table Storage](https://docs.microsoft.com/azure/storage/tables/)
- [Azure Queue Storage](https://docs.microsoft.com/azure/storage/queues/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub Pages](https://pages.github.com/)

---

**Academic Year:** Fall 2024  
**Final Delivery:** December 14, 2024  
**Status:** ✅ Project Complete
#WEBSITE INFO
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
