import { useState } from "react";
import Avatar from "../components/Avatar.jsx";
import Modal from "../components/Modal.jsx";
import { Field, PageHead } from "../components/ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { DEPARTMENTS, ROLE_LABEL, createUser, generatePassword, listUsers, passwordProblem, setPassword, updateUser } from "../data/users.js";

// HR admin only: create accounts, assign roles, disable access, reset passwords.
export default function People() {
  const { user: me, refresh } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | a user
  const users = listUsers();
  const rows = users.filter((u) => (role === "all" || u.role === role) && `${u.name} ${u.email} ${u.department}`.toLowerCase().includes(q.toLowerCase()));
  const count = (r) => users.filter((u) => u.role === r).length;

  function saved(message) { setEditing(null); refresh(); toast(message); }

  return (
    <>
      <PageHead eyebrow="People operations" title="People directory" sub="Add employees, assign roles and control who can sign in."
        action={<button className="btn btn-sm" onClick={() => setEditing("new")}>+ Add user</button>} />
      <div className="stats">
        {[["Total people", users.length], ["Employees", count("employee")], ["Managers", count("manager")], ["HR admins", count("admin")]].map(([l, n], i) => (
          <div key={l} className={`card${i === 0 ? " card--dark" : ""}`}><p className="stat__label">{l}</p><p className="stat__num">{String(n).padStart(2, "0")}</p></div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <input className="ctl" placeholder="Search by name, email or department" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search people" />
          <select className="ctl" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
            <option value="all">All roles</option>
            {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Person</th><th>Role</th><th>Department</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td><div className="person"><Avatar name={u.name} /><div><b>{u.name}</b>{u.id === me.id && " (you)"}<small>{u.email}</small></div></div></td>
                  <td><span className={`badge badge--${u.role}`}>{ROLE_LABEL[u.role]}</span></td>
                  <td>{u.department}<small className="muted" style={{ display: "block" }}>{u.designation}</small></td>
                  <td><span className={`badge badge--${u.status}`}>{u.status === "active" ? "Active" : "Disabled"}</span></td>
                  <td><button className="btn btn--soft btn-sm" onClick={() => setEditing(u)}>Edit</button></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="muted">No people match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="muted">Showing {rows.length} of {users.length} people</p>
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add a new user" : `Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <UserForm initial={editing === "new" ? null : editing} isSelf={editing !== "new" && editing.id === me.id} onSaved={saved} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}

function UserForm({ initial, isSelf, onSaved, onClose }) {
  const isNew = !initial;
  const [f, setF] = useState(
    initial
      ? { name: initial.name, email: initial.email, role: initial.role, department: initial.department, designation: initial.designation, status: initial.status, password: "" }
      : { name: "", email: "", role: "employee", department: DEPARTMENTS[0], designation: "", status: "active", password: generatePassword() }
  );
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(isNew);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function generate() {
    setF({ ...f, password: generatePassword() });
    setShowPw(true);
  }

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Enter the full name.";
    if (isNew && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!f.designation.trim()) er.designation = "Enter a designation.";
    if (isNew || f.password) { const p = passwordProblem(f.password); if (p) er.password = p; }
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      if (isNew) {
        await createUser(f);
        onSaved(`Account created for ${f.name.trim()}.`);
      } else {
        updateUser(initial.id, { name: f.name.trim(), role: f.role, department: f.department, designation: f.designation.trim(), status: f.status });
        if (f.password) await setPassword(initial.id, f.password);
        onSaved(`${f.name.trim()} was updated.`);
      }
    } catch (err) {
      setErrors({ email: err.message === "exists" ? "An account with this email already exists." : "Something went wrong. Try again." });
    } finally { setBusy(false); }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <Field label="Full name" error={errors.name}><input className="ctl" value={f.name} onChange={set("name")} autoFocus /></Field>
      <Field label="Work email" error={errors.email}><input className="ctl" type="email" value={f.email} onChange={set("email")} disabled={!isNew} placeholder="name@northstar.pk" /></Field>
      <div className="row2">
        <Field label="Role"><select className="ctl" value={f.role} onChange={set("role")} disabled={isSelf}>{Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="Department"><select className="ctl" value={f.department} onChange={set("department")}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
      </div>
      <Field label="Designation" error={errors.designation}><input className="ctl" value={f.designation} onChange={set("designation")} placeholder="e.g. Frontend engineer" /></Field>
      {!isNew && (
        <Field label="Account status">
          <select className="ctl" value={f.status} onChange={set("status")} disabled={isSelf}><option value="active">Active – can sign in</option><option value="disabled">Disabled – cannot sign in</option></select>
        </Field>
      )}
      {isSelf && <p className="hint">You can’t change your own role or disable your own account.</p>}
      <Field label={isNew ? "Temporary password" : "Set a new password (optional)"} error={errors.password}>
        <div className="pwrow">
          <input className="ctl" type={showPw ? "text" : "password"} value={f.password} onChange={set("password")} placeholder={isNew ? "" : "Leave empty to keep the current one"} autoComplete="new-password" />
          <button type="button" className="btn btn--ghost btn-sm" onClick={generate}>Generate</button>
          <button type="button" className="btn btn--ghost btn-sm" onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
        </div>
      </Field>
      <p className="hint">Share the password with the person securely. They can change it from My profile after signing in.</p>
      <div className="actions">
        <button type="button" className="btn btn--ghost btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-sm" disabled={busy}>{isNew ? "Create account" : "Save changes"}</button>
      </div>
    </form>
  );
}
