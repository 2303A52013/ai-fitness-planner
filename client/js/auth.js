const authForm = document.getElementById('auth-form');
const showLogin = document.getElementById('show-login');
const showRegister = document.getElementById('show-register');
const authTitle = document.getElementById('auth-title');
const nameGroup = document.getElementById('name-group');
const authMessage = document.getElementById('auth-message');

let isRegister = false;

const activateButton = (button) => {
  showLogin.classList.remove('active');
  showRegister.classList.remove('active');
  button.classList.add('active');
};

showLogin.addEventListener('click', () => {
  isRegister = false;
  authTitle.textContent = 'Login';
  nameGroup.style.display = 'none';
  activateButton(showLogin);
  authMessage.textContent = '';
});

showRegister.addEventListener('click', () => {
  isRegister = true;
  authTitle.textContent = 'Register';
  nameGroup.style.display = 'block';
  activateButton(showRegister);
  authMessage.textContent = '';
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

const API_BASE = '/api';
  const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
  const payload = { email, password };
  if (isRegister) payload.name = name;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      authMessage.textContent = data.message || 'Unable to sign in at this time';
      return;
    }

    localStorage.setItem('fitness-token', data.token);
    localStorage.setItem('fitness-user', JSON.stringify(data.user));
    window.location.href = 'pages/dashboard.html';
  } catch (error) {
    authMessage.textContent = 'Network error, try again later.';
  }
});

showLogin.click();
