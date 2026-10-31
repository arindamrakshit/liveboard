-- V2: Seed demo data for development

-- Demo users (passwords are BCrypt hashed: "password123")
INSERT INTO users (email, username, password_hash, full_name, avatar_url, bio) VALUES
('alice@liveboard.dev', 'alice', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh4m', 'Alice Johnson', NULL, 'Product Designer & Frontend Dev'),
('bob@liveboard.dev', 'bob', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh4m', 'Bob Chen', NULL, 'Full Stack Engineer'),
('carol@liveboard.dev', 'carol', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh4m', 'Carol Martinez', NULL, 'Backend Engineer'),
('dave@liveboard.dev', 'dave', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh4m', 'Dave Wilson', NULL, 'DevOps Engineer');

-- Demo project (owned by Alice)
INSERT INTO projects (name, description, color, icon, owner_id) VALUES
('LiveBoard Launch', 'Building the LiveBoard SaaS platform — Q4 launch goals.', '#3B82F6', '🚀', 1),
('Design System', 'Unified component library and design tokens.', '#8B5CF6', '🎨', 1);

-- Project members
INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'OWNER'), (1, 2, 'ADMIN'), (1, 3, 'MEMBER'), (1, 4, 'MEMBER'),
(2, 1, 'OWNER'), (2, 2, 'MEMBER');

-- Columns for project 1
INSERT INTO task_columns (project_id, name, position, color) VALUES
(1, 'To Do', 1000, '#64748B'),
(1, 'In Progress', 2000, '#3B82F6'),
(1, 'In Review', 3000, '#F59E0B'),
(1, 'Done', 4000, '#10B981');

-- Columns for project 2
INSERT INTO task_columns (project_id, name, position, color) VALUES
(2, 'Backlog', 1000, '#64748B'),
(2, 'Active', 2000, '#3B82F6'),
(2, 'Done', 3000, '#10B981');

-- Tasks for project 1, column 1 (To Do)
INSERT INTO tasks (column_id, project_id, title, description, priority, status, position, assignee_id, reporter_id, due_date) VALUES
(1, 1, 'Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment to staging and production.', 'HIGH', 'TODO', 1000, 4, 1, '2026-11-15'),
(1, 1, 'Write onboarding documentation', 'Create getting started guide for new team members covering setup, workflows, and conventions.', 'MEDIUM', 'TODO', 2000, 2, 1, '2026-11-20'),
(1, 1, 'Implement email notifications', 'Add transactional emails for task assignments, due date reminders, and project invites.', 'MEDIUM', 'TODO', 3000, 3, 1, '2026-11-30');

-- Tasks for project 1, column 2 (In Progress)
INSERT INTO tasks (column_id, project_id, title, description, priority, status, position, assignee_id, reporter_id, due_date) VALUES
(2, 1, 'Build Kanban board UI', 'Implement drag-and-drop Kanban board with real-time updates using WebSockets.', 'URGENT', 'IN_PROGRESS', 1000, 1, 1, '2026-11-05'),
(2, 1, 'Design REST API endpoints', 'Define and document all REST API endpoints for tasks, projects, and users.', 'HIGH', 'IN_PROGRESS', 2000, 2, 1, '2026-11-08'),
(2, 1, 'Database schema design', 'Finalize the MySQL schema with proper indexes and foreign key constraints.', 'HIGH', 'IN_PROGRESS', 3000, 3, 1, '2026-11-06');

-- Tasks for project 1, column 3 (In Review)
INSERT INTO tasks (column_id, project_id, title, description, priority, status, position, assignee_id, reporter_id, due_date) VALUES
(3, 1, 'Authentication system', 'JWT-based auth with refresh tokens, role-based access control, and secure password handling.', 'URGENT', 'IN_PROGRESS', 1000, 2, 1, '2026-11-03'),
(3, 1, 'User profile page', 'Profile settings, avatar upload, timezone preferences, and notification settings.', 'MEDIUM', 'IN_PROGRESS', 2000, 1, 1, '2026-11-10');

-- Tasks for project 1, column 4 (Done)
INSERT INTO tasks (column_id, project_id, title, description, priority, status, position, assignee_id, reporter_id, due_date) VALUES
(4, 1, 'Project planning and roadmap', 'Define Q4 milestones, assign DRIs, and set up project tracking.', 'HIGH', 'DONE', 1000, 1, 1, '2026-10-15'),
(4, 1, 'Tech stack selection', 'Evaluate and decide on frontend/backend tech stack. Document decision rationale.', 'MEDIUM', 'DONE', 2000, 2, 1, '2026-10-20'),
(4, 1, 'Design system foundations', 'Define color palette, typography scale, spacing system, and core components.', 'HIGH', 'DONE', 3000, 1, 1, '2026-10-25');

-- Labels
INSERT INTO task_labels (task_id, name, color) VALUES
(4, 'frontend', '#3B82F6'), (4, 'real-time', '#8B5CF6'),
(5, 'backend', '#10B981'), (5, 'api', '#F59E0B'),
(6, 'backend', '#10B981'), (6, 'database', '#EF4444'),
(7, 'security', '#EF4444'), (7, 'backend', '#10B981'),
(10, 'planning', '#64748B'),
(11, 'design', '#8B5CF6'), (11, 'frontend', '#3B82F6');

-- Comments
INSERT INTO task_comments (task_id, author_id, content) VALUES
(4, 2, 'I have the STOMP WebSocket setup working locally. Will push a draft PR today.'),
(4, 1, 'Great! Please include reconnection logic and the presence tracking feature.'),
(5, 3, 'OpenAPI spec is ready for review in Notion. Check the shared doc.'),
(7, 4, 'Code review done. Left 3 comments about token rotation. LGTM otherwise.');
