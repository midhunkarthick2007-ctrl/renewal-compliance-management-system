const bcrypt = require('bcryptjs');

const generateHash = (password) => {
    return bcrypt.hashSync(password, 10);
};

const users = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        password: generateHash('password123'),
        created_at: new Date()
    }
];

let renewals = [
    {
        id: 1,
        renewal_name: 'Software License',
        renewal_type: 'License',
        organization: 'IT Dept',
        description: 'Annual Microsoft Office 365 License',
        start_date: '2025-10-01',
        renewal_date: '2026-10-01',
        responsible_person: 'John Doe',
        responsible_email: 'john@example.com',
        status: 'Active',
        reminder_days: 30,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        renewal_name: 'Insurance Policy',
        renewal_type: 'Insurance',
        organization: 'HR Dept',
        description: 'Health Insurance for Employees',
        start_date: '2026-01-01',
        renewal_date: '2026-12-31',
        responsible_person: 'Jane Smith',
        responsible_email: 'jane@example.com',
        status: 'Active',
        reminder_days: 30,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 3,
        renewal_name: 'Employee Certification',
        renewal_type: 'Certification',
        organization: 'Operations',
        description: 'Safety Training Certification',
        start_date: '2024-05-15',
        renewal_date: '2026-05-15',
        responsible_person: 'Mike Johnson',
        responsible_email: 'mike@example.com',
        status: 'Due Soon',
        reminder_days: 15,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 4,
        renewal_name: 'Company Contract',
        renewal_type: 'Contract',
        organization: 'Legal',
        description: 'Vendor agreement with ABC Corp',
        start_date: '2023-01-01',
        renewal_date: '2026-10-10',
        responsible_person: 'Sarah Lee',
        responsible_email: 'sarah@example.com',
        status: 'Due Soon',
        reminder_days: 60,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 5,
        renewal_name: 'Website SSL Certificate',
        renewal_type: 'Regulatory Permit',
        organization: 'IT Dept',
        description: 'Wildcard SSL for main domain',
        start_date: '2025-11-01',
        renewal_date: '2026-11-01',
        responsible_person: 'John Doe',
        responsible_email: 'john@example.com',
        status: 'Active',
        reminder_days: 14,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 6,
        renewal_name: 'Equipment Warranty',
        renewal_type: 'Warranty',
        organization: 'Facilities',
        description: 'Server hardware warranty',
        start_date: '2021-08-01',
        renewal_date: '2026-08-01',
        responsible_person: 'Tom Wilson',
        responsible_email: 'tom@example.com',
        status: 'Expired',
        reminder_days: 30,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 7,
        renewal_name: 'Annual Subscription',
        renewal_type: 'Subscription',
        organization: 'Marketing',
        description: 'Adobe Creative Cloud',
        start_date: '2025-02-01',
        renewal_date: '2026-02-01',
        responsible_person: 'Emily Davis',
        responsible_email: 'emily@example.com',
        status: 'Renewed',
        reminder_days: 7,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 8,
        renewal_name: 'Government Permit',
        renewal_type: 'Regulatory Permit',
        organization: 'Compliance',
        description: 'Environmental Safety Permit',
        start_date: '2024-03-01',
        renewal_date: '2026-03-01',
        responsible_person: 'Robert Brown',
        responsible_email: 'robert@example.com',
        status: 'Expired',
        reminder_days: 90,
        document_name: '',
        created_at: new Date(),
        updated_at: new Date()
    }
];

let renewal_history = [
    {
        id: 1,
        renewal_id: 7,
        action: 'Renewal Completed',
        old_status: 'Active',
        new_status: 'Renewed',
        action_date: '2026-01-15',
        remarks: 'Payment processed for the new year.'
    }
];

module.exports = {
    users,
    renewals,
    renewal_history,
    getNextRenewalId: () => (renewals.length > 0 ? Math.max(...renewals.map(r => r.id)) + 1 : 1),
    getNextHistoryId: () => (renewal_history.length > 0 ? Math.max(...renewal_history.map(h => h.id)) + 1 : 1)
};
