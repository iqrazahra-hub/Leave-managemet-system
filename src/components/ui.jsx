export const Badge = ({ status }) => (
  <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>
);

export function PageHead({ eyebrow, title, sub, action }) {
  return (
    <div className="page__head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export const Field = ({ label, error, children }) => (
  <label className="fld">
    <span className="fld__lbl">{label}</span>
    {children}
    {error && <span className="field__error" role="alert">{error}</span>}
  </label>
);

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
export const firstName = (name) => name.split(" ")[0];
