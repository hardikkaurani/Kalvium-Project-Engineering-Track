// ============================================
// CORPFLOW: API SECURITY LAYER - Phase 3
// ============================================
// This reference implementation shows how to:
// 1. Enforce tenant isolation in queries
// 2. Filter response fields based on caller's role
// 3. Prevent sensitive data leaks in API responses

// ============================================
// 1. DATABASE LAYER - Tenant-Safe Queries
// ============================================

// UNSAFE (Old approach - allows cross-tenant read):
// const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// SAFE (New approach - enforces tenant isolation):
async function getUserById(tenantId, userId, callerRole) {
    // Query includes tenant_id in WHERE clause
    const result = await db.query(
        `SELECT id, tenant_id, email, name, role_id, salary, status, created_at
         FROM users 
         WHERE id = $1 AND tenant_id = $2`,
        [userId, tenantId]
    );
    
    if (!result.rows.length) {
        throw new Error('User not found or not in this tenant');
    }
    
    const user = result.rows[0];
    
    // Apply role-based field filtering
    return filterUserResponse(user, callerRole);
}

// ============================================
// 2. RESPONSE FILTERING - DTOs by Role
// ============================================

// Response DTOs (Data Transfer Objects) - one per role
class UserResponseDTO {
    // Admin DTO: Can see everything except password_hash
    static adminView(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            salary: user.salary,           // ← Admin CAN see salary
            status: user.status,
            created_at: user.created_at
        };
    }
    
    // Manager DTO: Can see name, email, role; NOT salary or sensitive fields
    static managerView(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            // salary: HIDDEN
            // password_hash: HIDDEN
            status: user.status,
            created_at: user.created_at
        };
    }
    
    // User (regular) DTO: Can only see basic info
    static userView(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email
            // salary: HIDDEN
            // role_id: HIDDEN
            // password_hash: HIDDEN
        };
    }
}

// Filter function: Map role to DTO
function filterUserResponse(user, callerRole) {
    switch (callerRole) {
        case 'admin':
            return UserResponseDTO.adminView(user);
        case 'manager':
            return UserResponseDTO.managerView(user);
        case 'user':
            return UserResponseDTO.userView(user);
        default:
            throw new Error('Invalid role');
    }
}

// ============================================
// 3. BILLING RECORDS - Sensitive Field Protection
// ============================================

async function getBillingRecords(tenantId, callerRole) {
    // Base query: Always filter by tenant_id
    const result = await db.query(
        `SELECT id, tenant_id, team_id, user_id, amount, payment_method, 
                payment_method_token, date, status, created_at
         FROM billing_records
         WHERE tenant_id = $1
         ORDER BY date DESC`,
        [tenantId]
    );
    
    // Apply role-based filtering
    return result.rows.map(record => filterBillingResponse(record, callerRole));
}

function filterBillingResponse(record, callerRole) {
    const filtered = {
        id: record.id,
        team_id: record.team_id,
        user_id: record.user_id,
        date: record.date,
        status: record.status
    };
    
    // Only admin can see financial data
    if (callerRole === 'admin') {
        filtered.amount = record.amount;
        filtered.payment_method_token = record.payment_method_token; // Token only, never raw method
    } else if (callerRole === 'manager') {
        // Manager can see amount but not payment method
        filtered.amount = record.amount;
        // payment_method: HIDDEN
    } else {
        // Regular user sees nothing sensitive
        // amount: HIDDEN
        // payment_method: HIDDEN
    }
    
    return filtered;
}

// ============================================
// 4. TEAMS - Banking Data Protection
// ============================================

async function getTeam(tenantId, teamId, callerRole) {
    const result = await db.query(
        `SELECT id, tenant_id, name, manager_id, budget, bank_account_token, status
         FROM teams
         WHERE id = $1 AND tenant_id = $2`,
        [teamId, tenantId]
    );
    
    if (!result.rows.length) {
        throw new Error('Team not found');
    }
    
    return filterTeamResponse(result.rows[0], callerRole);
}

function filterTeamResponse(team, callerRole) {
    const filtered = {
        id: team.id,
        name: team.name,
        manager_id: team.manager_id,
        status: team.status
    };
    
    // Only admins see budget and banking info (and only token, never raw account)
    if (callerRole === 'admin') {
        filtered.budget = team.budget;
        filtered.bank_account_token = team.bank_account_token; // Token only!
    }
    // manager, user: NO BUDGET, NO BANKING INFO
    
    return filtered;
}

// ============================================
// 5. MIDDLEWARE - Enforce Tenant Isolation
// ============================================

// Express middleware to extract tenant and user info from JWT
async function authenticateAndEnrichRequest(req, res, next) {
    try {
        // 1. Extract JWT token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Missing token' });
        }
        
        // 2. Verify JWT and extract claims
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Get user from DB (ensures user still exists and is active)
        const userResult = await db.query(
            `SELECT id, tenant_id, role_id, email 
             FROM users 
             WHERE id = $1 AND status = 'active'`,
            [decoded.userId]
        );
        
        if (!userResult.rows.length) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }
        
        const user = userResult.rows[0];
        
        // 4. Get role name
        const roleResult = await db.query(
            `SELECT name FROM roles WHERE id = $1`,
            [user.role_id]
        );
        
        const roleName = roleResult.rows[0].name;
        
        // 5. Attach to request context
        req.context = {
            userId: user.id,
            tenantId: user.tenant_id,
            email: user.email,
            role: roleName
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ============================================
// 6. ROUTE HANDLERS - Using Tenant Context
// ============================================

// GET /api/users/:id - Protected endpoint
app.get('/api/users/:id', authenticateAndEnrichRequest, async (req, res) => {
    try {
        const { tenantId, role } = req.context;
        const { id } = req.params;
        
        // Get user with tenant isolation
        const user = await getUserById(tenantId, parseInt(id), role);
        
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// GET /api/teams - List teams in current tenant
app.get('/api/teams', authenticateAndEnrichRequest, async (req, res) => {
    try {
        const { tenantId, role } = req.context;
        
        // Query includes tenant_id
        const result = await db.query(
            `SELECT id, tenant_id, name, manager_id, budget, bank_account_token, status
             FROM teams
             WHERE tenant_id = $1
             ORDER BY name`,
            [tenantId]
        );
        
        // Filter each team's response
        const teams = result.rows.map(team => filterTeamResponse(team, role));
        
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/billing - List billing records (admin/manager only)
app.get('/api/billing', authenticateAndEnrichRequest, async (req, res) => {
    try {
        const { tenantId, role } = req.context;
        
        // Restrict access by role
        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        const records = await getBillingRecords(tenantId, role);
        
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 7. AUDIT LOGGING - Track Sensitive Access
// ============================================

// Log whenever sensitive data is accessed
async function auditLog(tenantId, userId, action, resourceType, resourceId) {
    await db.query(
        `INSERT INTO activity_logs 
         (tenant_id, user_id, action, resource_type, resource_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [tenantId, userId, action, resourceType, resourceId]
    );
}

// Example: Log when admin accesses salary data
app.get('/api/users/:id/salary', authenticateAndEnrichRequest, async (req, res) => {
    const { tenantId, userId, role } = req.context;
    const { id } = req.params;
    
    // Only admin can access
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Audit this access
    await auditLog(tenantId, userId, 'view_salary', 'users', parseInt(id));
    
    // Return salary
    const result = await db.query(
        `SELECT id, salary FROM users WHERE id = $1 AND tenant_id = $2`,
        [id, tenantId]
    );
    
    res.json(result.rows[0]);
});

// ============================================
// 8. KEY PRINCIPLES
// ============================================
/*
✅ PRINCIPLE 1: Tenant Isolation in Every Query
   - NEVER query without WHERE tenant_id = $X
   - ALWAYS attach tenant_id from authenticated user context
   - Use composite indexes (tenant_id, X) for performance

✅ PRINCIPLE 2: Response Filtering by Role
   - Define DTOs for each role
   - Map database rows to DTOs before returning
   - NEVER return raw database objects

✅ PRINCIPLE 3: Sensitive Field Redaction
   - Mark which fields are sensitive (salary, bank_account, etc.)
   - Define which roles can see each field
   - Use database tokens (not raw values) for banking/payment info

✅ PRINCIPLE 4: Audit Everything
   - Log access to sensitive fields
   - Include user, role, timestamp, resource
   - Review logs regularly for suspicious access

✅ PRINCIPLE 5: Enforce at Multiple Layers
   - Database: Constraints, FKs, CHECK clauses
   - Query: WHERE clauses with tenant_id
   - API: Role-based filtering
   - Application: Defense in depth

✅ PRINCIPLE 6: Fail Secure
   - Default to hiding data
   - Require explicit permission to show
   - Deny by default, allow specific cases
*/

// ============================================
// EXPORT
// ============================================
module.exports = {
    getUserById,
    getTeam,
    getBillingRecords,
    filterUserResponse,
    filterTeamResponse,
    filterBillingResponse,
    authenticateAndEnrichRequest,
    auditLog
};
