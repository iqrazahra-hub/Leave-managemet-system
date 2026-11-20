import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field, PageHead } from "../components/ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const HOLIDAYS = ["2026-11-26", "2026-12-25"];
const BALANCE = 20;

// Counts Mon–Fri days between two dates, skipping public holidays.
function workingDays(a, b) {
  if (!a || !b || b < a) return 0;
  let n = 0;
  for (let d = new Date(a); d <= new Date(b); d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (d.getDay() !== 0 && d.getDay() !== 6 && !HOLIDAYS.includes(iso)) n++;
  }
  return n;
}

export default function ApplyLeave() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [f, setF] = useState({ type: "Annual leave", start: "2026-11-19", end: "2026-11-20", reason: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const days = workingDays(f.start, f.end);

  function submit(e) {
    e.preventDefault();
    if (!days) return setError("Choose an end date on or after the start date.");
    if (!f.reason.trim()) return setError("Add a short reason for your leave.");
    // TODO: POST the request to your API here.
    toast("Leave request submitted. Your manager has been notified.");
    navigate("/employee/requests");
  }

  return (
    <>
      <Link to="/employee" className="back">← Back to overview</Link>
      <PageHead title="Make time for yourself" sub="Plan your break. We’ll handle the paperwork." />
      <div className="split">
        <form className="card form" onSubmit={submit}>
          <h3>Leave details</h3>
          <p className="muted">All fields are required unless marked optional.</p>
          <Field label="Leave type">
            <select className="ctl" value={f.type} onChange={set("type")}>
              <option>Annual leave</option><option>Sick leave</option><option>Casual leave</option>
            </select>
          </Field>
          <div className="row2">
            <Field label="Start date"><input className="ctl" type="date" value={f.start} onChange={set("start")} /></Field>
            <Field label="End date"><input className="ctl" type="date" value={f.end} onChange={set("end")} /></Field>
          </div>
          <p className="note note--green">{days} working days requested · Weekends and holidays are excluded</p>
          <Field label="Reason for leave">
            <textarea className="ctl" rows={3} placeholder="A short break to recharge and spend time with family." value={f.reason} onChange={set("reason")} />
          </Field>
          <Field label="Attachment (optional)">
            <span className="drop">
              {file ? file.name : "↑ Click to upload"}<small>PDF, PNG or JPG · Up to 10 MB</small>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={(e) => {
                const picked = e.target.files[0];
                if (picked && picked.size > 10 * 1024 * 1024) { setError("The file is larger than 10 MB."); return; }
                setError(""); setFile(picked || null);
              }} />
            </span>
          </Field>
          {error && <p className="field__error" role="alert">{error}</p>}
          <div className="actions">
            <Link to="/employee" className="btn btn--ghost btn-sm">Cancel</Link>
            <button className="btn btn-sm" type="submit">Submit request →</button>
          </div>
        </form>

        <div className="stack">
          <div className="card card--green">
            <h3>A little peace of mind</h3>
            <p className="muted">Your annual leave balance</p>
            <p className="big">{BALANCE} days</p>
            <p className="kv"><span>This request</span><b>− {days} days</b></p>
            <p className="kv"><span>Balance after approval</span><b className="c-green">{BALANCE - days} days</b></p>
            <p className="muted">Approver</p><b>{user.manager}</b>
          </div>
          <div className="card">
            <h3>Before you submit</h3>
            <p className="muted">Please request annual leave at least 3 working days in advance. Your manager will be notified when you submit.</p>
            <a className="link" href="#policy">Read leave policy ↗</a>
          </div>
        </div>
      </div>
    </>
  );
}
