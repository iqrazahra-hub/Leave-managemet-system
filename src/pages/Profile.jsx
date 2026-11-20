import { useState } from "react";
import { Field, PageHead } from "../components/ui.jsx";
import { useToast } from "../components/Toast.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { passwordProblem } from "../data/users.js";

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Everything here belongs to the signed-in user. Name/phone and password changes are saved for real.
export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [first, ...rest] = user.name.split(" ");
  const [info, setInfo] = useState({ first, last: rest.join(" "), phone: user.phone });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});

  function saveInfo(e) {
    e.preventDefault();
    if (!info.first.trim()) return setErrors({ first: "Enter your first name." });
    updateProfile({ name: `${info.first.trim()} ${info.last.trim()}`.trim(), phone: info.phone.trim() });
    setErrors({});
    toast("Profile updated.");
  }

  async function savePassword(e) {
    e.preventDefault();
    const er = {};
    if (!pw.current) er.current = "Enter your current password.";
    const problem = passwordProblem(pw.next);
    if (problem) er.next = problem;
    if (pw.confirm !== pw.next) er.confirm = "Passwords don’t match.";
    setErrors(er);
    if (Object.keys(er).length) return;
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      toast("Password changed.");
    } catch {
      setErrors({ current: "Your current password is incorrect." });
    }
  }

  const [firstLine, ...otherLines] = user.name.split(" ");
  return (
    <>
      <PageHead eyebrow="My account" title="A little about you" sub="Keep your details up to date and your account secure."
        action={<button className="btn btn-sm" form="profile-form">Save changes</button>} />
      <div className="split split--profile">
        <div className="card card--green">
          <p className="eyebrow">Employee profile</p>
          <h2 className="name">{firstLine}<br />{otherLines.join(" ")}</h2>
          <p className="c-green"><b>{user.designation}</b></p>
          <p className="muted">{user.department}</p>
          <hr />
          {[["Employee ID", user.employeeId], ["Joined", formatDate(user.joined)], ["Reporting to", user.manager], ["Work location", user.location]].map(([k, v]) => (
            <p key={k}><span className="eyebrow">{k}</span><br /><b>{v}</b></p>
          ))}
        </div>
        <div className="stack">
          <form id="profile-form" className="card form" onSubmit={saveInfo} noValidate>
            <h3>Personal information</h3>
            <div className="row2">
              <Field label="First name" error={errors.first}><input className="ctl" value={info.first} onChange={(e) => setInfo({ ...info, first: e.target.value })} /></Field>
              <Field label="Last name"><input className="ctl" value={info.last} onChange={(e) => setInfo({ ...info, last: e.target.value })} /></Field>
              <Field label="Work email"><input className="ctl" value={user.email} disabled /></Field>
              <Field label="Phone number"><input className="ctl" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></Field>
            </div>
            <p className="muted">Your email, department, designation and manager are managed by your HR team.</p>
          </form>
          <form className="card form" onSubmit={savePassword} noValidate>
            <h3>Change password</h3>
            <p className="muted">Use at least 8 characters, with a letter and a number.</p>
            <Field label="Current password" error={errors.current}><input className="ctl" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></Field>
            <div className="row2">
              <Field label="New password" error={errors.next}><input className="ctl" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
              <Field label="Confirm new password" error={errors.confirm}><input className="ctl" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></Field>
            </div>
            <div className="actions"><button className="btn btn--ghost btn-sm">Update password</button></div>
          </form>
        </div>
      </div>
    </>
  );
}
