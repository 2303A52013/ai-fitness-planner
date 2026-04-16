// js/app.js — Shared utilities: API, auth helpers, toast, sidebar
const API_BASE = 'http://localhost:5000';

/* ─── Token Management ───────────────────────────────────────────────── */
const Auth = {
  getToken: () => localStorage.getItem('fitness_token'),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('fitness_user'));
    } catch {
      return null;
    }
  },
  setToken: (token) => localStorage.setItem('fitness_token', token),
  setUser: (user) => localStorage.setItem('fitness_user', JSON.stringify(user)),
  isLoggedIn: () => !!localStorage.getItem('fitness_token'),
  logout: () => {
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_user');
    window.location.href = '/index.html';
  },
};

/* ─── API Helper ───────────────────────────────────────────────────── */
const api = async (endpoint, options = {}) => {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (res.status === 401) {
      Auth.logout();
      return null;
    }

    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err.message);
    throw err;
  }
};

/* ─── Toast Notifications ───────────────────────────────────────────── */
const Toast = (() => {
  let container;

  const init = () => {
    if (!document.querySelector('.toast-container')) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    } else {
      container = document.querySelector('.toast-container');
    }
  };

  const show = (message, type = 'info', duration = 3500) => {
    init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  return {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info'),
  };
})();

/* ─── Sidebar Setup ─────────────────────────────────────────────────── */
const Sidebar = {
  init: () => {
    const user = Auth.getUser();
    if (!user) return;

    const nameEl = document.getElementById('sidebarUserName');
    const goalEl = document.getElementById('sidebarUserGoal');
    const avatarEl = document.getElementById('sidebarAvatar');

    if (nameEl) nameEl.textContent = user.name || 'User';
    if (goalEl) goalEl.textContent = (user.goal || 'maintenance').replace('_', ' ');
    if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href') || '';
      if (href.includes(currentPage) && currentPage !== '') {
        item.classList.add('active');
      }
    });

    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburger && sidebar && overlay) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  },
};

/* ─── Auth Guard ────────────────────────────────────────────────────── */
const requireAuth = () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
};

/* ─── Formatting Helpers ─────────────────────────────────────────────── */
const fmt = {
  number: (n) => n?.toLocaleString() ?? '0',
  date: (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  percent: (n) => `${Math.round(n)}%`,
  kcal: (n) => `${Math.round(n)} kcal`,
};
