document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginAlert = document.getElementById('loginAlert');

    // Check if already logged in
    if (localStorage.getItem('user')) {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Save user data
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                if (response.status === 500) {
                    loginAlert.textContent = 'Server Error: Make sure your MySQL database is running and configured properly.';
                } else {
                    loginAlert.textContent = data.error || 'Login failed';
                }
                loginAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            loginAlert.textContent = 'Server connection failed. Please ensure the backend server (Node.js) is running on port 5000 and the database is configured.';
            loginAlert.classList.remove('d-none');
        }
    });
});
