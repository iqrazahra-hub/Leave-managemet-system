import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Guards a portal: you must be signed in, and your role must match the portal.
// HR admins may open every portal; everyone else only their own.
export default function ProtectedRoute({ portal, children }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role !== portal && role !== "admin") return <Navigate to={`/${role}`} replace />;
  return children;
}
