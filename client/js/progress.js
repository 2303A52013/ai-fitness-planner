const progressForm = document.getElementById('progress-form');
const progressList = document.getElementById('progress-list');
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

const renderProgress = (entries) => {
  progressList.innerHTML = entries.map(item => `
    <li>
      <strong>${new Date(item.date).toLocaleDateString()}</strong>
      ${item.weight ? `${item.weight} kg` : ''}
      ${item.bodyFat ? `• ${item.bodyFat}% body fat` : ''}
      <div>${item.notes || ''}</div>
    </li>
  `).join('');
};

const loadProgress = async () => {
  const response = await api('progress');
  const entries = await response.json();
  renderProgress(entries);
};

progressForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const weight = Number(document.getElementById('progress-weight').value) || null;
  const bodyFat = Number(document.getElementById('progress-bodyFat').value) || null;
  const notes = document.getElementById('progress-notes').value.trim();

  await api('progress', {
    method: 'POST',
    body: JSON.stringify({ weight, bodyFat, notes })
  });

  progressForm.reset();
  loadProgress();
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('fitness-token');
  localStorage.removeItem('fitness-user');
  window.location.href = '../index.html';
});

loadProgress();
