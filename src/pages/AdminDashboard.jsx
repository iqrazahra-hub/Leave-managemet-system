import { Link } from "react-router-dom";
import { Badge, PageHead } from "../components/ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { downloadCsv } from "../lib/csv.js";
import { DEPARTMENTS, listUsers } from "../data/users.js";

const ON_LEAVE_TODAY = {};
const LATEST = [];

export default function AdminDashboard() {
  const toast = useToast();
  const users = listUsers().filter((u) => u.status === "active");
  const rows = DEPARTMENTS.map((d) => {
    const total = users.filter((u) => u.department === d).length;
    const away = Math.min(total, ON_LEAVE_TODAY[d] || 0);
    return [d, total - away, total, away];
  });
  const away = rows.reduce((n, r) => n + r[3], 0);

  function report() {
    downloadCsv("availability-report.csv", [["Department", "Available", "Total", "On leave"], ...rows]);
    toast("Report downloaded.");
  }

  return (
    <>
      <PageHead eyebrow="People operations" title="People first. Everything in view." sub="A clear picture of leave and availability across Northstar Studio."
        action={<button className="btn btn-sm" onClick={report}>Download report ↓</button>} />
      <div className="stats">
        {[["Total employees", String(users.length), `Across ${DEPARTMENTS.length} departments`, true], ["On leave today", String(away).padStart(2, "0"), `${users.length - away} people available`], ["Pending requests", "00", "Nothing waiting"], ["Leave utilization", "0%", "Annual leave · 2026"]].map(([l, n, s, dark]) => (
          <div key={l} className={`card${dark ? " card--dark" : ""}`}><p className="stat__label">{l}</p><p className="stat__num">{n}</p><p className="stat__sub">{s}</p></div>
        ))}
      </div>
      <div className="grid2">
        <div className="card">
          <h3>A pulse on every team</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Department</th><th>Available / total</th><th>On leave</th><th>Availability</th></tr></thead>
              <tbody>
                {rows.map(([n, a, t, l]) => (
                  <tr key={n}><td>{n}</td><td>{a} / {t}</td><td>{l}</td><td><div className="bar"><i style={{ width: `${t ? (a / t) * 100 : 0}%` }} /></div></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card card--green">
          <h3>The everyday essentials</h3>
          {[["Add or manage people", "Create accounts and assign roles", "/admin/people"], ["Review leave requests", "Every request in the company", "/admin/requests"], ["View company calendar", "Holidays and team leave", "/admin/calendar"]].map(([t, s, to]) => (
            <p key={t}><Link className="link" to={to}>{t} ↗</Link><br /><small className="muted">{s}</small></p>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="between"><h3>Latest leave requests</h3><Link className="link" to="/admin/requests">View all →</Link></div>
        <div className="table-wrap">
          <table><tbody>{LATEST.map(([n, d, dt, s]) => (<tr key={n}><td><b>{n}</b></td><td className="muted">{d}</td><td>{dt}</td><td><Badge status={s} /></td></tr>))}</tbody></table>
          {LATEST.length === 0 && <p className="muted">No leave requests yet.</p>}
        </div>
      </div>
    </>
  );
}
