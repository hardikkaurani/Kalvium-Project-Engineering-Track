# CorpFlow Security Challenge

This submission refactors the insecure CorpFlow schema into a tenant-safe PostgreSQL design with schema-enforced tenant isolation, RBAC metadata, sensitive-field access rules, and tenant-first indexes.

## Deliverables

- [INSECURE_SCHEMA.sql](./INSECURE_SCHEMA.sql)
- [AUDIT.md](./AUDIT.md)
- [SECURE_SCHEMA_PHASE2.sql](./SECURE_SCHEMA_PHASE2.sql)
- [RBAC_IMPLEMENTATION.sql](./RBAC_IMPLEMENTATION.sql)
- [API_SECURITY_LAYER.js](./API_SECURITY_LAYER.js)
- [SECURITY.md](./SECURITY.md)

## What Changed

1. `AUDIT.md` documents exact schema flaws and consequences.
2. `SECURE_SCHEMA_PHASE2.sql` introduces:
   - `tenants`
   - `tenant_id` on every tenant-owned table
   - composite foreign keys for same-tenant integrity
   - stricter `NOT NULL`, `CHECK`, and tenant-scoped `UNIQUE` constraints
   - tenant-first composite indexes
3. `RBAC_IMPLEMENTATION.sql` seeds the fixed role set and field-level permission matrix.
4. `API_SECURITY_LAYER.js` maps raw rows into safe response objects by role and assumes all reads are tenant-scoped.
5. `SECURITY.md` explains sensitive data handling and how cross-tenant access is blocked.

## Notes

- The database fix is PostgreSQL-oriented and avoids invalid inline index syntax.
- Same-tenant integrity is enforced at the schema level with composite foreign keys instead of application-only checks.
- API behavior is preserved at the resource level, but sensitive fields are intentionally filtered based on role.
