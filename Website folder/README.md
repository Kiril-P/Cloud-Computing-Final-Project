# CloudBites · Milestone 3 (Static Frontend)

This is a ready-to-deploy static site for your Azure Eats project.

## Structure
- `index.html` – Landing page with links.
- `restaurant.html` – Restaurant meal registration form.
- `customer.html` – Customer browsing and checkout flow.
- `styles.css` – Minimal brand styling.
- `js/api.js` – Config + API helpers. Uses localStorage when endpoints are empty.
- `js/restaurant.js` – Logic for restaurant form.
- `js/customer.js` – Logic for customer browsing + order.

## How to use
1. **Deploy with GitHub Pages** (project/site mode). Put these files at repo root or `/docs`.
2. For Milestone 3 demos, it works offline using `localStorage`.
3. For Milestone 4, set your Azure Function URLs inside `js/api.js`:
   ```js
   const CONFIG = {
     REGISTER_MEAL_URL: "https://<funcapp>.azurewebsites.net/api/registerMeal",
     LIST_MEALS_URL: "https://<funcapp>.azurewebsites.net/api/meals",
     SUBMIT_ORDER_URL: "https://<funcapp>.azurewebsites.net/api/submitOrder"
   };
   ```
4. Ensure **CORS** in Azure allows your GitHub Pages origin.

## Notes
- Delivery time = sum of prep minutes + 10 (pickup) + 20 (delivery).
- Areas are fixed: Central, North, South (adjust in HTML as needed).
- The UI is intentionally simple; add your branding/colors as you like.
