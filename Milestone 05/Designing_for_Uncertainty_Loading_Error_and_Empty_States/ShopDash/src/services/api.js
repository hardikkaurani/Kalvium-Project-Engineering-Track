/**
 * Simulated API service for ShopDash.
 * Each function returns a Promise that resolves after a delay.
 * Pass { fail: true } to simulate server errors.
 * Pass { empty: true } to simulate empty datasets.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Sample Data ---

const SAMPLE_ORDERS = [
  { id: 'ORD-1001', customer: 'Alice Johnson', total: 249.99, status: 'Delivered', date: '2024-12-28' },
  { id: 'ORD-1002', customer: 'Bob Smith', total: 89.50, status: 'Processing', date: '2024-12-29' },
  { id: 'ORD-1003', customer: 'Carol Davis', total: 599.00, status: 'Shipped', date: '2024-12-30' },
  { id: 'ORD-1004', customer: 'Dan Wilson', total: 34.99, status: 'Delivered', date: '2024-12-31' },
  { id: 'ORD-1005', customer: 'Eve Martinez', total: 179.00, status: 'Cancelled', date: '2025-01-01' },
  { id: 'ORD-1006', customer: 'Frank Lee', total: 450.00, status: 'Processing', date: '2025-01-02' },
];

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones Pro', price: 149.99, stock: 45, category: 'Electronics', image: '🎧' },
  { id: 2, name: 'Ergonomic Desk Chair', price: 399.00, stock: 12, category: 'Furniture', image: '🪑' },
  { id: 3, name: 'Smart Watch Ultra', price: 299.99, stock: 0, category: 'Electronics', image: '⌚' },
  { id: 4, name: 'Organic Coffee Beans', price: 24.99, stock: 200, category: 'Food & Drink', image: '☕' },
  { id: 5, name: 'Running Shoes X1', price: 129.00, stock: 67, category: 'Sports', image: '👟' },
  { id: 6, name: 'Portable Charger 20K', price: 49.99, stock: 89, category: 'Electronics', image: '🔋' },
];

const SAMPLE_CUSTOMERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', orders: 12, spent: 2450.00, joined: '2024-03-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', orders: 8, spent: 1200.50, joined: '2024-05-22' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', orders: 23, spent: 5600.00, joined: '2023-11-10' },
  { id: 4, name: 'Dan Wilson', email: 'dan@example.com', orders: 3, spent: 340.00, joined: '2024-09-01' },
  { id: 5, name: 'Eve Martinez', email: 'eve@example.com', orders: 17, spent: 3890.00, joined: '2024-01-08' },
];

const DASHBOARD_STATS = {
  revenue: 48250.00,
  orders: 156,
  customers: 89,
  products: 42,
  recentOrders: SAMPLE_ORDERS.slice(0, 3),
  topProducts: SAMPLE_PRODUCTS.slice(0, 3),
};

// --- API Functions ---

export async function fetchOrders({ fail = false, empty = false } = {}) {
  await delay(1500);
  if (fail) throw new Error('Failed to load orders. Server returned 500.');
  return empty ? [] : SAMPLE_ORDERS;
}

export async function fetchProducts({ fail = false, empty = false } = {}) {
  await delay(1200);
  if (fail) throw new Error('Failed to load products. Connection timeout.');
  return empty ? [] : SAMPLE_PRODUCTS;
}

export async function fetchCustomers({ fail = false, empty = false } = {}) {
  await delay(1800);
  if (fail) throw new Error('Failed to load customers. Unauthorized.');
  return empty ? [] : SAMPLE_CUSTOMERS;
}

export async function fetchDashboard({ fail = false, empty = false } = {}) {
  await delay(1000);
  if (fail) throw new Error('Failed to load dashboard data.');
  return empty ? { revenue: 0, orders: 0, customers: 0, products: 0, recentOrders: [], topProducts: [] } : DASHBOARD_STATS;
}
