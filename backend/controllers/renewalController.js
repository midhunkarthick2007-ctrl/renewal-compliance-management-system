const db = require('../config/mockDb');

const getAllRenewals = async (req, res) => {
    try {
        const sorted = [...db.renewals].sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date));
        res.json(sorted);
    } catch (error) {
        console.error('Error fetching renewals:', error);
        res.status(500).json({ error: 'Failed to fetch renewals' });
    }
};

const getRenewalById = async (req, res) => {
    try {
        const { id } = req.params;
        const renewal = db.renewals.find(r => r.id === parseInt(id));
        
        if (!renewal) {
            return res.status(404).json({ error: 'Renewal not found' });
        }
        
        res.json(renewal);
    } catch (error) {
        console.error('Error fetching renewal:', error);
        res.status(500).json({ error: 'Failed to fetch renewal' });
    }
};

const createRenewal = async (req, res) => {
    try {
        const {
            renewal_name, renewal_type, organization, description, 
            start_date, renewal_date, responsible_person, 
            responsible_email, status, reminder_days, document_name
        } = req.body;

        if (!renewal_name || !renewal_type || !organization || !renewal_date) {
            return res.status(400).json({ error: 'Please fill all required fields' });
        }

        const newId = db.getNextRenewalId();
        
        const newRenewal = {
            id: newId,
            renewal_name, renewal_type, organization, description, 
            start_date: start_date || null, renewal_date, responsible_person, 
            responsible_email, status: status || 'Active', 
            reminder_days: reminder_days || 30, document_name,
            created_at: new Date(), updated_at: new Date()
        };

        db.renewals.push(newRenewal);
        
        db.renewal_history.push({
            id: db.getNextHistoryId(),
            renewal_id: newId,
            action: 'Renewal Added',
            old_status: null,
            new_status: status || 'Active',
            action_date: new Date().toISOString().split('T')[0],
            remarks: 'Initial record created'
        });

        res.status(201).json({ 
            message: 'Renewal added successfully', 
            id: newId 
        });
    } catch (error) {
        console.error('Error creating renewal:', error);
        res.status(500).json({ error: 'Failed to create renewal' });
    }
};

const updateRenewal = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            renewal_name, renewal_type, organization, description, 
            start_date, renewal_date, responsible_person, 
            responsible_email, status, reminder_days, document_name
        } = req.body;

        const index = db.renewals.findIndex(r => r.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ error: 'Renewal not found' });
        }

        const oldStatus = db.renewals[index].status;

        db.renewals[index] = {
            ...db.renewals[index],
            renewal_name, renewal_type, organization, description, 
            start_date: start_date || null, renewal_date, responsible_person, 
            responsible_email, status, reminder_days, document_name,
            updated_at: new Date()
        };

        if (oldStatus !== status) {
            db.renewal_history.push({
                id: db.getNextHistoryId(),
                renewal_id: parseInt(id),
                action: 'Status Updated',
                old_status: oldStatus,
                new_status: status,
                action_date: new Date().toISOString().split('T')[0],
                remarks: 'Status changed via update'
            });
        }

        res.json({ message: 'Renewal updated successfully' });
    } catch (error) {
        console.error('Error updating renewal:', error);
        res.status(500).json({ error: 'Failed to update renewal' });
    }
};

const deleteRenewal = async (req, res) => {
    try {
        const { id } = req.params;
        const index = db.renewals.findIndex(r => r.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Renewal not found' });
        }
        
        db.renewals.splice(index, 1);
        // Also remove history
        db.renewal_history = db.renewal_history.filter(h => h.renewal_id !== parseInt(id));
        
        res.json({ message: 'Renewal deleted successfully' });
    } catch (error) {
        console.error('Error deleting renewal:', error);
        res.status(500).json({ error: 'Failed to delete renewal' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0,0,0,0);
        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30);

        const total = db.renewals.length;
        const active = db.renewals.filter(r => r.status === 'Active').length;
        
        const dueSoon = db.renewals.filter(r => {
            if (r.status === 'Due Soon') return true;
            if (r.status === 'Renewed') return false;
            const rd = new Date(r.renewal_date);
            return rd >= today && rd <= next30Days;
        }).length;

        const expired = db.renewals.filter(r => {
            if (r.status === 'Expired') return true;
            if (r.status === 'Renewed') return false;
            const rd = new Date(r.renewal_date);
            return rd < today;
        }).length;
        
        const recent = [...db.renewals]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(r => ({
                id: r.id, 
                renewal_name: r.renewal_name, 
                renewal_type: r.renewal_type, 
                renewal_date: r.renewal_date, 
                status: r.status
            }));

        res.json({
            total,
            active,
            dueSoon,
            expired,
            recent
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

module.exports = {
    getAllRenewals,
    getRenewalById,
    createRenewal,
    updateRenewal,
    deleteRenewal,
    getDashboardStats
};
