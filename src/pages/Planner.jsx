import { downloadCsv } from "../lib/csv.js";
import { PageHead } from "../components/ui.jsx";
import { HOLIDAYS, PLANNER, PLANNER_DAYS, WEEKENDS } from "../data/mock.js";

const LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const kind = (d) => (HOLIDAYS.includes(d) ? "hol" : WEEKENDS.includes(d) ? "wk" : "");

export default function Planner() {
  const exportCsv = () => downloadCsv("team-leave-planner.csv", [["Employee", "Role", "From", "To", "Status", "Details"], ...PLANNER.flatMap((p) => p.leaves.map((l) => [p.name, p.role, `${l.from} Nov 2026`, `${l.to} Nov 2026`, l.kind, l.label]))]);
  const off = (d) => PLANNER.filter((p) => p.leaves.some((l) => d >= l.from && d <= l.to)).length;
  return (
    <>
      <PageHead eyebrow="Team planning" title="Better breaks, together" sub="Plan leave without leaving your team short-handed."
        action={<button className="btn btn--ghost btn-sm" onClick={exportCsv}>Export planner ↓</button>} />
      <div className="card plan">
        <div className="between"><h3>16 – 29 November 2026</h3><span className="legend"><i className="dot dot--approved" /> Approved <i className="dot dot--pending" /> Pending <i className="dot dot--holiday" /> Public holiday</span></div>
        <div className="plan__scroll">
          <div className="plan__row plan__head"><span>EMPLOYEE</span>{PLANNER_DAYS.map((d, i) => <span key={d} className={kind(d)}>{LETTERS[i % 7]}<br /><b>{d}</b></span>)}</div>
          {PLANNER.length === 0 && <p className="muted" style={{ padding: "16px 6px" }}>No team members to show yet.</p>}
          {PLANNER.map((p) => (
            <div className="plan__row" key={p.name}>
              <span><b>{p.name}</b><small>{p.role}</small></span>
              {PLANNER_DAYS.map((d, i) => <i key={d} className={`cell ${kind(d)}`} style={{ gridColumn: i + 2, gridRow: 1 }} />)}
              {p.leaves.map((l) => (
                <em key={l.from} className={`pbar pbar--${l.kind}`} style={{ gridColumn: `${l.from - 14} / ${l.to - 13}`, gridRow: 1 }}>{l.label}</em>
              ))}
            </div>
          ))}
          <div className="plan__row plan__foot"><span>Available</span>{PLANNER_DAYS.map((d) => <span key={d}>{kind(d) || !PLANNER.length ? "—" : `${PLANNER.length - off(d)}/${PLANNER.length}`}</span>)}</div>
        </div>
      </div>
    </>
  );
}
