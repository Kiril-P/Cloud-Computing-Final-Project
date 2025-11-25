# NomNomNow - HTML/CSS/JavaScript Version

This is the pure HTML/CSS/JavaScript version of the NomNomNow food delivery application, converted from the original React application.

## File Structure

```
/
├── index.html          # Main HTML entry point
├── styles.css          # All CSS styles (replaces Tailwind classes)
├── app.js              # Main application logic and state management
├── data.js             # Mock data management (localStorage)
├── utils.js            # Utility functions
├── icons.js            # SVG icon library
├── components.js       # Reusable UI components
└── views.js            # View rendering functions
```

## Features

- **Landing Page**: Hero section, features, how it works, team information, and footer
- **Customer View**: 
  - Authentication (create new customer or select existing)
  - Browse restaurants by area
  - View restaurant menus
  - Add items to cart
  - Place orders with delivery time calculation
  - Manage customer profile
- **Restaurant View**:
  - List all restaurants
  - Create new restaurants
  - Edit restaurant information
  - Manage restaurant details

## Technical Details

### Data Storage
- Uses `localStorage` to store:
  - Restaurants (30 total: 10 per area)
  - Menu items (2 per restaurant)
  - Customers
  - Orders

### Styling
- Custom CSS with CSS variables for theming
- Dark theme: Navy background (#0F1825), dark cards (#1E293B)
- Blue (#3B82F6) and green (#10B981) accent colors
- Fully responsive design

### JavaScript Architecture
- **AppState**: Central state management object
- **DataManager**: Handles all localStorage operations
- **Views**: Renders different views/pages
- **Components**: Reusable UI component builders
- **Icons**: SVG icon library (replacing lucide-react)
- **Utils**: Helper functions for calculations and formatting

### Key Functionality
- Area-based delivery system (North, East, West)
- Multi-restaurant ordering
- Smart delivery time calculation based on area proximity
- Search and filter capabilities
- Form validation
- Cart management

## How to Use

### For GitHub Pages
1. Simply upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. The site will be available at `https://yourusername.github.io/repository-name/`

### For Local Development
1. Open `index.html` in a web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Differences from React Version

1. **No Build Process**: Runs directly in the browser
2. **No Dependencies**: Pure vanilla JavaScript
3. **Manual DOM Manipulation**: Instead of React's virtual DOM
4. **State Management**: Simple object-based state instead of React hooks
5. **Routing**: Hash-based navigation instead of React Router
6. **Icons**: Inline SVG instead of lucide-react components

## Performance

- Fast initial load (no framework overhead)
- Efficient DOM updates
- Lightweight (~50KB total, uncompressed)
- Works offline after first load (with service worker, if added)

## Future Enhancements

Potential improvements:
- Add service worker for offline support
- Implement URL-based routing with hash navigation
- Add image optimization and lazy loading
- Include form validation feedback
- Add animations and transitions
- Connect to real Azure Functions backend

## Credits

- **Team**: Group 2
- **Project**: Cloud Computing - IE University Fall 2025
- **Technologies**: HTML5, CSS3, JavaScript (ES6+), Azure Functions, Azure Storage

## License

For educational purposes only.
