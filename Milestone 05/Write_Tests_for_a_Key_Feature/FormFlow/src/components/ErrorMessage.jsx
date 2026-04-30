/**
 * ErrorMessage component — shows error with optional retry.
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
      <p className="text-red-400 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm text-red-400 underline">
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
