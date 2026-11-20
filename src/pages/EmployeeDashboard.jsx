import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { firstName, greeting } from "../components/ui.jsx";
import "./EmployeeDashboard.css";

const BALANCES = [
  { label: "Annual leave", left: 20, total: 20 },
  { label: "Sick leave", left: 10, total: 10 },
  { label: "Casual leave", left: 6, total: 6 },
];
const DATES = [];
const RECENT = [];

export default function EmployeeDashboard() {
  const { name } = useAuth();
  return (
    <>
      <div className="page__head">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>{greeting()}, {firstName(name)}</h1>
          <p>Here’s a little clarity for your next time away.</p>
        </div>
        <Link to="/employee/apply" className="btn btn-sm">+ Apply for leave</Link>
      </div>

      <div className="stats">
        <div className="card card--dark">
          <p className="stat__label">Total balance</p>
          <p className="stat__num">36</p>
          <p className="stat__sub">days available</p>
        </div>
        {BALANCES.map((b) => (
          <div className="card" key={b.label}>
            <p className="stat__label">{b.label}</p>
            <p className="stat__num">{b.left}</p>
            <div className="bar"><i style={{ width: `${(b.left / b.total) * 100}%` }} /></div>
            <p className="stat__sub">of {b.total} days remaining</p>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Your leave, at a glance</h3>
          <p className="stat__sub">2026 leave year</p>
          <div className="glance">
            <div><b className="c-amber">00</b><span>Pending requests</span></div>
            <div><b className="c-green">00</b><span>Approved requests</span></div>
            <div><b className="c-red">00</b><span>Rejected request</span></div>
          </div>
          <p className="stat__sub">Balances update once a request is approved.</p>
        </div>
        <div className="card card--green">
          <h3>A few dates to look forward to</h3>
          {DATES.length === 0 && <p className="muted">No upcoming holidays yet.</p>}
          {DATES.map((x) => (
            <div className="date" key={x.title}>
              <div className="date__box"><b>{x.d}</b><small>{x.m}</small></div>
              <div><b>{x.title}</b><p>{x.sub}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card recent">
        <div className="recent__head">
          <h3>Recent requests</h3>
          <Link to="/employee/requests">View all requests →</Link>
        </div>
        <table>
          <thead><tr><th>Leave type</th><th>Dates</th><th>Duration</th><th>Status</th><th /></tr></thead>
          <tbody>
            {RECENT.map((r, i) => (
              <tr key={i}>
                <td>{r.type}</td><td>{r.dates}</td><td>{r.days}</td>
                <td><span className={`badge badge--${r.status.toLowerCase()}`}>{r.status}</span></td>
                <td><Link to="/employee/requests">View details ↗</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {RECENT.length === 0 && <p className="muted">You haven’t requested any leave yet. Use “Apply for leave” to get started.</p>}
      </div>
    </>
  );
}
