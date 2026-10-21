// AuthShell - the two-column layout shared by Sign in and Sign up.
// Left: a dark panel with the heartbeat. Right: whatever form we pass in.
import { motion } from "motion/react";
import PageTransition from "./PageTransition.jsx";
import Heartbeat from "./Heartbeat.jsx";
import Logo from "./Logo.jsx";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <PageTransition className="auth">
      <aside className="auth-panel">
        <Logo />
        <div className="auth-panel-body">
          <Heartbeat className="auth-ecg" />
          <p className="auth-quote">
            “I open one page in the morning and my whole day is already there.”
          </p>
          <p className="auth-quote-by">Example quote from a clinic doctor</p>
        </div>
        <ul className="auth-roles" aria-label="Roles">
          <li><span className="role-pill role-admin">Admin</span> recognised by email</li>
          <li><span className="role-pill role-doctor">Doctor</span> chosen at sign-up</li>
          <li><span className="role-pill role-patient">Patient</span> chosen at sign-up</li>
        </ul>
      </aside>

      <main className="auth-main">
        <motion.div
          className="auth-form-wrap"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </motion.div>
      </main>
    </PageTransition>
  );
}
