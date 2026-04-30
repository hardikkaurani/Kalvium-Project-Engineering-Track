-- ============================================
-- PostgreSQL Index Optimization Experiment
-- ============================================

-- STEP 1: Create the orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data (10,000 rows for realistic scenario)
INSERT INTO orders (customer_id, product_id, order_date, status, amount) 
SELECT 
    (RANDOM() * 1000)::INT + 1,
    (RANDOM() * 500)::INT + 1,
    CURRENT_DATE - (RANDOM() * 365)::INT,
    CASE WHEN RANDOM() < 0.5 THEN 'completed' ELSE 'pending' END,
    (RANDOM() * 1000)::DECIMAL
FROM generate_series(1, 10000);

-- Add more data for better demonstration
INSERT INTO orders (customer_id, product_id, order_date, status, amount) 
SELECT 
    (RANDOM() * 1000)::INT + 1,
    (RANDOM() * 500)::INT + 1,
    CURRENT_DATE - (RANDOM() * 365)::INT,
    CASE WHEN RANDOM() < 0.5 THEN 'completed' ELSE 'pending' END,
    (RANDOM() * 1000)::DECIMAL
FROM generate_series(1, 40000);

-- ============================================
-- STEP 2: The SLOW QUERY (Multi-column WHERE)
-- ============================================
-- This query filters by THREE columns:
-- 1. status = 'completed'
-- 2. order_date >= specific date
-- 3. customer_id = specific customer

-- Run this BEFORE any index optimization:
EXPLAIN ANALYZE
SELECT id, customer_id, product_id, order_date, status, amount
FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01'
  AND customer_id = 42;

-- ============================================
-- STEP 3: CREATE INCORRECT INDEX (WRONG ORDER)
-- ============================================
-- WRONG: Columns in wrong order (customer_id first)
-- According to the query, status should be first
-- This violates the Left-Most Prefix Rule
CREATE INDEX idx_orders_wrong ON orders(customer_id, order_date, status);

-- Run the query again - PostgreSQL still won't use this index efficiently
EXPLAIN ANALYZE
SELECT id, customer_id, product_id, order_date, status, amount
FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01'
  AND customer_id = 42;

-- ============================================
-- STEP 4: DROP THE INCORRECT INDEX
-- ============================================
DROP INDEX IF EXISTS idx_orders_wrong;

-- ============================================
-- STEP 5: CREATE CORRECT INDEX (RIGHT ORDER)
-- ============================================
-- CORRECT: Match the WHERE clause column order
-- WHERE clause order: status, order_date, customer_id
-- Index column order: status, order_date, customer_id
CREATE INDEX idx_orders_correct ON orders(status, order_date, customer_id);

-- Run the query again - now PostgreSQL uses the index!
EXPLAIN ANALYZE
SELECT id, customer_id, product_id, order_date, status, amount
FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01'
  AND customer_id = 42;

-- ============================================
-- BONUS: Test with different query patterns
-- ============================================

-- Query 1: Uses all three columns (most efficient)
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01'
  AND customer_id = 42;

-- Query 2: Uses first two columns (still efficient - Left-Most Prefix)
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01';

-- Query 3: Uses only first column (still efficient)
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'completed';

-- Query 4: Skips first column (INEFFICIENT - won't use index)
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE order_date >= '2024-01-01'
  AND customer_id = 42;

-- ============================================
-- CLEANUP
-- ============================================
-- DROP INDEX idx_orders_correct;
-- DROP TABLE orders;
