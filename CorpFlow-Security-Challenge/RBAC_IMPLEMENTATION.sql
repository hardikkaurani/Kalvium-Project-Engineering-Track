-- ============================================
-- CORPFLOW: RBAC PERMISSIONS SEED
-- Requires SECURE_SCHEMA_PHASE2.sql first
-- ============================================

BEGIN;

INSERT INTO roles (code, description) VALUES
    ('admin', 'Full tenant access, including sensitive financial and HR data'),
    ('manager', 'Team-scoped operational access without salary or banking data'),
    ('user', 'Self-service access limited to own profile and own work items')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (resource_type, field_name, access_level, description) VALUES
    ('users', 'id', 'read', 'Read user identifier'),
    ('users', 'name', 'read', 'Read user name'),
    ('users', 'email', 'read', 'Read user email'),
    ('users', 'role_id', 'read', 'Read user role'),
    ('users', 'status', 'read', 'Read user status'),
    ('users', 'salary', 'read', 'Read user salary'),
    ('teams', 'id', 'read', 'Read team identifier'),
    ('teams', 'name', 'read', 'Read team name'),
    ('teams', 'manager_id', 'read', 'Read team manager'),
    ('teams', 'budget', 'read', 'Read team budget'),
    ('teams', 'bank_account', 'read', 'Read team bank account'),
    ('projects', 'id', 'read', 'Read project identifier'),
    ('projects', 'name', 'read', 'Read project name'),
    ('projects', 'team_id', 'read', 'Read project team'),
    ('projects', 'owner_id', 'read', 'Read project owner'),
    ('projects', 'status', 'read', 'Read project status'),
    ('tasks', 'id', 'read', 'Read task identifier'),
    ('tasks', 'title', 'read', 'Read task title'),
    ('tasks', 'description', 'read', 'Read task description'),
    ('tasks', 'assigned_to', 'read', 'Read task assignee'),
    ('tasks', 'status', 'read', 'Read task status'),
    ('billing_records', 'id', 'read', 'Read billing identifier'),
    ('billing_records', 'team_id', 'read', 'Read billing team'),
    ('billing_records', 'user_id', 'read', 'Read billing user'),
    ('billing_records', 'amount', 'read', 'Read billing amount'),
    ('billing_records', 'payment_method', 'read', 'Read billing payment method'),
    ('billing_records', 'billed_at', 'read', 'Read billing timestamp'),
    ('activity_logs', 'id', 'read', 'Read activity log identifier'),
    ('activity_logs', 'action', 'read', 'Read activity action'),
    ('activity_logs', 'resource_type', 'read', 'Read activity resource type'),
    ('activity_logs', 'resource_id', 'read', 'Read activity resource id')
ON CONFLICT (resource_type, field_name, access_level) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON TRUE
WHERE r.code = 'manager'
  AND (
        (p.resource_type = 'users' AND p.field_name IN ('id', 'name', 'email', 'role_id', 'status'))
     OR (p.resource_type = 'teams' AND p.field_name IN ('id', 'name', 'manager_id'))
     OR (p.resource_type = 'projects')
     OR (p.resource_type = 'tasks')
     OR (p.resource_type = 'billing_records' AND p.field_name IN ('id', 'team_id', 'user_id', 'billed_at'))
     OR (p.resource_type = 'activity_logs' AND p.field_name IN ('id', 'action', 'resource_type', 'resource_id'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON TRUE
WHERE r.code = 'user'
  AND (
        (p.resource_type = 'users' AND p.field_name IN ('id', 'name', 'email'))
     OR (p.resource_type = 'projects' AND p.field_name IN ('id', 'name', 'status'))
     OR (p.resource_type = 'tasks' AND p.field_name IN ('id', 'title', 'description', 'assigned_to', 'status'))
  )
ON CONFLICT DO NOTHING;

COMMIT;
