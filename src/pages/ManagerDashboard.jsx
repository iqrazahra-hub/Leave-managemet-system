import { Link } from "react-router-dom";
import { PageHead, firstName, greeting } from "../components/ui.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { APPROVALS, TRENDS } from "../data/mock.js";

const MAX = Math.max(...TRENDS.map((t) => t[1]));

export default function ManagerDashboard() {
  const { name } = useAuth();
  return (
    <>
      <PageHead eyebrow="Your team at a glance" title={`${greeting()}, ${firstName(name)}`} sub="A balanced team starts with a clear picture."
        action={<Link to="/manager/planner" className="btn btn-sm">View team planner →</Link>} />
      <div className="stats">
        {[["Team members", "00", "Engineering & product"], ["Pending approvals", "00", "Nothing waiting for review", true], ["On leave today", "00", "Everyone is available"], ["Leave days this month", "00", "Approved this month"]].map(([l, n, s, dark]) => (
          <div key={l} className={`card${dark ? " card--dark" : ""}`}><p className="stat__label">{l}</p><p className="stat__num">{n}</p><p className="stat__sub">{s}</p></div>
        ))}
      </div>
      <div className="grid2">
        <div className="card">
          <div className="between"><h3>A few requests need your review</h3><Link className="link" to="/manager/approvals">View all →</Link></div>
          <table>
            <thead><tr><th>Employee</th><th>Leave dates</th><th>Days</th><th /></tr></thead>
            <tbody>
              {APPROVALS.slice(0, 3).map((a) => (
                <tr key={a.ref}><td><b>{a.name}</b><br /><small className="muted">{a.type}</small></td><td>{a.dates}</td><td>{a.days} {a.days > 1 ? "days" : "day"}</td>
                  <td><Link to="/manager/approvals" className="btn btn--soft btn-sm">Review →</Link></td></tr>
              ))}
            </tbody>
          </table>
          {APPROVALS.length === 0 && <p className="muted">No requests are waiting for your review.</p>}
        </div>
        <div className="card card--green"><h3>Taking a little time</h3><p className="muted">No one is on leave today.</p></div>
      </div>
      <div className="grid2">
        <div className="card">
          <h3>Leave trends</h3><p className="muted">Approved days · Last 6 months</p>
          <div className="trend">
            <div><p className="big">0</p><p className="muted">days of time well spent</p></div>
            <div className="bars">{TRENDS.map(([m, v], i) => (
              <div key={m}><small>{v}</small><i className={i === TRENDS.length - 1 ? "on" : ""} style={{ height: `${(v / MAX) * 90}px` }} /><small className="muted">{m}</small></div>
            ))}</div>
          </div>
        </div>
        <div className="card"><h3>Team coverage</h3><p className="muted">No coverage conflicts.</p></div>
      </div>
    </>
  );
}
