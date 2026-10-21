document.addEventListener('DOMContentLoaded', async () => {
    // Check if in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        document.getElementById('formTitle').textContent = 'Edit Renewal';
        document.getElementById('navAddEdit').innerHTML = '<i class="bi bi-pencil"></i> Edit Renewal';
        document.getElementById('cancelBtn').classList.remove('d-none');
        document.getElementById('clearBtn').classList.add('d-none');
        await loadRenewalData(editId);
    }
    
    // Handle form clear
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('renewalForm').reset();
    });

    // Handle form submit
    document.getElementById('renewalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('renewalId').value;
        const isEdit = id !== '';
        
        const data = {
            renewal_name: document.getElementById('renewalName').value,
            renewal_type: document.getElementById('renewalType').value,
            organization: document.getElementById('organization').value,
            document_name: document.getElementById('documentName').value,
            description: document.getElementById('description').value,
            start_date: document.getElementById('startDate').value,
            renewal_date: document.getElementById('renewalDate').value,
            responsible_person: document.getElementById('responsiblePerson').value,
            responsible_email: document.getElementById('responsibleEmail').value,
            status: document.getElementById('status').value,
            reminder_days: document.getElementById('reminderDays').value
        };
        
        try {
            const url = isEdit ? `${API_BASE_URL}/renewals/${id}` : `${API_BASE_URL}/renewals`;
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showAlert(`Renewal ${isEdit ? 'updated' : 'added'} successfully! Redirecting...`, 'success');
                setTimeout(() => {
                    window.location.href = 'records.html';
                }, 1500);
            } else {
                const errorData = await response.json();
                showAlert(errorData.error || 'Failed to save renewal', 'danger');
            }
        } catch (error) {
            console.error('Error saving:', error);
            showAlert('Server connection failed', 'danger');
        }
    });
});

async function loadRenewalData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals/${id}`);
        if (!response.ok) {
            showAlert('Failed to load record details', 'danger');
            return;
        }
        
        const data = await response.json();
        
        document.getElementById('renewalId').value = data.id;
        document.getElementById('renewalName').value = data.renewal_name;
        document.getElementById('renewalType').value = data.renewal_type;
        document.getElementById('organization').value = data.organization;
        document.getElementById('documentName').value = data.document_name || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('startDate').value = formatDateForInput(data.start_date);
        document.getElementById('renewalDate').value = formatDateForInput(data.renewal_date);
        document.getElementById('responsiblePerson').value = data.responsible_person || '';
        document.getElementById('responsibleEmail').value = data.responsible_email || '';
        document.getElementById('status').value = data.status;
        document.getElementById('reminderDays').value = data.reminder_days;
        
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Server connection failed', 'danger');
    }
}

function showAlert(message, type) {
    const container = document.getElementById('formAlert');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto hide success alerts
    if(type === 'success') {
        container.scrollIntoView({behavior: 'smooth'});
    }
}
