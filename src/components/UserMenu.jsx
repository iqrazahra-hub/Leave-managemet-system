import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ROLE_LABEL } from "../data/users.js";
import Avatar from "./Avatar.jsx";

export default function UserMenu({ portal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="umenu" ref={ref}>
      <button className="umenu__btn" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Avatar name={user.name} /> <span className="umenu__name">{user.name}</span> <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="umenu__panel" role="menu">
          <div className="umenu__who"><b>{user.name}</b><small>{user.email}</small><small>{ROLE_LABEL[user.role]}</small></div>
          <Link role="menuitem" to={`/${portal}/profile`} onClick={() => setOpen(false)}>My profile</Link>
          <button role="menuitem" onClick={() => { logout(); navigate("/login"); }}>Log out</button>
        </div>
      )}
    </div>
  );
}
