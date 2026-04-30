import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { loginUser } from '../../api/auth';

// Mock the entire API module
jest.mock('../../api/auth');

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    // Form should render email input, password input, and submit button
    it('renders email, password inputs and submit button', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });
  });

  describe('happy path', () => {
    // Should call loginUser API with correct email and password values
    it('calls API with correct credentials on submit', async () => {
      loginUser.mockResolvedValue({ user: { name: 'John' }, token: 'abc' });
      const onSuccess = jest.fn();
      render(<LoginForm onSuccess={onSuccess} />);

      await userEvent.type(screen.getByLabelText('Email'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'secret123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith('john@test.com', 'secret123');
      });
    });

    // Should call onSuccess callback with API result after successful login
    it('calls onSuccess with result on successful login', async () => {
      const mockResult = { user: { name: 'John' }, token: 'abc123' };
      loginUser.mockResolvedValue(mockResult);
      const onSuccess = jest.fn();
      render(<LoginForm onSuccess={onSuccess} />);

      await userEvent.type(screen.getByLabelText('Email'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'secret123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockResult);
      });
    });
  });

  describe('failure cases', () => {
    // Should display error message when API returns an error
    it('shows error message on API failure', async () => {
      loginUser.mockRejectedValue(new Error('Invalid credentials'));
      render(<LoginForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'bad@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'wrong');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
      });
    });

    // Should prevent form submission when fields are empty
    it('shows validation error when fields are empty', async () => {
      render(<LoginForm />);

      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByRole('alert')).toHaveTextContent('All fields are required');
      expect(loginUser).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    // Submit button should be disabled and show loading text during API call
    it('disables button and shows loading text during submission', async () => {
      // Make the API hang so we can check intermediate state
      loginUser.mockImplementation(() => new Promise(() => {}));
      render(<LoginForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'john@test.com');
      await userEvent.type(screen.getByLabelText('Password'), 'secret');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
      });
    });
  });
});
