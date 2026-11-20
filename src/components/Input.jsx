import "./Input.css";

/**
 * Labeled text field. Pass `action` to render a small button inside
 * the field on the right (used for "Show" on password).
 */
export default function Input({ id, label, error, action, icon, ...props }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={`field__box${error ? " field__box--error" : ""}`}>
        {icon && <span className="field__icon">{icon}</span>}
        <input
          id={id}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {action}
      </div>
      {error && (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
