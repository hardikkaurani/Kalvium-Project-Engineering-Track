const { Prisma, OrderStatus } = require("@prisma/client");
const prisma = require("../lib/prisma");

function parseOrderId(rawId) {
  return Number.parseInt(rawId, 10);
}

function validateOrderId(orderId, res) {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    res.status(400).json({ error: "Invalid order id" });
    return false;
  }

  return true;
}

function buildCheckoutItems(items = []) {
  return items
    .map((item) => ({
      productId: Number.parseInt(item.productId, 10),
      quantity: Number.parseInt(item.quantity, 10),
    }))
    .filter((item) => Number.isInteger(item.productId) && Number.isInteger(item.quantity));
}

async function listOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const orderId = parseOrderId(req.params.id);

    if (!validateOrderId(orderId, res)) {
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

async function checkout(req, res, next) {
  try {
    const { customerEmail } = req.body;
    const items = buildCheckoutItems(req.body.items);

    if (!customerEmail || items.length === 0) {
      return res.status(400).json({ error: "customerEmail and at least one item are required" });
    }

    if (typeof customerEmail !== "string" || !customerEmail.includes("@")) {
      return res.status(400).json({ error: "customerEmail must be a valid email address" });
    }

    if (items.some((item) => item.quantity <= 0)) {
      return res.status(400).json({ error: "All quantities must be greater than zero" });
    }

    const aggregatedItems = Array.from(
      items.reduce((map, item) => {
        const existingQuantity = map.get(item.productId) || 0;
        map.set(item.productId, existingQuantity + item.quantity);
        return map;
      }, new Map()).entries(),
    ).map(([productId, quantity]) => ({ productId, quantity }));

    const createdOrder = await prisma.$transaction(
      async (tx) => {
        const products = await tx.product.findMany({
          where: {
            id: {
              in: aggregatedItems.map((item) => item.productId),
            },
          },
        });

        if (products.length !== aggregatedItems.length) {
          throw new Error("One or more products were not found");
        }

        const productsById = new Map(products.map((product) => [product.id, product]));

        for (const item of aggregatedItems) {
          const product = productsById.get(item.productId);

          if (!product) {
            throw new Error("One or more products were not found");
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.id}`);
          }
        }

        for (const item of aggregatedItems) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: {
                gte: item.quantity,
              },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (updateResult.count !== 1) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }
        }

        const total = aggregatedItems.reduce((sum, item) => {
          const product = productsById.get(item.productId);
          return sum.plus(product.price.mul(item.quantity));
        }, new Prisma.Decimal(0));

        const order = await tx.order.create({
          data: {
            customerEmail,
            status: OrderStatus.PENDING,
            total,
            items: {
              create: aggregatedItems.map((item) => {
                const product = productsById.get(item.productId);

                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  unitPrice: product.price,
                };
              }),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return order;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return res.status(201).json(createdOrder);
  } catch (error) {
    if (
      error.message === "One or more products were not found" ||
      error.message.startsWith("Insufficient stock for product")
    ) {
      return res.status(400).json({ error: error.message });
    }

    return next(error);
  }
}

module.exports = {
  listOrders,
  getOrderById,
  checkout,
};
