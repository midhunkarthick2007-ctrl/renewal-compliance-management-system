// Base URL for API
const API_BASE_URL = '/api';

// Check if user is logged in (unless on login page)
function checkAuth() {
    const user = localStorage.getItem('user');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && currentPage !== 'login.html' && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'login.html';
    }

    if (user && document.getElementById('userNameDisplay')) {
        const userData = JSON.parse(user);
        document.getElementById('userNameDisplay').textContent = `Welcome, ${userData.name}`;
    }
}

// Handle Logout
function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Format date to YYYY-MM-DD for input fields
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Format date to readable string (e.g., Oct 10, 2026)
function formatDateReadable(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Get appropriate badge color based on status
function getStatusBadge(status) {
    switch (status) {
        case 'Active': return '<span class="badge bg-success">Active</span>';
        case 'Due Soon': return '<span class="badge bg-warning text-dark">Due Soon</span>';
        case 'Expired': return '<span class="badge bg-danger">Expired</span>';
        case 'Renewed': return '<span class="badge bg-info">Renewed</span>';
        default: return `<span class="badge bg-secondary">${status}</span>`;
    }
}

// Calculate days remaining
function getDaysRemaining(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    handleLogout();
});
