import { Api, euro } from './api.js';

const form = document.getElementById('mealForm');
const msg = document.getElementById('formMsg');
const recentTbody = document.querySelector('#recentTable tbody');

function showMsg(text, ok=true){
  msg.textContent = text;
  msg.classList.remove('hidden', 'error', 'success');
  msg.classList.add(ok ? 'success' : 'error');
}

function addRecentRow(m){
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${m.dishName}</td><td><span class="badge">${m.area}</span></td><td>${m.prepMinutes}m</td><td>${euro(m.price)}</td>`;
  recentTbody.prepend(tr);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const meal = {
    restaurantName: document.getElementById('restaurantName').value.trim(),
    dishName: document.getElementById('dishName').value.trim(),
    description: document.getElementById('description').value.trim(),
    prepMinutes: Number(document.getElementById('prepMinutes').value),
    price: Number(document.getElementById('price').value),
    area: document.getElementById('area').value,
    imageUrl: document.getElementById('imageUrl').value.trim() || null
  };

  if (!meal.restaurantName || !meal.dishName || !meal.prepMinutes || !meal.price || !meal.area){
    showMsg('Please fill all required fields.', false);
    return;
  }

  try{
    const res = await Api.registerMeal(meal);
    showMsg('Meal saved successfully ' + (res.simulated ? '(local preview)' : ''));
    addRecentRow(meal);
    form.reset();
  }catch(err){
    console.error(err);
    showMsg('Failed to save meal. Check console and API URL.', false);
  }
});

// Load recent from localStorage on first paint
(function loadRecent(){
  try{
    const meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals.slice(-10).reverse().forEach(addRecentRow);
  }catch{}
})();
