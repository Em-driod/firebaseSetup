// Small pieces both forms use, so SignIn and SignUp stay short.
import { AnimatePresence, motion } from "motion/react";

export function Field({ id, label, ...inputProps }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} {...inputProps} />
    </label>
  );
}

// The error box slides open when there is a message and closes when it's gone.
// AnimatePresence is needed so the box can animate OUT before it is removed.
export function ErrorMessage({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="form-error"
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function GoogleButton({ onClick, disabled }) {
  return (
    <button className="btn btn-google" type="button" onClick={onClick} disabled={disabled}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
      </svg>
      Continue with Google
    </button>
  );
}

// A button that gently shrinks when pressed.
export function SubmitButton({ busy, children }) {
  return (
    <motion.button
      className="btn btn-primary btn-block"
      type="submit"
      disabled={busy}
      whileTap={{ scale: 0.97 }}
    >
      {busy ? "Please wait…" : children}
    </motion.button>
  );
}
