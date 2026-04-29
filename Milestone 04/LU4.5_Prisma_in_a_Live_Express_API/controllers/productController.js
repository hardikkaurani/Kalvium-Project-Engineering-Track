const prisma = require("../lib/prisma");

function parseProductId(rawId) {
  return Number.parseInt(rawId, 10);
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

async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(products);
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
