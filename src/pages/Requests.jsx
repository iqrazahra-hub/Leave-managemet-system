import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, PageHead } from "../components/ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { ALL_REQUESTS, REQUESTS } from "../data/mock.js";

const TABS = ["All", "Pending", "Approved", "Rejected"];

// Employees and managers see their own requests; HR admins see everyone's (read-only).
export default function Requests() {
  const isAll = useLocation().pathname.startsWith("/admin");
  const toast = useToast();
  const [list, setList] = useState(isAll ? ALL_REQUESTS : REQUESTS);
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(list[0]?.id);

  const count = (t) => (t === "All" ? list.length : list.filter((r) => r.status === t).length);
  const rows = list.filter((r) => (tab === "All" || r.status === tab) && `${r.type} ${r.id} ${r.employee || ""}`.toLowerCase().includes(q.toLowerCase()));
  const r = list.find((x) => x.id === sel);

  function cancel() {
    const rest = list.filter((x) => x.id !== r.id);
    setList(rest); setSel(rest[0]?.id);
    toast("Request cancelled.");
  }

  return (
    <>
      <PageHead eyebrow={isAll ? "People operations" : "My time off"} title={isAll ? "All leave requests" : "My leave requests"}
        sub={isAll ? "Every request across the company, from first plan to final approval." : "Every request, from the first plan to the final approval."}
        action={!isAll && <Link to="/employee/apply" className="btn btn-sm">+ New request</Link>} />
      <div className="split split--wide">
        <div className="card">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t} className={t === tab ? "is-on" : ""} onClick={() => setTab(t)}>{t} <span>{count(t)}</span></button>
            ))}
          </div>
          <input className="ctl" placeholder={isAll ? "Search by employee, type or request ID" : "Search by leave type or request ID"} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="table-wrap">
            <table>
              <thead><tr><th>{isAll ? "Employee / Type" : "Type / Request ID"}</th><th>Leave dates</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id} className={`click${x.id === sel ? " is-sel" : ""}`} onClick={() => setSel(x.id)}>
                    <td><b>{isAll ? x.employee : x.type}</b><br /><small className="muted">{isAll ? `${x.type} · ${x.id}` : x.id}</small></td>
                    <td>{x.dates}</td><td>{x.days}</td><td><Badge status={x.status} /></td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={4} className="muted">No requests found.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="muted">Showing {rows.length} of {list.length} requests</p>
        </div>

        {r && (
          <div className="card">
            <div className="between"><h3>Request details</h3><Badge status={r.status} /></div>
            <p className="muted">{isAll ? `${r.employee} · ${r.id}` : r.id}</p>
            <h2 className="h2">{r.type}</h2>
            <p className="muted">{r.full}</p>
            <p className="note note--green"><b>{r.days} working {r.days > 1 ? "days" : "day"}</b></p>
            <p className="eyebrow">Reason</p><p>{r.reason}</p>
            <p className="eyebrow">Approval timeline</p>
            <p className="tl">✓ <b>Submitted</b><br /><small className="muted">{r.submitted}</small></p>
            {r.status === "Pending" && <p className="tl c-amber">● Awaiting your manager<br /><small className="muted">{isAll ? "Waiting for the manager to review." : "You’ll be notified when it’s reviewed."}</small></p>}
            {r.status === "Pending" && !isAll && <button className="btn btn--danger" onClick={cancel}>Cancel pending request</button>}
            {!isAll && <p className="muted">Only pending requests can be cancelled.</p>}
          </div>
        )}
      </div>
    </>
  );
}
