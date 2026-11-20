import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthBrand from "../components/AuthBrand.jsx";
import "./Login.css";

function AuthLayout({ title, tagline, children }) {
  return (
    <main className="login">
      <AuthBrand />
      <section className="login__form-side">
        <div className="login__theme"><ThemeToggle /></div>
        <div className="login__form-wrap">
          <p className="login__company">Employee portal</p>
          <h2 className="login__title">{title}</h2>
          <p className="login__tagline">{tagline}</p>
          {children}
          <p className="login__secure"><Link to="/login" className="login__forgot">← Back to log in</Link></p>
        </div>
      </section>
    </main>
  );
}

// 02 · Forgot password
export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid work email.");
    try {
      await resetPassword(email); // Firebase emails the reset link
    } catch { /* don't reveal whether the email exists */ }
    navigate("/check-email", { state: { email } });
  }
  return (
    <AuthLayout title="Forgot password?" tagline="Enter your work email and we’ll send you a reset link.">
      <form className="login__form" onSubmit={submit} noValidate>
        <Input id="email" type="email" label="Work email" placeholder="alex.morgan@northstar.pk"
          value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}

// 03 · Check your email
export function CheckEmail() {
  const { state } = useLocation();
  const email = state?.email || "your work email";
  return (
    <AuthLayout title="Check your email" tagline={`We sent a reset link to ${email}. It expires in 30 minutes.`}>
      <div className="login__form">
        <a className="btn" href="mailto:">Open email app</a>
        <Link to="/login" className="btn btn--ghost">Back to log in</Link>
        <p className="login__secure">Didn’t get it? Check spam, or <Link to="/forgot-password" className="login__forgot">resend the link</Link>.</p>
      </div>
    </AuthLayout>
  );
}

// 04 · Reset password
export function ResetPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (pw.length < 8) next.pw = "Use at least 8 characters.";
    if (confirm !== pw) next.confirm = "Passwords don’t match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    // TODO: call your "reset password" API here.
    navigate("/login");
  }
  return (
    <AuthLayout title="Set a new password" tagline="Choose a strong password to keep your account safe.">
      <form className="login__form" onSubmit={submit} noValidate>
        <Input id="pw" type="password" label="New password" placeholder="At least 8 characters"
          value={pw} onChange={(e) => setPw(e.target.value)} error={errors.pw} />
        <Input id="confirm" type="password" label="Confirm new password" placeholder="Re-enter your new password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
        <Button type="submit">Update password</Button>
      </form>
    </AuthLayout>
  );
}
