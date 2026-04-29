const prisma = require("../lib/prisma");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const ALLOWED_SORT_FIELDS = new Set(["id", "name", "sku", "price", "stock", "createdAt", "updatedAt"]);
const ALLOWED_FIELD_SELECTION = new Set(["id", "name", "sku", "price", "stock", "createdAt", "updatedAt"]);

function parseProductId(rawId) {
  return Number.parseInt(rawId, 10);
}

function buildQueryParameterError(res) {
  return res.status(400).json({ error: "Invalid query parameter" });
}

function validateProductId(productId, res) {
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ error: "Invalid product id" });
    return false;
  }

  return true;
}

function normalizeProductPayload(body) {
  const payload = {
    name: body.name,
    sku: body.sku,
    price: body.price,
  };

  if (body.stock !== undefined) {
    payload.stock = body.stock;
  }

  return payload;
}

function validateProductPayload(body, res, { allowPartial = false } = {}) {
  const requiredFields = ["name", "sku", "price"];

  if (!allowPartial) {
    const missingField = requiredFields.find((field) => body[field] === undefined || body[field] === null);

    if (missingField) {
      res.status(400).json({ error: `${missingField} is required` });
      return false;
    }
  }

  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) {
    res.status(400).json({ error: "stock must be a non-negative integer" });
    return false;
  }

  return true;
}

function parsePositiveInteger(rawValue, fallbackValue) {
  if (rawValue === undefined) {
    return fallbackValue;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  return parsedValue;
}

function parseFields(rawFields) {
  if (!rawFields) {
    return null;
  }

  const requestedFields = rawFields
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  if (requestedFields.length === 0) {
    return null;
  }

  const hasInvalidField = requestedFields.some((field) => !ALLOWED_FIELD_SELECTION.has(field));

  if (hasInvalidField) {
    return { error: true };
  }

  const select = requestedFields.reduce((selection, field) => {
    selection[field] = true;
    return selection;
  }, {});

  return { requestedFields, select };
}

async function listProducts(req, res, next) {
  try {
    const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);
    const limit = parsePositiveInteger(req.query.limit, DEFAULT_LIMIT);
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";
    const fields = parseFields(req.query.fields);

    if (!Number.isInteger(page) || page < 1) {
      return buildQueryParameterError(res);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      return buildQueryParameterError(res);
    }

    if (!ALLOWED_SORT_FIELDS.has(sortBy)) {
      return buildQueryParameterError(res);
    }

    if (order !== "asc" && order !== "desc") {
      return buildQueryParameterError(res);
    }

    if (fields?.error) {
      return buildQueryParameterError(res);
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        ...(fields?.select ? { select: fields.select } : {}),
      }),
      prisma.product.count(),
    ]);

    return res.json({
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const productId = parseProductId(req.params.id);

    if (!validateProductId(productId, res)) {
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    if (!validateProductPayload(req.body, res)) {
      return;
    }

    const product = await prisma.product.create({
      data: normalizeProductPayload(req.body),
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const productId = parseProductId(req.params.id);

    if (!validateProductId(productId, res)) {
      return;
    }

    if (!validateProductPayload(req.body, res, { allowPartial: true })) {
      return;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Not found" });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: normalizeProductPayload(req.body),
    });

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
};
