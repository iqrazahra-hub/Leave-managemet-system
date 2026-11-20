import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AppShell from "./layout/AppShell.jsx";
import { PORTALS } from "./data/nav.js";
import Login from "./pages/Login.jsx";
import { ForgotPassword, CheckEmail, ResetPassword } from "./pages/Auth.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import Requests from "./pages/Requests.jsx";
import LeaveCalendar from "./pages/LeaveCalendar.jsx";
import Profile from "./pages/Profile.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Approvals from "./pages/Approvals.jsx";
import Planner from "./pages/Planner.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import People from "./pages/People.jsx";
import Placeholder from "./pages/Placeholder.jsx";

// Which screen shows for each menu item. Path "" is the overview.
// To add a screen: build the page, then add it here (menu items live in data/nav.js).
const SCREENS = {
  employee: { "": EmployeeDashboard, apply: ApplyLeave, requests: Requests, calendar: LeaveCalendar, profile: Profile },
  manager: { "": ManagerDashboard, approvals: Approvals, planner: Planner, requests: Requests, profile: Profile },
  admin: { "": AdminDashboard, requests: Requests, people: People, calendar: LeaveCalendar, profile: Profile },
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {Object.entries(PORTALS).map(([portal, { nav }]) => (
        <Route key={portal} path={`/${portal}`} element={<ProtectedRoute portal={portal}><AppShell portal={portal} /></ProtectedRoute>}>
          {nav.map(([title, path]) => {
            const Screen = SCREENS[portal][path];
            return (
              <Route key={title} index={path === ""} path={path || undefined}
                element={Screen ? <Screen key={portal} /> : <Placeholder title={title} />} />
            );
          })}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
