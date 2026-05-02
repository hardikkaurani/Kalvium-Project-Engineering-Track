import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches optimized list of orders with pagination and selective fields
 * @param {Object} query - Query parameters (page, limit)
 */
export async function getOrders(query = {}) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;

  // Optimized query: Single database hit with selection to avoid data bloat
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.order.count()
  ]);

  return {
    data: orders,
    metadata: {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit
    }
  };
}

export async function getOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}