import { useState } from "react";
import { Badge, PageHead } from "../components/ui.jsx";
import { APPROVALS } from "../data/mock.js";

export default function Approvals() {
  const [items, setItems] = useState(APPROVALS.map((a) => ({ ...a, status: "Pending" })));
  const [sel, setSel] = useState(APPROVALS[0]?.ref);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");

  const waiting = items.filter((a) => a.status === "Pending" && a.name.toLowerCase().includes(q.toLowerCase()));
  const a = items.find((x) => x.ref === sel);

  function decide(status) {
    if (status === "Rejected" && !comment.trim()) return setMsg("Add a comment before rejecting a request.");
    // TODO: send the decision to your API here.
    setItems(items.map((x) => (x.ref === sel ? { ...x, status } : x)));
    setMsg(`${status} · ${a.name} will be notified.`);
    setComment("");
    const next = items.find((x) => x.status === "Pending" && x.ref !== sel);
    if (next) setSel(next.ref);
  }

  return (
    <>
      <PageHead eyebrow="Manage requests" title="A thoughtful review, a better balance" sub="Review the details. Check team coverage. Make a clear decision." />
      <div className="split split--approve">
        <div className="card">
          <div className="between"><h3>Awaiting your review</h3><span className="badge badge--pending">{waiting.length} requests</span></div>
          <input className="ctl" placeholder="Search employees..." value={q} onChange={(e) => setQ(e.target.value)} />
          {waiting.map((x) => (
            <button key={x.ref} className={`pick${x.ref === sel ? " is-on" : ""}`} onClick={() => { setSel(x.ref); setMsg(""); }}>
              <b>{x.name}</b><small>{x.type} · {x.days} {x.days > 1 ? "days" : "day"}</small><small>{x.dates}</small>
              <small className={x.conflict ? "c-amber" : "muted"}>{x.tag}</small>
            </button>
          ))}
          {!waiting.length && <p className="muted">All caught up. Nice work.</p>}
        </div>

        <div className="card">
          {msg && <p className="note note--green" role="status">{msg}</p>}
          {a && a.status === "Pending" ? (
            <>
              <div className="between"><h2 className="h2">{a.name}</h2><Badge status="Pending" /></div>
              <p className="muted">{a.role} · {a.empId} · {a.ref}</p>
              <div className="facts"><div><span>Leave type</span><b>{a.type}</b></div><div><span>Dates</span><b>{a.dates}</b></div><div><span>Duration</span><b>{a.days} days</b></div></div>
              <p className="eyebrow">Reason for leave</p><p>{a.reason}</p>
              <p className="c-green">Annual balance: <b>{a.balance}</b></p>
              {a.conflict && <div className="note note--amber"><b>Coverage conflict · {a.dates}</b><br />{a.conflict}</div>}
              <div className="between"><b>Decision comments</b><small className="muted">Required when rejecting a request</small></div>
              <textarea className="ctl" rows={3} placeholder="Add context for your decision..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="actions actions--split">
                <button className="btn btn--danger btn-sm" onClick={() => decide("Rejected")}>Reject request</button>
                <button className="btn btn-sm" onClick={() => decide("Approved")}>Approve request ✓</button>
              </div>
              <p className="muted">Your decision and comments will be shared with {a.name.split(" ")[0]}.</p>
            </>
          ) : !msg && <p className="muted">Select a request to review.</p>}
        </div>
      </div>
    </>
  );
}
