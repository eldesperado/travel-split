type ErrorCalloutProps = {
  message?: string;
  onDismiss: () => void;
};

export function ErrorCallout({ message, onDismiss }: ErrorCalloutProps) {
  if (!message) return null;
  return (
    <button type="button" className="error-callout" role="alert" aria-live="assertive" onClick={onDismiss}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-px" aria-hidden="true">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
      <span className="flex-1">{message}</span>
    </button>
  );
}
