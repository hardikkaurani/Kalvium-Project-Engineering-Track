const ROLE_CODES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

const ALLOWED_TABLES = new Set([
  "users",
  "teams",
  "projects",
  "tasks",
  "billing_records",
  "activity_logs",
]);

const ALLOWED_ORDER_COLUMNS = {
  users: new Set(["id", "created_at", "name", "email"]),
  teams: new Set(["id", "created_at", "name"]),
  projects: new Set(["id", "created_at", "name", "status"]),
  tasks: new Set(["id", "created_at", "title", "status"]),
  billing_records: new Set(["id", "created_at", "billed_at", "status"]),
  activity_logs: new Set(["id", "created_at"]),
};

const RESOURCE_FIELD_ACCESS = {
  users: {
    [ROLE_CODES.ADMIN]: ["id", "name", "email", "role_id", "salary", "status", "created_at"],
    [ROLE_CODES.MANAGER]: ["id", "name", "email", "role_id", "status", "created_at"],
    [ROLE_CODES.USER]: ["id", "name", "email"],
  },
  teams: {
    [ROLE_CODES.ADMIN]: ["id", "name", "manager_id", "budget", "bank_account", "created_at"],
    [ROLE_CODES.MANAGER]: ["id", "name", "manager_id", "created_at"],
    [ROLE_CODES.USER]: [],
  },
  projects: {
    [ROLE_CODES.ADMIN]: ["id", "name", "team_id", "owner_id", "status", "created_at"],
    [ROLE_CODES.MANAGER]: ["id", "name", "team_id", "owner_id", "status", "created_at"],
    [ROLE_CODES.USER]: ["id", "name", "team_id", "owner_id", "status", "created_at"],
  },
  tasks: {
    [ROLE_CODES.ADMIN]: ["id", "project_id", "assigned_to", "title", "description", "status", "created_at"],
    [ROLE_CODES.MANAGER]: ["id", "project_id", "assigned_to", "title", "description", "status", "created_at"],
    [ROLE_CODES.USER]: ["id", "project_id", "assigned_to", "title", "description", "status", "created_at"],
  },
  billing_records: {
    [ROLE_CODES.ADMIN]: ["id", "team_id", "user_id", "amount", "payment_method", "billed_at", "status"],
    [ROLE_CODES.MANAGER]: ["id", "team_id", "user_id", "billed_at", "status"],
    [ROLE_CODES.USER]: [],
  },
  activity_logs: {
    [ROLE_CODES.ADMIN]: ["id", "user_id", "action", "resource_type", "resource_id", "created_at"],
    [ROLE_CODES.MANAGER]: ["id", "user_id", "action", "resource_type", "resource_id", "created_at"],
    [ROLE_CODES.USER]: [],
  },
};

function pickFields(record, allowedFields) {
  return allowedFields.reduce((safeRecord, field) => {
    if (Object.prototype.hasOwnProperty.call(record, field)) {
      safeRecord[field] = record[field];
    }
    return safeRecord;
  }, {});
}

function mapRecord(resource, record, roleCode) {
  const resourceAccess = RESOURCE_FIELD_ACCESS[resource];

  if (!resourceAccess) {
    throw new Error(`Unknown resource: ${resource}`);
  }

  const allowedFields = resourceAccess[roleCode];

  if (!allowedFields) {
    throw new Error(`Unknown role: ${roleCode}`);
  }

  return pickFields(record, allowedFields);
}

function mapCollection(resource, records, roleCode) {
  return records.map((record) => mapRecord(resource, record, roleCode));
}

function buildTenantScopedByIdQuery(tableName) {
  if (!ALLOWED_TABLES.has(tableName)) {
    throw new Error(`Unsupported table: ${tableName}`);
  }
  return `SELECT * FROM ${tableName} WHERE tenant_id = $1 AND id = $2`;
}

function buildTenantScopedListQuery(tableName, orderByColumn = "id") {
  if (!ALLOWED_TABLES.has(tableName)) {
    throw new Error(`Unsupported table: ${tableName}`);
  }

  if (!ALLOWED_ORDER_COLUMNS[tableName].has(orderByColumn)) {
    throw new Error(`Unsupported order column for ${tableName}: ${orderByColumn}`);
  }

  return `SELECT * FROM ${tableName} WHERE tenant_id = $1 ORDER BY ${orderByColumn}`;
}

function canReadSensitiveField(resource, fieldName, roleCode) {
  const allowedFields = RESOURCE_FIELD_ACCESS[resource]?.[roleCode] || [];
  return allowedFields.includes(fieldName);
}

module.exports = {
  ROLE_CODES,
  RESOURCE_FIELD_ACCESS,
  mapRecord,
  mapCollection,
  buildTenantScopedByIdQuery,
  buildTenantScopedListQuery,
  canReadSensitiveField,
};
