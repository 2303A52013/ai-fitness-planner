const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');
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

const renderWorkouts = (workouts) => {
  workoutList.innerHTML = workouts.map(workout => `
    <li>
      <strong>${workout.title}</strong> — ${workout.duration} min (${workout.intensity})
      <button data-id="${workout._id}" class="small-button">Delete</button>
    </li>
  `).join('');
};

const loadWorkouts = async () => {
  const response = await api('workouts');
  const workouts = await response.json();
  renderWorkouts(workouts);
};

workoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('workout-title').value.trim();
  const duration = Number(document.getElementById('workout-duration').value);
  const intensity = document.getElementById('workout-intensity').value;
  if (!title || !duration) return;

  await api('workouts', {
    method: 'POST',
    body: JSON.stringify({ title, duration, intensity })
  });

  workoutForm.reset();
  loadWorkouts();
});

workoutList.addEventListener('click', async (event) => {
  if (!event.target.matches('[data-id]')) return;
  const id = event.target.dataset.id;
  await api(`workouts/${id}`, { method: 'DELETE' });
  loadWorkouts();
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('fitness-token');
  localStorage.removeItem('fitness-user');
  window.location.href = '../index.html';
});

loadWorkouts();
