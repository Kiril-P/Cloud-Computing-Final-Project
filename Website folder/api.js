// Centralized API helpers for Milestone 3 → switch to real Azure Functions in Milestone 4.
const CONFIG = {
  // TODO: Replace with your Azure Functions URLs (HTTP triggers)
  REGISTER_MEAL_URL: "",    // e.g., https://<funcapp>.azurewebsites.net/api/registerMeal
  LIST_MEALS_URL: "",       // e.g., https://<funcapp>.azurewebsites.net/api/meals?area=Central
  SUBMIT_ORDER_URL: "",     // e.g., https://<funcapp>.azurewebsites.net/api/submitOrder
  // CORS must allow your GitHub Pages origin in Azure.
};

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// --- Local preview mode ---
// While endpoints are empty, use localStorage to simulate IO for Milestone 3.
const LocalSim = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
  push(key, val){ const arr = LocalSim.get(key, []); arr.push(val); LocalSim.set(key, arr); return arr; }
};

export const Api = {
  async registerMeal(meal){
    if (CONFIG.REGISTER_MEAL_URL){
      return await fetchJSON(CONFIG.REGISTER_MEAL_URL, { method:'POST', body: JSON.stringify(meal)});
    } else {
      // simulate write
      const saved = { ...meal, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      LocalSim.push('meals', saved);
      return { ok:true, simulated:true, meal:saved };
    }
  },
  async listMeals(area){
    if (CONFIG.LIST_MEALS_URL){
      const url = CONFIG.LIST_MEALS_URL + (CONFIG.LIST_MEALS_URL.includes('?') ? '&' : '?') + new URLSearchParams({ area });
      return await fetchJSON(url);
    } else {
      const all = LocalSim.get('meals', []);
      return all.filter(m => m.area === area);
    }
  },
  async submitOrder(order){
    if (CONFIG.SUBMIT_ORDER_URL){
      return await fetchJSON(CONFIG.SUBMIT_ORDER_URL, { method:'POST', body: JSON.stringify(order)});
    } else {
      const saved = { id: crypto.randomUUID(), ...order, createdAt: new Date().toISOString() };
      LocalSim.push('orders', saved);
      return { ok:true, simulated:true, orderId: saved.id };
    }
  }
};

export function euro(n){ return new Intl.NumberFormat(undefined, { style:'currency', currency:'EUR' }).format(n); }
