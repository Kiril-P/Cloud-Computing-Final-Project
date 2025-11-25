NomNomNow - Food Delivery Platform
A serverless multi-restaurant food ordering platform built with Microsoft Azure.

👥 Team Members (Group 2)
Kiril Petrovski - Milestone 1: Project Bootstrap & Setup
Nicolás Daniel Grass López de Silanes - Milestone 2: Restaurant Ecosystem & Data
Rodrigo Blanco Maldonado - Milestone 3: Frontend Design & UI
Ali Ahmad Lutfi Samara - Milestone 4: Azure Functions Integration
Icíar Adeliño Ordax - Milestone 5: Final Polish & Presentation
Christoph Rintz - Milestone 6: Advanced Features & Enhancements
🎯 Project Vision
NomNomNow is a cloud-based food ordering platform that connects restaurants with customers in their delivery area. Built using serverless Azure architecture, the platform will showcase:

Area-based delivery system - Customers browse meals available in their area
Restaurant meal management - Restaurants can register and update their menu offerings
Smart order processing - Calculate delivery times and costs dynamically
Advanced features - Variable delivery times, restaurant grouping, and geolocation capabilities
This project demonstrates real-world cloud computing concepts including serverless functions, NoSQL storage, and static web hosting.

🏗️ Technology Stack
Frontend:

HTML5, CSS3, JavaScript
Hosted on GitHub Pages
Backend:

Azure Functions (Python)
HTTP triggers for API endpoints
Storage:

Azure Table Storage (restaurant and meal data)
Azure Blob Storage (meal images)
Azure Queue Storage (error handling)
📁 Project Structure
nomnownow/
├── index.html           # Landing page
├── frontend/            # Frontend files (Milestone 3+)
├── backend/             # Azure Functions (Milestone 4+)
├── data/                # Sample data & scripts (Milestone 2+)
└── docs/                # Documentation & presentation (Milestone 5+)
📋 Milestones
 Milestone 1: Bootstrap & Setup (Sep 30) - Kiril
 Milestone 2: Restaurant Ecosystem (Oct 19) - Nicolás
 Milestone 3: Frontend Design (Nov 9) - Rodrigo
 Milestone 4: Azure Functions (Nov 23) - Ali
 Milestone 5: Final Delivery (Dec 14) - Icíar
 Milestone 6: Advanced Features - Christoph
🚀 Current Status
Milestone 1 Complete:

✅ GitHub repository structure
✅ Team organization and responsibilities
✅ Placeholder website
✅ Project vision documented
⏳ GitHub Pages deployment (pending)
⏳ Instructor invited to repository (pending)
🔗 Links
GitHub Pages: https://kiril-p.github.io/Cloud-Computing-Final-Project/
Course: Cloud Computing (BCSAI2025N-CSAI.2.M.A_C2_493749)
Instructor: Eduardo Rodríguez Lorenzo
Institution: IE University
📚 Resources
Azure Functions Documentation
Azure Table Storage
GitHub Pages
Academic Year: Fall 2025
Final Delivery: December 14, 2025





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
