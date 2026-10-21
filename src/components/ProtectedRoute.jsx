// ProtectedRoute - the "security guard" in front of a private page.
//
// It asks three questions, in order:
//   1. Is Firebase still checking?      -> show a loader
//   2. Is anyone signed in?             -> if not, go to /signin
//   3. Is their role on the allow list? -> if not, send them to their own page
//
// Remember: this only hides pages in the browser. The real protection is
// firestore.rules, which runs on Google's servers.
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ROLE_HOME } from "../auth/roles.js";
import Heartbeat from "./Heartbeat.jsx";

export default function ProtectedRoute({ allow, children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader" role="status">
        <Heartbeat className="loader-line" />
        <p>Checking your access…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }

  return children;
}
