document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'records.html';
        return;
    }
    
    // Set edit button link
    document.getElementById('editBtn').addEventListener('click', () => {
        window.location.href = `add-renewal.html?edit=${id}`;
    });

    await loadDetails(id);
    await loadHistory(id);
});

async function loadDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals/${id}`);
        
        if (!response.ok) {
            document.querySelector('.container').innerHTML = '<div class="alert alert-danger mt-4">Record not found or server error.</div>';
            return;
        }
        
        const data = await response.json();
        
        // Auto update status based on date for display
        if(data.status !== 'Renewed') {
            const days = getDaysRemaining(data.renewal_date);
            if (days < 0 && data.status !== 'Expired') data.status = 'Expired';
            else if (days >= 0 && days <= 30 && data.status !== 'Due Soon' && data.status !== 'Expired') data.status = 'Due Soon';
        }
        
        document.getElementById('detName').textContent = data.renewal_name;
        document.getElementById('detStatus').outerHTML = getStatusBadge(data.status);
        document.getElementById('detType').textContent = data.renewal_type;
        document.getElementById('detOrg').textContent = data.organization;
        document.getElementById('detDesc').textContent = data.description || 'No description provided.';
        document.getElementById('detStart').textContent = formatDateReadable(data.start_date);
        document.getElementById('detEnd').textContent = formatDateReadable(data.renewal_date);
        document.getElementById('detPerson').textContent = data.responsible_person || '-';
        document.getElementById('detEmail').textContent = data.responsible_email || '-';
        document.getElementById('detReminder').textContent = `${data.reminder_days} Days before expiry`;
        document.getElementById('detDoc').textContent = data.document_name || 'No document attached';
        
    } catch (error) {
        console.error('Error loading details:', error);
    }
}

async function loadHistory(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals/${id}/history`);
        const history = await response.json();
        
        const list = document.getElementById('historyList');
        list.innerHTML = '';
        
        if (history.length === 0) {
            list.innerHTML = '<li class="list-group-item text-center text-muted py-4">No history records found.</li>';
            return;
        }
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item history-item';
            
            let statusChange = '';
            if (item.old_status && item.new_status && item.old_status !== item.new_status) {
                statusChange = ` (Status: ${item.old_status} &rarr; ${item.new_status})`;
            } else if (item.new_status) {
                statusChange = ` (Status: ${item.new_status})`;
            }
            
            li.innerHTML = `
                <div class="history-date">${formatDateReadable(item.action_date)}</div>
                <div class="history-action">${item.action} <span class="fw-normal text-muted" style="font-size: 0.85rem">${statusChange}</span></div>
                <div class="history-remarks">${item.remarks || ''}</div>
            `;
            list.appendChild(li);
        });
        
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('historyList').innerHTML = '<li class="list-group-item text-danger">Failed to load history</li>';
    }
}
