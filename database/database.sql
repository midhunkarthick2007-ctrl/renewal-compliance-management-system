CREATE DATABASE IF NOT EXISTS renewal_db;
USE renewal_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS renewals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    renewal_name VARCHAR(255) NOT NULL,
    renewal_type VARCHAR(100) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    renewal_date DATE NOT NULL,
    responsible_person VARCHAR(100),
    responsible_email VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    reminder_days INT DEFAULT 30,
    document_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS renewal_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    renewal_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    action_date DATE,
    remarks TEXT,
    FOREIGN KEY (renewal_id) REFERENCES renewals(id) ON DELETE CASCADE
);

-- Insert demo user: admin@example.com / password123
INSERT INTO users (name, email, password) VALUES 
('Admin', 'admin@example.com', '$2b$10$x8sZ.5r.yGf.3M.eG2.2t.Z6wQnB0f1T9.X9n/G0l/x0G8/c9.w9O');

-- Insert sample renewals
INSERT INTO renewals (renewal_name, renewal_type, organization, description, start_date, renewal_date, responsible_person, responsible_email, status, reminder_days) VALUES 
('Software License', 'License', 'IT Dept', 'Annual Microsoft Office 365 License', '2025-10-01', '2026-10-01', 'John Doe', 'john@example.com', 'Active', 30),
('Insurance Policy', 'Insurance', 'HR Dept', 'Health Insurance for Employees', '2026-01-01', '2026-12-31', 'Jane Smith', 'jane@example.com', 'Active', 30),
('Employee Certification', 'Certification', 'Operations', 'Safety Training Certification', '2024-05-15', '2026-05-15', 'Mike Johnson', 'mike@example.com', 'Due Soon', 15),
('Company Contract', 'Contract', 'Legal', 'Vendor agreement with ABC Corp', '2023-01-01', '2026-10-10', 'Sarah Lee', 'sarah@example.com', 'Due Soon', 60),
('Website SSL Certificate', 'Regulatory Permit', 'IT Dept', 'Wildcard SSL for main domain', '2025-11-01', '2026-11-01', 'John Doe', 'john@example.com', 'Active', 14),
('Equipment Warranty', 'Warranty', 'Facilities', 'Server hardware warranty', '2021-08-01', '2026-08-01', 'Tom Wilson', 'tom@example.com', 'Expired', 30),
('Annual Subscription', 'Subscription', 'Marketing', 'Adobe Creative Cloud', '2025-02-01', '2026-02-01', 'Emily Davis', 'emily@example.com', 'Renewed', 7),
('Government Permit', 'Regulatory Permit', 'Compliance', 'Environmental Safety Permit', '2024-03-01', '2026-03-01', 'Robert Brown', 'robert@example.com', 'Expired', 90);

-- Insert sample history
INSERT INTO renewal_history (renewal_id, action, old_status, new_status, action_date, remarks) VALUES
(7, 'Renewal Completed', 'Active', 'Renewed', '2026-01-15', 'Payment processed for the new year.');
