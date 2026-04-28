-- ============================================
-- CORPFLOW: INSECURE INITIAL SCHEMA
-- ============================================
-- This is the UNSAFE production schema that needs refactoring
-- Issues: No tenant isolation, no RBAC, exposed sensitive data
-- DO NOT USE IN PRODUCTION - Educational purposes only

-- Current insecure structure (NO multi-tenancy)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- 'admin', 'manager', 'user' (WEAK - no enforcement)
    salary DECIMAL(10, 2), -- EXPOSED SENSITIVE DATA
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id INT,
    budget DECIMAL(10, 2), -- EXPOSED
    bank_account VARCHAR(50), -- EXTREMELY SENSITIVE - EXPOSED
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team_id INT,
    owner_id INT,
    status VARCHAR(50),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INT,
    assigned_to INT,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE billing_records (
    id SERIAL PRIMARY KEY,
    team_id INT,
    user_id INT,
    amount DECIMAL(10, 2), -- SENSITIVE
    payment_method VARCHAR(100), -- CARD DETAILS? EXPOSED
    date TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- PROBLEMS IN THIS SCHEMA:
-- ============================================
-- 1. NO TENANT ISOLATION - All data mixed together
-- 2. NO FOREIGN KEY CONSTRAINTS - Data integrity issues
-- 3. ROLE COLUMN - Just a string, no enforcement
-- 4. EXPOSED FIELDS - salary, bank_account, payment_method visible to all
-- 5. NO INDEXES - Performance issues on lookups
-- 6. NO RBAC - No way to restrict field access by role
-- 7. CROSS-TENANT RISK - User A can access User B's data if IDs are guessed
