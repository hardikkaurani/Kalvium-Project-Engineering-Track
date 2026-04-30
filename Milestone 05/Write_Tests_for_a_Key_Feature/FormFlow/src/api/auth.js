/**
 * Simulated auth API for FormFlow.
 */
export async function loginUser(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

export async function fetchOrders() {
  const response = await fetch('/api/orders');

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}
