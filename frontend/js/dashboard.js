document.addEventListener('DOMContentLoaded', async () => {
    
    try {
        // Fetch dashboard stats
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        const data = await response.json();
        
        // Update counts
        document.getElementById('totalCount').textContent = data.total || 0;
        document.getElementById('activeCount').textContent = data.active || 0;
        document.getElementById('dueCount').textContent = data.dueSoon || 0;
        document.getElementById('expiredCount').textContent = data.expired || 0;
        
        // Populate recent table
        const tbody = document.getElementById('recentTableBody');
        tbody.innerHTML = '';
        
        if (data.recent && data.recent.length > 0) {
            data.recent.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="fw-bold">${item.renewal_name}</td>
                    <td>${item.renewal_type}</td>
                    <td>${formatDateReadable(item.renewal_date)}</td>
                    <td>${getStatusBadge(item.status)}</td>
                    <td>
                        <a href="details.html?id=${item.id}" class="btn btn-sm btn-outline-info"><i class="bi bi-eye"></i></a>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No recent records found.</td></tr>';
        }
        
        // Fetch and populate reminders
        loadReminders();
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
});

async function loadReminders() {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals`);
        const renewals = await response.json();
        
        const container = document.getElementById('remindersContainer');
        container.innerHTML = '';
        
        // Filter renewals that are active and not renewed, sort by date
        const upcoming = renewals.filter(r => r.status !== 'Renewed').sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date));
        
        let reminderCount = 0;
        
        upcoming.forEach(item => {
            if (reminderCount >= 5) return; // Show max 5
            
            const days = getDaysRemaining(item.renewal_date);
            let alertClass = '';
            let icon = '';
            let message = '';
            
            if (days < 0) {
                alertClass = 'alert-danger';
                icon = 'bi-x-circle';
                message = `Expired ${Math.abs(days)} days ago`;
            } else if (days <= 7) {
                alertClass = 'alert-danger';
                icon = 'bi-exclamation-octagon';
                message = days === 0 ? 'Expires TODAY' : `Expires in ${days} days`;
            } else if (days <= item.reminder_days) {
                alertClass = 'alert-warning';
                icon = 'bi-exclamation-triangle';
                message = `Expires in ${days} days`;
            } else {
                return; // Skip if beyond reminder threshold
            }
            
            const div = document.createElement('div');
            div.className = `alert ${alertClass} d-flex align-items-center mb-2 py-2`;
            div.innerHTML = `
                <i class="bi ${icon} fs-4 me-3"></i>
                <div>
                    <h6 class="mb-0 fw-bold">${item.renewal_name}</h6>
                    <small>${message}</small>
                </div>
            `;
            container.appendChild(div);
            reminderCount++;
        });
        
        if (reminderCount === 0) {
            container.innerHTML = '<p class="text-center text-muted my-3">No immediate reminders.</p>';
        }
        
    } catch (error) {
        console.error('Error loading reminders:', error);
        document.getElementById('remindersContainer').innerHTML = '<p class="text-danger text-center">Failed to load reminders.</p>';
    }
}
