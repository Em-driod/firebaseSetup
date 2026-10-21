// SignUp.jsx
//
// What's special here:
//   - The user picks a role: Patient or Doctor.
//   - If they type an ADMIN email, the role picker disappears and a badge
//     says "Admin email recognised". Admin can never be picked by hand.
//   - The sliding highlight behind the chosen role uses `layoutId`:
//     motion sees the same layoutId in a new place and animates it there.
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { isAdminEmail, ROLE_HOME } from "../auth/roles.js";
import AuthShell from "../components/AuthShell.jsx";
import { ErrorMessage, Field, GoogleButton, SubmitButton } from "../components/FormBits.jsx";

const ROLE_OPTIONS = [
  { value: "patient", title: "Patient", text: "Book visits, see readings" },
  { value: "doctor", title: "Doctor", text: "Appointments and notes" },
];

export default function SignUp() {
  const { user, role, authError, signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // This updates on every key press, so the badge appears while typing.
  const adminDetected = isAdminEmail(email);

  if (user && role) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle(selectedRole);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <ErrorMessage message={error || authError} />

      <form className="form" onSubmit={handleSubmit}>
        <Field
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Amara Okafor"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Show EITHER the admin badge OR the role picker */}
        <AnimatePresence mode="wait" initial={false}>
          {adminDetected ? (
            <motion.div
              key="admin"
              className="admin-badge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <span className="role-pill role-admin">Admin</span>
              <span>Admin email recognised. You'll get the admin dashboard.</span>
            </motion.div>
          ) : (
            <motion.fieldset
              key="picker"
              className="role-field"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <legend>I am a</legend>
              <div className="role-picker" role="radiogroup">
                {ROLE_OPTIONS.map((option) => {
                  const isChosen = selectedRole === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      className={`role-option ${isChosen ? "is-chosen" : ""}`}
                      onClick={() => setSelectedRole(option.value)}
                    >
                      {isChosen && (
                        <motion.span
                          layoutId="role-highlight"
                          className="role-highlight"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="role-option-title">{option.title}</span>
                      <span className="role-option-text">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>

        <SubmitButton busy={busy && !authError}>Create account</SubmitButton>
      </form>

      <div className="divider"><span>or</span></div>
      <GoogleButton onClick={handleGoogle} disabled={busy && !authError} />

      <p className="switch">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}
