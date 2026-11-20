import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import AuthBrand from "../components/AuthBrand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import "./Login.css";

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);

function friendlyError(err) {
  if (err.message === "disabled") return "This account has been disabled. Contact your People team.";
  return "Incorrect email or password.";
}

export default function Login() {
  const navigate = useNavigate();
  const { user, role, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Already signed in? Go straight to your portal.
  useEffect(() => { if (user && role) navigate(`/${role}`, { replace: true }); }, [user, role, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const r = await login(email.trim(), password, remember);
      navigate(`/${r}`, { replace: true });
    } catch (err) {
      setErrors({ form: friendlyError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <AuthBrand />
      <section className="login__form-side">
        <div className="login__theme"><ThemeToggle /></div>
        <div className="login__form-wrap">
          <p className="login__company">Employee portal</p>
          <h2 className="login__title">Sign in to your account</h2>
          <p className="login__tagline">Use your work email address to continue.</p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <Input id="email" type="email" label="Email address" placeholder="you@northstar.pk"
              icon={<MailIcon />} autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input id="password" type={showPassword ? "text" : "password"} label="Password"
              placeholder="Enter your password" icon={<LockIcon />} autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
              action={
                <button type="button" className="login__show" onClick={() => setShowPassword((s) => !s)} aria-pressed={showPassword}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              } />

            <div className="login__row">
              <label className="login__check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="login__box" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 6.2 5 8.6 9.6 3.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                Keep me signed in
              </label>
              <Link to="/forgot-password" className="login__forgot">Forgot password?</Link>
            </div>

            {errors.form && <p className="field__error" role="alert">{errors.form}</p>}

            <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"} {!loading && "›"}</Button>
          </form>

          <p className="login__secure">Need help? <a className="login__forgot" href="mailto:people@northstar.pk">Contact your People team</a></p>
        </div>
      </section>
    </main>
  );
}
