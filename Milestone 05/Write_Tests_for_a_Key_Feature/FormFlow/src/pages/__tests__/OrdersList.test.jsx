import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersList from '../OrdersList';
import { fetchOrders } from '../../api/auth';

// Mock the API module
jest.mock('../../api/auth');

describe('OrdersList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('happy path', () => {
    // Should display order data in a table when API returns orders
    it('renders orders when API returns data', async () => {
      fetchOrders.mockResolvedValue([
        { id: 'ORD-001', customer: 'Alice', total: 99.99 },
        { id: 'ORD-002', customer: 'Bob', total: 149.50 },
      ]);
      render(<OrdersList />);

      // Wait for loading to finish and data to appear
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$149.5')).toBeInTheDocument();
    });

    // Table should have correct column headers
    it('renders table headers', async () => {
      fetchOrders.mockResolvedValue([
        { id: 'ORD-001', customer: 'Alice', total: 50 },
      ]);
      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByText('Order ID')).toBeInTheDocument();
      });

      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    // Should show empty message when API returns an empty array
    it('shows empty state when no orders exist', async () => {
      fetchOrders.mockResolvedValue([]);
      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByText('No orders found')).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    // Should show error message when API call fails
    it('shows error message on API failure', async () => {
      fetchOrders.mockRejectedValue(new Error('Failed to fetch orders'));
      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch orders');
      });
    });

    // Should show retry button on error and allow re-fetching
    it('shows retry button that re-fetches data', async () => {
      // First call fails, second succeeds
      fetchOrders
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce([{ id: 'ORD-001', customer: 'Alice', total: 50 }]);

      render(<OrdersList />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Click retry
      await userEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      // Should now show the data
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    // Should show loading text while data is being fetched
    it('shows loading state initially', () => {
      fetchOrders.mockImplementation(() => new Promise(() => {}));
      render(<OrdersList />);

      expect(screen.getByText('Loading orders...')).toBeInTheDocument();
    });
  });
});
