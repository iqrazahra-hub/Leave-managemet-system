import "../pages/Login.css";

export default function AuthBrand() {
  return (
    <section className="brand">
      <div className="brand__logo">
        <span className="brand__mark">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="9" width="12" height="6" rx="3" transform="rotate(-35 9 12)" />
            <rect x="9" y="9" width="12" height="6" rx="3" transform="rotate(-35 15 12)" />
          </svg>
        </span>
        <span>Leave Management<small>SYSTEM</small></span>
      </div>

      <div className="brand__sun" />
      <div className="brand__cloud brand__cloud--1" />
      <div className="brand__cloud brand__cloud--2" />

      <div className="brand__copy">
        <p className="brand__eyebrow">NORTHSTAR STUDIO</p>
        <h1>Leave Management <span>System</span></h1>
        <p className="brand__sub">Submit leave requests, track balances and manage team approvals in one place.</p>
      </div>

      <div className="brand__toast">
        <span className="brand__check">✓</span>
        <span><small>REQUEST APPROVED</small><b>Annual leave · 18–20 June</b></span>
      </div>
      <div className="brand__hill" />
    </section>
  );
}
