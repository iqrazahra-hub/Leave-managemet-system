import { PageHead } from "../components/ui.jsx";

// November 2026 starts on a Sunday → 6 blank cells when the week starts on Monday.
const OFFSET = 6;
const EVENTS = {};
const UPCOMING = [];

export default function LeaveCalendar() {
  const cells = [...Array(OFFSET).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <>
      <PageHead eyebrow="Plan ahead" title="Leave calendar" sub="Your leave and company holidays in one place." />
      <div className="split">
        <div className="card">
          <div className="between"><h3>November 2026</h3>
            <span className="legend"><i className="dot dot--pending" /> Pending <i className="dot dot--approved" /> Approved <i className="dot dot--holiday" /> Holiday</span>
          </div>
          <div className="month">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <b key={i}>{d}</b>)}
            {cells.map((d, i) => (
              <span key={i} className={d ? `day day--${EVENTS[d] || "none"}${(i % 7) > 4 ? " day--wknd" : ""}` : ""}>{d}</span>
            ))}
          </div>
        </div>
        <div className="card card--green">
          <h3>Coming up</h3>
          {UPCOMING.length === 0 && <p className="muted">Nothing coming up.</p>}
          {UPCOMING.map(([d, t, s]) => (
            <div className="date" key={d}><div><b>{t}</b><p>{d} · {s}</p></div></div>
          ))}
        </div>
      </div>
    </>
  );
}
