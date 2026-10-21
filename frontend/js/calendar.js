let currentDate = new Date();
let renewalsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    await fetchRenewalsForCalendar();
    renderCalendar();
});

async function fetchRenewalsForCalendar() {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals`);
        renewalsData = await response.json();
    } catch (error) {
        console.error('Error fetching data for calendar:', error);
    }
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Set Header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('monthYearDisplay').textContent = `${monthNames[month]} ${year}`;
    
    const grid = document.getElementById('calendarGrid');
    
    // Clear previous cells (keep headers)
    const cells = grid.querySelectorAll('.calendar-day');
    cells.forEach(cell => cell.remove());
    
    // Calculate days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day empty';
        grid.appendChild(div);
    }
    
    // Add cells for days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        if (isCurrentMonth && i === today.getDate()) {
            div.classList.add('today');
        }
        
        div.innerHTML = `<span class="day-number">${i}</span>`;
        
        // Find events for this day
        const currentCellDate = new Date(year, month, i);
        // Normalize time for comparison
        currentCellDate.setHours(0,0,0,0);
        
        const dayEvents = renewalsData.filter(item => {
            const rDate = new Date(item.renewal_date);
            rDate.setHours(0,0,0,0);
            return rDate.getTime() === currentCellDate.getTime();
        });
        
        // Add event tags
        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            
            // Determine color based on status and days remaining
            let bgClass = 'bg-primary'; // default
            if (event.status === 'Renewed') {
                bgClass = 'bg-info';
            } else {
                const days = getDaysRemaining(event.renewal_date);
                if (days < 0 || event.status === 'Expired') bgClass = 'bg-danger';
                else if (days <= 30 || event.status === 'Due Soon') bgClass = 'bg-warning text-dark';
                else bgClass = 'bg-success';
            }
            
            eventDiv.className = `renewal-event ${bgClass}`;
            eventDiv.textContent = event.renewal_name;
            eventDiv.title = `${event.renewal_name} (${event.renewal_type})`;
            eventDiv.onclick = () => window.location.href = `details.html?id=${event.id}`;
            
            div.appendChild(eventDiv);
        });
        
        grid.appendChild(div);
    }
}
