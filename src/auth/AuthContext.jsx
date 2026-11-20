import { createContext, useContext, useState } from "react";
import * as db from "../data/users.js";

/**
 * Who is signed in. The session stores only the user's id; the user's details
 * (name, role, status) are always read fresh from the user database, so if an
 * admin disables an account or changes a role, it takes effect straight away.
 *
 * Backend later: replace the db.* calls in login / changePassword / resetPassword
 * with API requests. The rest of the app only uses what this context exposes.
 */
const KEY = "lms_session";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const storedId = () => localStorage.getItem(KEY) || sessionStorage.getItem(KEY);

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(storedId);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1); // re-read users after an edit

  const found = sessionId ? db.findById(sessionId) : null;
  const user = found && found.status === "active" ? found : null;

  async function login(email, password, remember) {
    const u = await db.authenticate(email, password);
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    (remember ? localStorage : sessionStorage).setItem(KEY, u.id);
    setSessionId(u.id);
    return u.role;
  }

  function logout() {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    setSessionId(null);
  }

  const value = {
    user, role: user?.role ?? null, name: user?.name ?? "", loading: false,
    login, logout, refresh,
    updateProfile: (patch) => { db.updateUser(user.id, patch); refresh(); },
    changePassword: (current, next) => db.changePassword(user.id, current, next),
    resetPassword: async () => {}, // TODO (backend): send the reset email
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
