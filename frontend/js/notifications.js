document.addEventListener('DOMContentLoaded', async () => {
    await loadNotifications();
});

async function loadNotifications() {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals`);
        const data = await response.json();
        
        const expired = [];
        const urgent = [];
        const upcoming = [];
        
        // Categorize renewals
        data.forEach(item => {
            if (item.status === 'Renewed') return; // Skip renewed items
            
            const days = getDaysRemaining(item.renewal_date);
            
            if (days < 0 || item.status === 'Expired') {
                item.daysOverdue = Math.abs(days);
                expired.push(item);
            } else if (days <= 7) {
                item.daysRemaining = days;
                urgent.push(item);
            } else if (days <= 30) {
                item.daysRemaining = days;
                upcoming.push(item);
            }
        });
        
        // Sort arrays
        expired.sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date));
        urgent.sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date));
        upcoming.sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date));
        
        // Update Tabs Text with Counts
        document.getElementById('expired-tab').textContent = `Expired (${expired.length})`;
        document.getElementById('urgent-tab').textContent = `Due < 7 Days (${urgent.length})`;
        document.getElementById('upcoming-tab').textContent = `Upcoming (${upcoming.length})`;
        
        // Render Lists
        renderList('expiredContainer', expired, 'danger', 'bi-x-circle-fill', 'Expired');
        renderList('urgentContainer', urgent, 'warning', 'bi-exclamation-triangle-fill', 'Urgent');
        renderList('upcomingContainer', upcoming, 'primary', 'bi-info-circle-fill', 'Upcoming');
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        document.getElementById('expiredContainer').innerHTML = '<div class="text-danger text-center p-4">Failed to load notifications.</div>';
    }
}

function renderList(containerId, items, colorClass, iconClass, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `<div class="text-center p-5 text-muted bg-white rounded shadow-sm">No ${type.toLowerCase()} records found. You're all caught up!</div>`;
        return;
    }
    
    const listDiv = document.createElement('div');
    listDiv.className = 'list-group shadow-sm';
    
    items.forEach(item => {
        let timeMsg = '';
        if (type === 'Expired') {
            timeMsg = `Expired ${item.daysOverdue} days ago on ${formatDateReadable(item.renewal_date)}`;
        } else {
            timeMsg = item.daysRemaining === 0 ? 'Expires TODAY' : `Expires in ${item.daysRemaining} days (On ${formatDateReadable(item.renewal_date)})`;
        }
        
        listDiv.innerHTML += `
            <a href="details.html?id=${item.id}" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                <div class="text-${colorClass} me-3 fs-3">
                    <i class="bi ${iconClass}"></i>
                </div>
                <div class="flex-grow-1">
                    <h5 class="mb-1 fw-bold text-dark">${item.renewal_name}</h5>
                    <p class="mb-1 text-muted">${item.organization} - ${item.renewal_type}</p>
                    <small class="text-${colorClass} fw-bold">${timeMsg}</small>
                </div>
                <div>
                    <span class="btn btn-sm btn-outline-${colorClass}">View</span>
                </div>
            </a>
        `;
    });
    
    container.appendChild(listDiv);
}
