import { Api, euro } from './api.js';

const areaSelect = document.getElementById('areaSelect');
const loadBtn = document.getElementById('loadMealsBtn');
const list = document.getElementById('mealsList');
const stepBrowse = document.getElementById('step-browse');
const stepCheckout = document.getElementById('step-checkout');
const stepConfirm = document.getElementById('step-confirm');
const cartSummary = document.getElementById('cartSummary');
const backToBrowse = document.getElementById('backToBrowse');
const orderMsg = document.getElementById('orderMsg');
const submitBtn = document.getElementById('submitOrderBtn');

let cart = [];

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function renderMeals(meals){
  list.innerHTML = '';
  if (!meals.length){
    list.innerHTML = '<p class="small">No meals found for this area yet.</p>';
    return;
  }
  meals.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="space-between">
        <div>
          <h3>${m.dishName} <span class="badge">${m.area}</span></h3>
          <p class="small">by ${m.restaurantName ?? 'Unknown'} • ${m.prepMinutes} min prep</p>
          <p>${m.description ?? ''}</p>
          <p><strong>${euro(m.price)}</strong></p>
        </div>
        <div style="min-width:160px;text-align:right">
          <label>Qty</label>
          <input type="number" min="0" step="1" value="0" style="width:100%">
          <button class="addBtn" style="margin-top:8px">Add</button>
        </div>
      </div>
    `;
    const qtyInput = card.querySelector('input');
    card.querySelector('.addBtn').addEventListener('click', () => {
      const qty = Number(qtyInput.value);
      if (qty > 0){
        cart.push({ id: m.id ?? crypto.randomUUID(), dishName: m.dishName, price: m.price, prepMinutes: m.prepMinutes, qty });
        qtyInput.value = 0;
        updateCartSummary();
        show(stepCheckout);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
    list.appendChild(card);
  });
}

function totals(){
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  const prep = cart.reduce((s,i)=> s + i.prepMinutes * i.qty, 0);
  const FIXED_PICKUP = 10;
  const FIXED_DELIVERY = 20;
  const eta = prep + FIXED_PICKUP + FIXED_DELIVERY;
  return { total, eta, prep, FIXED_PICKUP, FIXED_DELIVERY };
}

function updateCartSummary(){
  if (!cart.length){
    cartSummary.innerHTML = '<p class="small">Your cart is empty.</p>';
    hide(stepCheckout);
    return;
  }
  const { total, eta } = totals();
  const rows = cart.map(c => `<tr><td>${c.dishName} × ${c.qty}</td><td>${euro(c.price*c.qty)}</td><td>${c.prepMinutes*c.qty}m</td></tr>`).join('');
  cartSummary.innerHTML = `
    <table class="table">
      <thead><tr><th>Item</th><th>Subtotal</th><th>Prep</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><th>Total</th><th>${euro(total)}</th><th>${eta}m est.</th></tr></tfoot>
    </table>
  `;
}

loadBtn.addEventListener('click', async () => {
  loadBtn.disabled = true;
  try{
    const meals = await Api.listMeals(areaSelect.value);
    renderMeals(meals);
  }catch(err){
    console.error(err);
    list.innerHTML = '<div class="notice error">Failed to load meals. Check console and API URL.</div>';
  }finally{
    loadBtn.disabled = false;
  }
});

backToBrowse.addEventListener('click', (e)=>{
  e.preventDefault();
  show(stepBrowse);
  hide(stepConfirm);
  window.scrollTo({ top:0, behavior:'smooth' });
});

submitBtn.addEventListener('click', async ()=>{
  orderMsg.className = 'notice hidden';
  if (!cart.length){
    orderMsg.textContent = 'Please add at least one item.';
    orderMsg.classList.remove('hidden'); orderMsg.classList.add('error'); return;
  }
  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const area = document.getElementById('custArea').value;
  const phone = document.getElementById('custPhone').value.trim();
  if (!name || !address || !area){
    orderMsg.textContent = 'Name, address, and delivery area are required.';
    orderMsg.classList.remove('hidden'); orderMsg.classList.add('error'); return;
  }
  const { total, eta } = totals();
  const order = {
    customer: { name, address, area, phone: phone || null },
    items: cart,
    pricing: { total, currency: 'EUR' },
    etaMinutes: eta,
    createdAt: new Date().toISOString()
  };
  try{
    const res = await Api.submitOrder(order);
    hide(stepBrowse); hide(stepCheckout); show(stepConfirm);
    document.getElementById('confirmDetails').innerHTML =
      `Thanks, <strong>${name}</strong>! Your order total is <strong>${euro(total)}</strong>. `+
      `Estimated delivery time: <strong>${eta} minutes</strong>. `+
      (res?.orderId ? `Order ID: <code>${res.orderId}</code>. `: '') +
      (res?.simulated ? '(local preview)' : '');
  }catch(err){
    console.error(err);
    orderMsg.textContent = 'Failed to submit order. Check console and API URL.';
    orderMsg.classList.remove('hidden'); orderMsg.classList.add('error');
  }
});

// Auto-load meals for default area on first paint (nice UX)
window.addEventListener('DOMContentLoaded', ()=>{
  loadBtn.click();
});
