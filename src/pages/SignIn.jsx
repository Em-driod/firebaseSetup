// SignIn.jsx
//
// FLOW
//   1. The user types email + password and presses "Sign in".
//   2. We call signIn() from AuthContext (Firebase checks the password).
//   3. Firebase fires onAuthStateChanged -> AuthContext loads the role.
//   4. As soon as `role` exists, this page redirects to that role's page.
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { ROLE_HOME } from "../auth/roles.js";
import AuthShell from "../components/AuthShell.jsx";
import { ErrorMessage, Field, GoogleButton, SubmitButton } from "../components/FormBits.jsx";

export default function SignIn() {
  const { user, role, authError, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Step 4: already signed in? Go straight to the right dashboard.
  if (user && role) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to open your dashboard.">
      <ErrorMessage message={error || authError} />

      <form className="form" onSubmit={handleSubmit}>
        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@clinic.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton busy={busy && !authError}>Sign in</SubmitButton>
      </form>

      <div className="divider"><span>or</span></div>
      <GoogleButton onClick={handleGoogle} disabled={busy && !authError} />

      <p className="switch">
        New to CarePortal? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
