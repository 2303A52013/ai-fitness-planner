const mealForm = document.getElementById('meal-form');
const mealList = document.getElementById('meal-list');
const logoutButton = document.getElementById('logout');

const token = localStorage.getItem('fitness-token');
if (!token) {
  window.location.href = '../index.html';
}

const API_BASE = '/api';
const api = (path, options = {}) => {
  return fetch(`${API_BASE}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...options
  });
};

const renderMeals = (meals) => {
  mealList.innerHTML = meals.map(meal => `
    <li>
      <strong>${meal.name}</strong> — ${meal.calories} kcal
      <button data-id="${meal._id}" class="small-button">Delete</button>
    </li>
  `).join('');
};

const loadMeals = async () => {
  const response = await api('meals');
  const meals = await response.json();
  renderMeals(meals);
};

mealForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('meal-name').value.trim();
  const calories = Number(document.getElementById('meal-calories').value);
  if (!name || !calories) return;

  await api('meals', {
    method: 'POST',
    body: JSON.stringify({ name, calories })
  });

  mealForm.reset();
  loadMeals();
});

mealList.addEventListener('click', async (event) => {
  if (!event.target.matches('[data-id]')) return;
  const id = event.target.dataset.id;
  await api(`meals/${id}`, { method: 'DELETE' });
  loadMeals();
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('fitness-token');
  localStorage.removeItem('fitness-user');
  window.location.href = '../index.html';
});

loadMeals();
