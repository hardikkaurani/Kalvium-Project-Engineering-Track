import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  describe('rendering', () => {
    // Should render with the correct visible label text
    it('renders the correct label', () => {
      render(<Button label="Save Changes" />);
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    // Should call onClick handler exactly once when clicked
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button label="Submit" onClick={handleClick} />);

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // A disabled button must NOT trigger onClick — prevents accidental submissions
    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button label="Submit" onClick={handleClick} disabled />);

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(handleClick).not.toHaveBeenCalled();
    });

    // Disabled button should have the disabled attribute for accessibility
    it('has disabled attribute when disabled prop is true', () => {
      render(<Button label="Save" disabled />);

      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
