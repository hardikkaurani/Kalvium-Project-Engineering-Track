/**
 * Button component — reusable across FormFlow.
 * Supports label, onClick, disabled, and variant props.
 */
function Button({ label, onClick, disabled = false, variant = 'primary' }) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium text-sm transition-all';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
}

export default Button;
