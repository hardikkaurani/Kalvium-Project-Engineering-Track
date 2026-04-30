-- ============================================
-- CORPFLOW: SECURE MULTI-TENANT SCHEMA
-- PostgreSQL-compatible refactor
-- ============================================

BEGIN;

CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenants_name UNIQUE (name),
    CONSTRAINT uq_tenants_slug UNIQUE (slug),
    CONSTRAINT chk_tenants_status CHECK (status IN ('active', 'suspended', 'deleted'))
);

CREATE TABLE roles (
    id SMALLSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT uq_roles_code UNIQUE (code),
    CONSTRAINT chk_roles_code CHECK (code IN ('admin', 'manager', 'user'))
);

CREATE TABLE permissions (
    id SMALLSERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    access_level VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT uq_permissions_resource_field_access UNIQUE (resource_type, field_name, access_level),
    CONSTRAINT chk_permissions_access_level CHECK (access_level IN ('read', 'write'))
);

CREATE TABLE role_permissions (
    role_id SMALLINT NOT NULL,
    permission_id SMALLINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    role_id SMALLINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salary DECIMAL(12, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_users_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email),
    CONSTRAINT chk_users_status CHECK (status IN ('active', 'inactive', 'deleted')),
    CONSTRAINT chk_users_salary_non_negative CHECK (salary IS NULL OR salary >= 0)
);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    manager_id BIGINT,
    budget DECIMAL(12, 2),
    bank_account VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_teams_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_teams_manager_same_tenant
        FOREIGN KEY (tenant_id, manager_id)
        REFERENCES users(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_teams_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_teams_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT chk_teams_budget_non_negative CHECK (budget IS NULL OR budget >= 0)
);

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_projects_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_projects_team_same_tenant
        FOREIGN KEY (tenant_id, team_id)
        REFERENCES teams(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_projects_owner_same_tenant
        FOREIGN KEY (tenant_id, owner_id)
        REFERENCES users(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_projects_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_projects_tenant_team_name UNIQUE (tenant_id, team_id, name),
    CONSTRAINT chk_projects_status CHECK (status IN ('active', 'paused', 'completed', 'archived'))
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    assigned_to BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tasks_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_tasks_project_same_tenant
        FOREIGN KEY (tenant_id, project_id)
        REFERENCES projects(tenant_id, id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assignee_same_tenant
        FOREIGN KEY (tenant_id, assigned_to)
        REFERENCES users(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_tasks_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT chk_tasks_status CHECK (status IN ('todo', 'in_progress', 'done', 'blocked'))
);

CREATE TABLE billing_records (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(100),
    billed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_billing_records_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_billing_records_team_same_tenant
        FOREIGN KEY (tenant_id, team_id)
        REFERENCES teams(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_billing_records_user_same_tenant
        FOREIGN KEY (tenant_id, user_id)
        REFERENCES users(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_billing_records_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT chk_billing_records_amount_positive CHECK (amount >= 0),
    CONSTRAINT chk_billing_records_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_activity_logs_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_activity_logs_user_same_tenant
        FOREIGN KEY (tenant_id, user_id)
        REFERENCES users(tenant_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_activity_logs_tenant_id UNIQUE (tenant_id, id)
);

CREATE INDEX idx_users_tenant_created_at ON users (tenant_id, created_at DESC);
CREATE INDEX idx_users_tenant_role_id ON users (tenant_id, role_id);
CREATE INDEX idx_teams_tenant_manager_id ON teams (tenant_id, manager_id);
CREATE INDEX idx_projects_tenant_team_id ON projects (tenant_id, team_id);
CREATE INDEX idx_projects_tenant_owner_id ON projects (tenant_id, owner_id);
CREATE INDEX idx_projects_tenant_status ON projects (tenant_id, status);
CREATE INDEX idx_tasks_tenant_project_id ON tasks (tenant_id, project_id);
CREATE INDEX idx_tasks_tenant_assigned_to ON tasks (tenant_id, assigned_to);
CREATE INDEX idx_tasks_tenant_status ON tasks (tenant_id, status);
CREATE INDEX idx_billing_records_tenant_team_id ON billing_records (tenant_id, team_id);
CREATE INDEX idx_billing_records_tenant_user_id ON billing_records (tenant_id, user_id);
CREATE INDEX idx_billing_records_tenant_billed_at ON billing_records (tenant_id, billed_at DESC);
CREATE INDEX idx_activity_logs_tenant_user_id ON activity_logs (tenant_id, user_id);
CREATE INDEX idx_activity_logs_tenant_created_at ON activity_logs (tenant_id, created_at DESC);

COMMIT;
