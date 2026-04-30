# CorpFlow Security Audit

**Date**: April 28, 2026  
**Scope**: [INSECURE_SCHEMA.sql](/c:/Users/hardi/Kalvium-Project-Engineering-Track/CorpFlow-Security-Challenge/INSECURE_SCHEMA.sql)  
**Status**: Critical remediation required before production use

## Scope And Validation

This audit is based on the SQL schema currently present in the challenge directory. There is no API implementation in this folder yet, so API-layer risks are documented as required follow-up controls rather than verified code defects.

## Executive Summary

The current schema is not safe for a multi-tenant SaaS product. The biggest problems are:

- No tenant boundary exists anywhere in the data model.
- Sensitive financial fields are stored directly on broadly related records.
- Role handling is a free-form string with no enforcement.
- Several nullable foreign keys and missing business constraints allow inconsistent data.
- Lookup and isolation indexes needed for production queries are missing.

In its current form, CorpFlow cannot reliably prevent cross-tenant reads, cannot enforce least privilege, and cannot safely expose raw records through an API.

## Detailed Findings

| Table | Column(s) | Problem | Consequence |
|---|---|---|---|
| `users` | entire table | No `tenant_id` column | Users from different companies live in the same global namespace, so any user lookup by `id` or `email` is inherently cross-tenant unless every query adds extra application logic. |
| `teams` | entire table | No `tenant_id` column | Teams cannot be scoped to an organization, so a team can be read or linked without any tenant boundary. |
| `projects` | entire table | No `tenant_id` column | Projects are globally addressable and cannot be isolated per customer. |
| `tasks` | entire table | No `tenant_id` column | Task access cannot be constrained to a tenant at the row level. |
| `billing_records` | entire table | No `tenant_id` column | Billing data from all tenants is mixed together, creating severe confidentiality risk. |
| `activity_logs` | entire table | No `tenant_id` column | Audit data cannot be partitioned per tenant, making both privacy and incident investigation harder. |
| `users` | `email` | Globally unique without tenant scoping | A shared email namespace prevents common SaaS cases like the same consultant or admin identity existing in more than one tenant, and it encourages cross-tenant identity assumptions. |
| `users` | `role` | Free-form `VARCHAR(50)` with no `NOT NULL`, `CHECK`, enum, or FK | Invalid roles can be stored, role drift is possible, and authorization rules cannot be enforced consistently. |
| `users` | `salary` | Sensitive compensation data stored directly on the base user record | Any API or admin query that returns user rows risks exposing compensation data to managers or peers who should not see it. |
| `users` | `name` | `NOT NULL` but unconstrained business identity | Duplicate names are allowed and there is no tenant-scoped uniqueness or user status model, making authorization and audit trails harder to reason about. |
| `teams` | `manager_id` | Nullable FK without tenant scoping | A team can exist without a manager, or reference a user from another tenant once tenants are introduced unless composite constraints are added. |
| `teams` | `budget` | Sensitive financial field on a generally accessible operational table | Team-level financial planning data can leak through ordinary team endpoints. |
| `teams` | `bank_account` | Highly sensitive banking data stored as plain text on the team record | Unauthorized reads would expose bank details, and the column location makes accidental serialization very likely. |
| `projects` | `team_id` | Nullable FK | A project can exist without a team, which weakens ownership boundaries and complicates tenant enforcement. |
| `projects` | `owner_id` | Nullable FK without tenant alignment rules | A project owner can be absent, and there is no guarantee the owner belongs to the same logical organization as the project. |
| `projects` | `status` | Free-form nullable string | Invalid workflow states can be stored, making both authorization and reporting unreliable. |
| `tasks` | `project_id` | Nullable FK | Orphaned tasks can exist outside a project, which weakens both business integrity and authorization scope. |
| `tasks` | `assigned_to` | Nullable FK without same-tenant or same-project membership enforcement | Tasks can be assigned to unrelated users, enabling cross-tenant confusion and incorrect visibility once APIs are added. |
| `tasks` | `title`, `status` | Nullable business-critical fields | A task can be created without a title or valid state, reducing data quality and making downstream filters unreliable. |
| `billing_records` | `team_id`, `user_id` | Nullable FKs with no same-tenant enforcement | Billing rows can be detached from a team or user, or combine unrelated entities once tenant data is introduced. |
| `billing_records` | `amount` | Sensitive financial field with no access model | Revenue, payroll, or spend data can leak through raw record access. |
| `billing_records` | `payment_method` | Payment-related data stored as plain text | This field may contain card or banking descriptors and should never be broadly readable from raw DB objects. |
| `billing_records` | `date` | Generic column name and no supporting index | Time-based billing queries will degrade and the generic name increases query ambiguity. |
| `activity_logs` | `user_id` | Nullable FK | Audit events can exist without an accountable actor, weakening forensic usefulness. |
| `activity_logs` | `resource_type`, `resource_id` | Polymorphic reference with no integrity enforcement | Logs can point to non-existent resources, and there is no tenant boundary guaranteeing the referenced resource belongs to the same organization. |

## Relationship Integrity Review

The schema does define basic foreign keys, but they are not strong enough for SaaS isolation:

| Relationship | Current State | Gap |
|---|---|---|
| `teams.manager_id -> users.id` | Basic FK exists | Does not guarantee the manager belongs to the same tenant as the team. |
| `projects.team_id -> teams.id` | Basic FK exists | Does not guarantee tenant alignment between project and team. |
| `projects.owner_id -> users.id` | Basic FK exists | Does not guarantee tenant alignment between project and owner. |
| `tasks.project_id -> projects.id` | Basic FK exists | Does not guarantee the task belongs to the same tenant as the project. |
| `tasks.assigned_to -> users.id` | Basic FK exists | Does not guarantee the assignee belongs to the same tenant, project, or team. |
| `billing_records.team_id -> teams.id` | Basic FK exists | Does not guarantee billing row and team share a tenant. |
| `billing_records.user_id -> users.id` | Basic FK exists | Does not guarantee billing row and user share a tenant. |
| `activity_logs.user_id -> users.id` | Basic FK exists | Does not guarantee the logged user and referenced resource share a tenant. |

## Tenant Isolation Risk Analysis

The schema has no durable mechanism to answer core SaaS safety questions:

- Which tenant owns a given `user`, `team`, `project`, `task`, `billing_record`, or `activity_log`?
- Can a `task` be assigned only to users inside the same tenant?
- Can a `project` belong only to a team inside the same tenant?
- Can API queries safely filter by tenant using indexed predicates?

Because the answer is currently "no" across the board, every endpoint would have to reconstruct tenant ownership indirectly in application code. That is fragile and easy to bypass.

## Sensitive Data Inventory

| Table | Column | Sensitivity | Why It Needs Protection |
|---|---|---|---|
| `users` | `password_hash` | Secret credential material | Must never be returned by application responses and should be limited to authentication code paths only. |
| `users` | `salary` | High | Compensation data should be restricted to tenant admins and tightly scoped finance workflows. |
| `teams` | `budget` | High | Internal financial planning data should not be visible to regular users. |
| `teams` | `bank_account` | Critical | Banking details require the strongest field-level restrictions and should not be exposed in general team payloads. |
| `billing_records` | `amount` | High | Billing amounts reveal financial operations and require least-privilege access. |
| `billing_records` | `payment_method` | Critical | Payment-related data must be restricted and sanitized before any API serialization. |

## Missing Constraints

| Table | Column(s) | Missing Constraint | Risk |
|---|---|---|---|
| `users` | `role` | `NOT NULL` plus controlled allowed values | Invalid or missing role assignments break authorization. |
| `teams` | `manager_id` | Business rule or `NOT NULL` if every team must have a manager | Unowned teams weaken accountability. |
| `projects` | `team_id`, `owner_id` | Required ownership rules | Projects can become detached from both team and owner. |
| `projects` | `status` | Controlled allowed values | Unknown states undermine workflow logic. |
| `tasks` | `project_id`, `title`, `status` | Required ownership and state validation | Orphaned or malformed tasks are possible. |
| `billing_records` | `team_id`, `user_id`, `amount` | Required ownership and value validation | Billing rows can be incomplete or inconsistent. |
| `activity_logs` | `user_id`, `action`, `resource_type` | Required accountability fields | Audit records can be too incomplete to trust. |

## Missing Indexes

No explicit secondary indexes are defined beyond implicit indexes created by primary keys and the unique constraint on `users.email`.

The following indexes are missing for both performance and future tenant isolation:

- Tenant-scoped indexes on every tenant-owned table once `tenant_id` is introduced.
- Composite indexes such as `(tenant_id, email)`, `(tenant_id, manager_id)`, `(tenant_id, team_id)`, `(tenant_id, owner_id)`, `(tenant_id, assigned_to)`, `(tenant_id, user_id)`, and `(tenant_id, created_at)` depending on access patterns.
- Operational indexes for common filters like project status, task status, and billing date within a tenant.

Without them, secure tenant-filtered queries will degrade into broader scans as data volume grows.

## API-Layer Security Requirements Derived From The Schema

These items are not yet verifiable from code in this directory, but they are mandatory follow-up requirements:

- Never return raw rows from `users`, `teams`, or `billing_records`.
- Introduce explicit response mappers or DTOs per resource.
- Apply role-based field filtering before serialization.
- Enforce tenant predicates in every query path, not only in route middleware.

## Recommended Next Change

Step 2 should establish the tenant boundary in the schema first:

1. Create a `tenants` table.
2. Add `tenant_id` to every tenant-owned table.
3. Back each relationship with composite keys or equivalent constraints that prove same-tenant integrity.
4. Add tenant-scoped indexes at the same time so secure queries stay fast.
