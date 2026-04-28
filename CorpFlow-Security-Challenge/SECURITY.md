# CorpFlow Security Model

## Sensitive Fields

| Table | Field | Classification | Admin | Manager | User |
|---|---|---|---|---|---|
| `users` | `password_hash` | secret | never returned | never returned | never returned |
| `users` | `salary` | sensitive financial | yes | no | no |
| `teams` | `budget` | sensitive financial | yes | no | no |
| `teams` | `bank_account` | critical banking | yes | no | no |
| `billing_records` | `amount` | sensitive financial | yes | no | no |
| `billing_records` | `payment_method` | critical payment | yes | no | no |

## Tenant Isolation Strategy

Every tenant-owned table includes `tenant_id BIGINT NOT NULL` and a direct foreign key to `tenants(id)`.

Cross-table relationships are enforced with composite foreign keys that include `tenant_id`, for example:

- `teams(tenant_id, manager_id) -> users(tenant_id, id)`
- `projects(tenant_id, team_id) -> teams(tenant_id, id)`
- `projects(tenant_id, owner_id) -> users(tenant_id, id)`
- `tasks(tenant_id, project_id) -> projects(tenant_id, id)`
- `tasks(tenant_id, assigned_to) -> users(tenant_id, id)`
- `billing_records(tenant_id, team_id) -> teams(tenant_id, id)`
- `billing_records(tenant_id, user_id) -> users(tenant_id, id)`
- `activity_logs(tenant_id, user_id) -> users(tenant_id, id)`

This means a child row cannot reference a parent row from another tenant, even if a valid numeric `id` exists there.

## How Cross-Tenant Access Is Prevented

Database-level isolation is enforced in three ways:

1. `tenant_id` is required on all tenant-scoped tables.
2. Parent-child links use composite foreign keys that bind both the referenced `id` and the referenced `tenant_id`.
3. Composite indexes beginning with `tenant_id` support the query pattern the API must use: `WHERE tenant_id = ?`.

The API layer should only issue tenant-scoped queries and should only serialize role-filtered DTOs. Even if application code accidentally tries to attach a task, project, billing record, or team manager to another tenant's row, the database rejects the write because the composite foreign key cannot be satisfied.
