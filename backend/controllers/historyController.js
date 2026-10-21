const db = require('../config/mockDb');

const getRenewalHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = db.renewal_history
            .filter(h => h.renewal_id === parseInt(id))
            .sort((a, b) => new Date(b.action_date) - new Date(a.action_date) || b.id - a.id);
            
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch renewal history' });
    }
};

const addHistoryEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, old_status, new_status, remarks } = req.body;

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        db.renewal_history.push({
            id: db.getNextHistoryId(),
            renewal_id: parseInt(id),
            action,
            old_status,
            new_status,
            action_date: new Date().toISOString().split('T')[0],
            remarks
        });

        res.status(201).json({ message: 'History record added successfully' });
    } catch (error) {
        console.error('Error adding history:', error);
        res.status(500).json({ error: 'Failed to add history record' });
    }
};

module.exports = {
    getRenewalHistory,
    addHistoryEntry
};
