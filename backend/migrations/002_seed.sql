-- Seed data for testing
-- Password: password123 (hashed with bcrypt)

INSERT INTO users (name, email, password, phone, department, designation, role) VALUES
('John Employee', 'employee@example.com', '$2a$10$Uc4M9cgB/MNUDYHn614IMeooXH2WIM16NKvw9CioDPwXSZIltVVpW', '9876543210', 'Engineering', 'Software Engineer', 'employee'),
('Jane Manager', 'manager@example.com', '$2a$10$Uc4M9cgB/MNUDYHn614IMeooXH2WIM16NKvw9CioDPwXSZIltVVpW', '9876543211', 'Engineering', 'Engineering Manager', 'manager'),
('Mike Employee', 'mike@example.com', '$2a$10$Uc4M9cgB/MNUDYHn614IMeooXH2WIM16NKvw9CioDPwXSZIltVVpW', '9876543212', 'Sales', 'Sales Executive', 'employee'),
('Sarah Employee', 'sarah@example.com', '$2a$10$Uc4M9cgB/MNUDYHn614IMeooXH2WIM16NKvw9CioDPwXSZIltVVpW', '9876543213', 'HR', 'HR Specialist', 'employee')
ON CONFLICT (email) DO NOTHING;

INSERT INTO leave_balance (user_id, total, used, remaining) VALUES
(1, 14, 2, 12),
(2, 16, 1, 15),
(3, 14, 0, 14),
(4, 14, 5, 9)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO leave_requests (user_id, start_date, end_date, type, reason, status, approved_by) VALUES
(1, '2024-03-20', '2024-03-22', 'casual', 'Personal work', 'approved', 2),
(1, '2024-04-10', '2024-04-15', 'annual', 'Vacation', 'pending', NULL),
(3, '2024-03-25', '2024-03-25', 'sick', 'Fever', 'approved', 2),
(4, '2024-03-18', '2024-03-20', 'annual', 'Family visit', 'rejected', 2)
ON CONFLICT DO NOTHING;
