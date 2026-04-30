import { useState, useEffect } from 'react';
import { fetchOrders } from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';

/**
 * OrdersList — fetches and displays orders from API.
 */
function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <ErrorMessage message={error} onRetry={loadOrders} />;
  if (orders.length === 0) return <p>No orders found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>${order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersList;
