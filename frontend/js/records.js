let allRecords = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchRecords();
    
    // Set up delete confirmation modal
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.addEventListener('click', async () => {
        const id = confirmDeleteBtn.getAttribute('data-id');
        if (id) {
            await deleteRecord(id);
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    });

    // Set up search and filters
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    
    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('statusFilter').value = '';
        applyFilters();
    });
});

async function fetchRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals`);
        allRecords = await response.json();
        
        // Auto update status based on date for display
        allRecords.forEach(record => {
            if(record.status !== 'Renewed') {
                const days = getDaysRemaining(record.renewal_date);
                if (days < 0 && record.status !== 'Expired') record.status = 'Expired';
                else if (days >= 0 && days <= 30 && record.status !== 'Due Soon' && record.status !== 'Expired') record.status = 'Due Soon';
            }
        });
        
        renderTable(allRecords);
    } catch (error) {
        console.error('Error fetching records:', error);
        document.getElementById('recordsTableBody').innerHTML = '<tr><td colspan="8" class="text-center text-danger">Failed to load records.</td></tr>';
    }
}

function renderTable(data) {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No records found.</td></tr>';
        return;
    }
    
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td class="fw-bold">${item.renewal_name}</td>
            <td>${item.renewal_type}</td>
            <td>${item.organization}</td>
            <td>${formatDateReadable(item.renewal_date)}</td>
            <td>${item.responsible_person || '-'}</td>
            <td>${getStatusBadge(item.status)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <a href="details.html?id=${item.id}" class="btn btn-outline-info" title="View"><i class="bi bi-eye"></i></a>
                    <a href="add-renewal.html?edit=${item.id}" class="btn btn-outline-primary" title="Edit"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-outline-danger" onclick="showDeleteModal(${item.id})" title="Delete"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filtered = allRecords.filter(item => {
        const matchesSearch = item.renewal_name.toLowerCase().includes(searchText) || 
                              item.organization.toLowerCase().includes(searchText);
        const matchesType = typeFilter === '' || item.renewal_type === typeFilter;
        const matchesStatus = statusFilter === '' || item.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    renderTable(filtered);
}

function showDeleteModal(id) {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.setAttribute('data-id', id);
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

async function deleteRecord(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/renewals/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Record deleted successfully', 'success');
            await fetchRecords(); // Reload table
        } else {
            showAlert('Failed to delete record', 'danger');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        showAlert('Server error while deleting', 'danger');
    }
}

function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
