import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PORTALS } from "../data/nav.js";
import { useAuth } from "../auth/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import UserMenu from "../components/UserMenu.jsx";
import "./AppShell.css";

// The frame around every signed-in screen: sidebar + top bar. The current page renders in <Outlet />.
export default function AppShell({ portal }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useAuth();
  const [open, setOpen] = useState(false); // mobile sidebar
  const { label, nav } = PORTALS[portal];
  const route = (p) => `/${portal}${p ? `/${p}` : ""}`;
  const current = nav.find(([, p]) => route(p) === pathname)?.[0] ?? "";

  useEffect(() => {
    document.title = `${current || label} · Leave Management System`;
    setOpen(false);
  }, [current, label]);

  return (
    <div className="shell">
      <aside className={`side${open ? " side--open" : ""}`}>
        <div className="side__logo">
          <span className="side__mark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="9" width="12" height="6" rx="3" transform="rotate(-35 9 12)" />
              <rect x="9" y="9" width="12" height="6" rx="3" transform="rotate(-35 15 12)" />
            </svg>
          </span>
          <span>Leave Management<small>SYSTEM</small></span>
        </div>

        {role === "admin" ? (
          <select className="side__portal" value={portal} onChange={(e) => navigate(`/${e.target.value}`)} aria-label="Switch portal">
            {Object.entries(PORTALS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        ) : (
          <div className="side__portal">{label}</div>
        )}

        <nav className="side__nav">
          {nav.map(([text, path], i) => (
            <NavLink key={text} end to={route(path)} className={({ isActive }) => `side__link${isActive ? " is-active" : ""}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>{text}
            </NavLink>
          ))}
        </nav>

        <div className="side__help">
          <b>A little help?</b>
          <p>Questions about your leave policy?</p>
          <a href="mailto:people@northstar.pk">Contact the People team ↗</a>
        </div>
        <p className="side__ver">Version 2 · clean data</p>
      </aside>

      <div className="main">
        <header className="top">
          <button className="iconbtn top__menu" onClick={() => setOpen((o) => !o)} aria-label="Open menu">☰</button>
          <div><b>{label}</b><p>Northstar Studio{current && ` · ${current}`}</p></div>
          <div className="top__right"><ThemeToggle /><UserMenu portal={portal} /></div>
        </header>
        <div className="page"><Outlet /></div>
      </div>
    </div>
  );
}
