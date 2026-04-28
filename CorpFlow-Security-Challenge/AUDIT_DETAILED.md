# CORPFLOW - SECURITY AUDIT (DETAILED)

**Date**: April 28, 2026  
**Status**: 🔴 CRITICAL - Multiple security vulnerabilities  
**Assessment**: NOT PRODUCTION READY

---

## Executive Summary

**8 CRITICAL SECURITY ISSUES FOUND:**

The CorpFlow schema lacks **multi-tenancy, RBAC enforcement, sensitive field protection, and proper indexing.** All issues allow cross-tenant data leaks, privilege escalation, and performance degradation.

---

## Issues Found

### **Issue #1: NO MULTI-TENANT ISOLATION (CRITICAL)**

| Aspect | Details |
|--------|---------|
| **Tables Affected** | ALL: `users`, `teams`, `projects`, `tasks`, `billing_records`, `activity_logs` |
| **Missing** | No `tenant_id` column anywhere |
| **Current Risk** | User from Acme Corp can read User from Widget Inc by guessing ID |
| **Attack** | `SELECT * FROM users;` → Returns users from all companies |
| **Scenario** | User A (tenant_id=1) requests `/api/users` → Also sees users from tenant_id=2,3,4... |
| **Compliance** | ✗ GDPR violation ✗ SOC 2 failure ✗ HIPAA non-compliant |
| **Fix** | Add `tenant_id BIGINT NOT NULL` to ALL tables; create FK to `tenants(id)` |
| **Line Ref** | All `CREATE TABLE` statements |

---

### **Issue #2: EXPOSED SALARY FIELD (CRITICAL)**

| Aspect | Details |
|--------|---------|
| **Table** | `users` |
| **Column** | `salary DECIMAL(10, 2)` |
| **Line** | Line 15 in INSECURE_SCHEMA.sql |
| **Current Exposure** | Any authenticated user can see: `GET /api/users` → `{ ..., "salary": 150000 }` |
| **Who Needs Access** | ✓ Admin: Yes ✗ Manager: No (shouldn't see own team salaries) ✗ User: No |
| **Consequence** | Salary equity disputes, HR violations, competitive intelligence leak |
| **Fix** | Mark as SENSITIVE; implement role-based response filtering; Admin only in API |
| **Impact** | HR/legal liability, employee morale impact |

---

### **Issue #3: EXPOSED BANK ACCOUNT FIELD (CRITICAL)**

| Aspect | Details |
|--------|---------|
| **Table** | `teams` |
| **Column** | `bank_account VARCHAR(50)` |
| **Line** | Line 24 in INSECURE_SCHEMA.sql |
| **Current Data** | Plain text storage of: Account numbers, Routing numbers, IBAN codes |
| **Exposure Risk** | `SELECT bank_account FROM teams;` → All accounts visible |
| **Compliance Violation** | ✗ PCI-DSS (if credit card) ✗ SOC 2 ✗ Banking regulations |
| **Consequence** | Account takeover, fraud, regulatory fines ($1M+), reputational damage |
| **Fix** | NEVER store raw. Tokenize + hash. Access restricted to Finance Admin only. |
| **Recommendation** | Move to secure payment processor (Stripe, Adyen); reference token only |

---

### **Issue #4: EXPOSED BILLING RECORDS (CRITICAL)**

| Aspect | Details |
|--------|---------|
| **Table** | `billing_records` |
| **Columns** | `amount DECIMAL(10, 2)` (Line 53), `payment_method VARCHAR(100)` (Line 54) |
| **Current Exposure** | Any user can see: `SELECT * FROM billing_records;` → Full transaction history |
| **Who Needs Access** | ✓ Admin: Full history ✓ Manager: Only own team ✗ User: None |
| **Data Leak** | Competitor revenue estimation, negotiation leverage loss, pricing leak |
| **Compliance** | ✗ PCI-DSS (if card data) ✗ Financial privacy regulations |
| **Consequence** | Financial data breach, customer churn, regulatory action |
| **Fix** | Add role-based filtering; encrypt payment_method; audit all reads; Admin approval required |

---

### **Issue #5: WEAK ROLE-BASED ACCESS CONTROL (CRITICAL)**

| Aspect | Details |
|--------|---------|
| **Table** | `users` |
| **Column** | `role VARCHAR(50)` (Line 14) |
| **Problem** | No validation; can be any string (`'admin'`, `'ADMIN'`, `'xyz'`, `NULL`, `''`) |
| **Enforcement** | None — database accepts any value on INSERT/UPDATE |
| **Attack Vector** | `UPDATE users SET role='admin' WHERE id=current_user;` → User self-escalates |
| **Current Code Risk** | `if (user.role === 'admin')` → Bypassed by `'Admin'` (case mismatch) |
| **Consequence** | Unauthorized access, privilege escalation, audit trail broken |
| **Fix** | Create `roles` enum table; add FK constraint; enforce in application + DB |
| **Roles Needed** | `admin`, `manager`, `user` (with no free-form string allowed) |

---

### **Issue #6: MISSING FOREIGN KEY CONSTRAINTS (HIGH)**

| Aspect | Details |
|--------|---------|
| **Tables** | All relationship tables |
| **Current** | FKs exist but no ON DELETE CASCADE or ON UPDATE behavior |
| **Orphan Risk** | Delete team → projects remain (orphaned) → queries break |
| **Data Integrity** | `INSERT INTO tasks (project_id) VALUES (999);` → No validation, orphaned task created |
| **Consequence** | Silent data corruption, broken relationships, confusing audit trails |
| **Fix** | Add `ON DELETE CASCADE` for disposable entities; `ON DELETE RESTRICT` for critical ones |
| **Examples** | - `teams.manager_id` FK: ON DELETE SET NULL (manager can leave) - `tasks.project_id` FK: ON DELETE CASCADE (delete project → delete tasks) |

---

### **Issue #7: MISSING INDEXES (HIGH)**

| Aspect | Details |
|--------|---------|
| **Missing Index #1** | `users(email)` → Email lookups full-scan all users |
| **Missing Index #2** | `teams(manager_id)` → "Get all teams managed by X" = O(n) scan |
| **Missing Index #3** | `projects(team_id)` → "List team's projects" = full table scan |
| **Missing Index #4** | `tasks(assigned_to)` → "List my tasks" = full table scan |
| **Missing Index #5** | `tasks(project_id, status)` → Filter tasks by project + status = multiple scans |
| **Scale Impact** | 1K users = 10ms; 1M users = 10s (1000x slowdown) |
| **API SLA** | Dashboard currently loads in 5ms → Will timeout (>30s) at production scale |
| **Fix** | Add all indexes; use composite `(tenant_id, X)` for tenant isolation safety |
| **Estimated Queries** | 30-40 composite indexes needed for full multi-tenant schema |

---

### **Issue #8: NO FIELD-LEVEL ACCESS CONTROL (HIGH)**

| Aspect | Details |
|--------|---------|
| **Layer** | API / Application |
| **Problem** | No response filtering — returns raw DB objects to all users |
| **Current Behavior** | `GET /api/users/1` returns: `{ id, name, email, salary, password_hash, created_at }` to EVERYONE |
| **By Role** | ✓ Admin: Should see all ✗ Manager: Should NOT see salary/password_hash ✗ User: Only name/email |
| **Code** | `res.json(dbUser);` ← No filtering applied |
| **Consequence** | Sensitive fields leak, RBAC unenforceable, regulatory violations |
| **Fix** | Create response DTOs (UserPublicDTO, UserManagerDTO, UserAdminDTO); filter by caller role |
| **Implementation** | API response mapper: checks caller role → returns filtered DTO |

---

## Issue Priority Matrix

```
┌────────────────────────────┬──────────────┬─────────────┬────────────┐
│ Issue                      │ Severity     │ Exploitable │ Fix Time   │
├────────────────────────────┼──────────────┼─────────────┼────────────┤
│ 1. No tenant_id            │ 🔴 CRITICAL  │ Yes (easy)  │ 4-6 hrs    │
│ 2. Salary exposed          │ 🔴 CRITICAL  │ Yes (easy)  │ 1-2 hrs    │
│ 3. Bank data exposed       │ 🔴 CRITICAL  │ Yes (easy)  │ 2-3 hrs    │
│ 4. Billing exposed         │ 🔴 CRITICAL  │ Yes (easy)  │ 2-3 hrs    │
│ 5. Weak RBAC              │ 🔴 CRITICAL  │ Yes (easy)  │ 3-4 hrs    │
│ 6. Missing FKs            │ 🟠 HIGH      │ No (slow)   │ 1-2 hrs    │
│ 7. Missing indexes        │ 🟠 HIGH      │ No (DoS)    │ 1-2 hrs    │
│ 8. No field filters       │ 🟠 HIGH      │ Yes (easy)  │ 2-3 hrs    │
└────────────────────────────┴──────────────┴─────────────┴────────────┘
```

---

## Refactoring Roadmap

### ✅ Phase 1: Schema Analysis (COMPLETE)
- [x] Identified 8 critical issues
- [x] Mapped affected tables
- [x] Assessed compliance impact

### 🔄 Phase 2: Multi-Tenancy Foundation (NEXT)
- [ ] Create `tenants` table
- [ ] Add `tenant_id` to all tables
- [ ] Create composite key `(tenant_id, id)`
- [ ] Add FK constraints

### 📋 Phase 3: RBAC Implementation
- [ ] Create `roles` enum
- [ ] Create `permissions` table
- [ ] Create `role_permissions` matrix
- [ ] Enforce validation

### 🔒 Phase 4: Sensitive Field Protection
- [ ] Mark sensitive columns
- [ ] Create response DTOs
- [ ] Implement API mapper

### ⚡ Phase 5: Performance Hardening
- [ ] Add all missing indexes
- [ ] Add composite indexes
- [ ] Add check constraints

### 📄 Phase 6: Security Documentation
- [ ] SECURITY.md (architecture)
- [ ] MIGRATION.md (zero-downtime)
- [ ] API_SECURITY_LAYER.js (reference)

---

**Recommendation**: Complete all phases before production use. Estimated total time: **10-15 hours** for a production-ready multi-tenant SaaS system.
