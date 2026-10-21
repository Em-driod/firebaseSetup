// Dashboard.jsx - one layout, three different contents.
//
// App.jsx renders <Dashboard role="admin" />, "doctor" or "patient".
// ProtectedRoute has already checked the role before we get here.
//
// The admin view reads REAL data: every document in the "users" collection.
// firestore.rules allows that list only for admins, so if a patient tried
// the same query, Firebase would refuse it.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { ROLE_LABEL } from "../auth/roles.js";
import PageTransition from "../components/PageTransition.jsx";
import Logo from "../components/Logo.jsx";

// Example content for doctor and patient. Swap these for real data later.
const CONTENT = {
  doctor: {
    heading: "Here's your clinic day.",
    stats: [
      { label: "Patients today", value: "12" },
      { label: "Next visit", value: "10:30" },
      { label: "Notes to sign", value: "3" },
    ],
    listTitle: "Today's appointments",
    list: [
      { main: "Amara Okafor", sub: "Blood pressure review", side: "10:30" },
      { main: "Tunde Adeyemi", sub: "Follow-up, knee", side: "11:15" },
      { main: "Grace Mensah", sub: "New patient", side: "13:00" },
      { main: "Ifeanyi Eze", sub: "Lab results", side: "14:45" },
    ],
  },
  patient: {
    heading: "Your care, in one place.",
    stats: [
      { label: "Next appointment", value: "Thu 24 Oct" },
      { label: "Last blood pressure", value: "118/76", unit: "mmHg" },
      { label: "New messages", value: "2" },
    ],
    listTitle: "Recent readings",
    list: [
      { main: "Blood pressure", sub: "Mon 14 Oct", side: "118/76 mmHg" },
      { main: "Heart rate", sub: "Mon 14 Oct", side: "72 bpm" },
      { main: "Blood pressure", sub: "Mon 30 Sep", side: "124/80 mmHg" },
      { main: "Weight", sub: "Mon 30 Sep", side: "68 kg" },
    ],
  },
};

// Parent + child variants so the cards appear one after another.
const group = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard({ role }) {
  const { user, profile, logOut } = useAuth();
  const navigate = useNavigate();
  const firstName = (profile?.displayName || user?.email || "").split(" ")[0];

  async function handleSignOut() {
    await logOut();
    navigate("/");
  }

  return (
    <PageTransition className="dash">
      <header className="dash-bar">
        <div className="wrap dash-bar-inner">
          <Logo to="/" />
          <div className="dash-user">
            <span className={`role-pill role-${role}`}>{ROLE_LABEL[role]}</span>
            <span className="dash-email">{user?.email}</span>
            <button className="btn btn-outline btn-sm" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="wrap dash-main">
        <p className="eyebrow">{ROLE_LABEL[role]} dashboard</p>
        <h1>Hello, {firstName}.</h1>
        {role === "admin" ? <AdminView /> : <ExampleView content={CONTENT[role]} />}
      </main>
    </PageTransition>
  );
}

function ExampleView({ content }) {
  return (
    <>
      <p className="lead">{content.heading}</p>
      <motion.div className="stat-grid" variants={group} initial="hidden" animate="show">
        {content.stats.map((stat) => (
          <motion.div key={stat.label} className="stat" variants={rise}>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">
              {stat.value} {stat.unit && <small>{stat.unit}</small>}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <section className="panel">
        <div className="panel-head">
          <h2>{content.listTitle}</h2>
          <span className="chip">Example data</span>
        </div>
        <motion.ul className="rows" variants={group} initial="hidden" animate="show">
          {content.list.map((row) => (
            <motion.li key={row.main + row.sub} className="row" variants={rise}>
              <div>
                <p className="row-main">{row.main}</p>
                <p className="row-sub">{row.sub}</p>
              </div>
              <span className="row-side">{row.side}</span>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </>
  );
}

function AdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs once when the admin page opens: read every user profile.
  useEffect(() => {
    getDocs(collection(db, "users"))
      .then((snapshot) => setUsers(snapshot.docs.map((d) => d.data())))
      .catch((err) => setError(friendlyError(err)))
      .finally(() => setLoading(false));
  }, []);

  const count = (role) => users.filter((u) => u.role === role).length;
  const stats = [
    { label: "All accounts", value: users.length },
    { label: "Doctors", value: count("doctor") },
    { label: "Patients", value: count("patient") },
  ];

  return (
    <>
      <p className="lead">Everyone who has signed up to the clinic portal.</p>
      <motion.div className="stat-grid" variants={group} initial="hidden" animate="show">
        {stats.map((stat) => (
          <motion.div key={stat.label} className="stat" variants={rise}>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{loading ? "–" : stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <section className="panel">
        <div className="panel-head">
          <h2>User accounts</h2>
          <span className="chip chip-live">
            <span className="pulse-dot" aria-hidden="true" /> From Firestore
          </span>
        </div>
        {error && <p className="form-error">{error}</p>}
        {loading && <p className="muted panel-note">Loading accounts…</p>}
        {!loading && !error && users.length === 0 && (
          <p className="muted panel-note">No accounts yet.</p>
        )}
        <motion.ul className="rows" variants={group} initial="hidden" animate="show" key={users.length}>
          {users.map((u) => (
            <motion.li key={u.uid} className="row" variants={rise}>
              <div>
                <p className="row-main">{u.displayName || "No name"}</p>
                <p className="row-sub">{u.email}</p>
              </div>
              <span className={`role-pill role-${u.role}`}>{ROLE_LABEL[u.role] || u.role}</span>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </>
  );
}
