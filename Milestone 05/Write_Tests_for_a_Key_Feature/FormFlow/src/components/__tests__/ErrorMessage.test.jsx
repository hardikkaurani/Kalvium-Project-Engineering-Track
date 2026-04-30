import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  describe('rendering', () => {
    // Should display the error message text to the user
    it('renders the error message', () => {
      render(<ErrorMessage message="Something went wrong" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });
  });

  describe('retry button', () => {
    // Should show a retry button when onRetry callback is provided
    it('shows retry button when onRetry is provided', () => {
      render(<ErrorMessage message="Error" onRetry={() => {}} />);

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    // Should NOT render retry button when onRetry is not given
    it('does not show retry button when onRetry is missing', () => {
      render(<ErrorMessage message="Error" />);

      expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
    });

    // Retry button should call onRetry when clicked
    it('calls onRetry when retry button is clicked', async () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      await userEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
