const welcomeText = document.getElementById('welcome-text');
const logoutButton = document.getElementById('logout');

const token = localStorage.getItem('fitness-token');
const user = JSON.parse(localStorage.getItem('fitness-user') || '{}');

if (!token) {
  window.location.href = '../index.html';
}

welcomeText.textContent = user.name ? `Welcome back, ${user.name}!` : 'Welcome back!';

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('fitness-token');
  localStorage.removeItem('fitness-user');
  window.location.href = '../index.html';
});
