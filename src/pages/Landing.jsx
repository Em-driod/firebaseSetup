// Landing.jsx - the public home page.
//
// MOTION IDEAS USED HERE
//   - "variants": named animation states ("hidden" / "show") that a parent
//     passes down to its children, so one line animates a whole group.
//   - "staggerChildren": children start one after another, not all at once.
//   - "whileInView": animate when the element scrolls into view.
//   - "whileHover": animate while the mouse is over it.
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PageTransition from "../components/PageTransition.jsx";
import Heartbeat from "../components/Heartbeat.jsx";
import Logo from "../components/Logo.jsx";

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const ROLES = [
  {
    role: "Admin",
    tag: "Recognised by email",
    text: "Sees every account in the clinic and how many doctors and patients are signed up.",
    points: ["All user accounts", "Doctor and patient totals", "Can change roles"],
  },
  {
    role: "Doctor",
    tag: "Chosen at sign-up",
    text: "Starts the day with the appointment list and the notes still waiting for a signature.",
    points: ["Today's appointments", "Notes to sign", "Patient follow-ups"],
  },
  {
    role: "Patient",
    tag: "Chosen at sign-up",
    text: "Sees the next visit, the latest readings and messages from the care team.",
    points: ["Next appointment", "Blood pressure history", "Messages"],
  },
];

const STEPS = [
  {
    title: "Create an account",
    text: "Sign up with email and password or with Google. Pick Patient or Doctor.",
  },
  {
    title: "Your role is recognised",
    text: "Admin emails are recognised automatically. Your role is saved in Firestore.",
  },
  {
    title: "Land on your dashboard",
    text: "The app reads your role and opens the page made for you, and only that page.",
  },
];

export default function Landing() {
  return (
    <PageTransition className="landing">
      <header className="nav">
        <div className="wrap nav-inner">
          <Logo />
          <nav className="nav-links" aria-label="Sections">
            <a href="#roles">Roles</a>
            <a href="#how">How it works</a>
          </nav>
          <div className="nav-actions">
            <Link className="btn btn-ghost" to="/signin">Sign in</Link>
            <Link className="btn btn-primary" to="/signup">Get started</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero-inner">
          <motion.div className="hero-copy" variants={group} initial="hidden" animate="show">
            <motion.p className="eyebrow" variants={rise}>
              <span className="pulse-dot" aria-hidden="true" /> Patient portal for small clinics
            </motion.p>
            <motion.h1 variants={rise}>
              One front door for the <span className="ink-teal">whole clinic.</span>
            </motion.h1>
            <motion.p className="lead" variants={rise}>
              Admins, doctors and patients sign in at the same place. CarePortal knows who
              each person is and opens the dashboard that fits their job.
            </motion.p>
            <motion.div className="hero-ctas" variants={rise}>
              <Link className="btn btn-primary btn-lg" to="/signup">Create your account</Link>
              <Link className="btn btn-outline btn-lg" to="/signin">I already have one</Link>
            </motion.div>
            <motion.ul className="hero-facts" variants={rise}>
              <li><strong>3</strong> roles</li>
              <li><strong>2</strong> ways to sign in</li>
              <li><strong>1</strong> secure database</li>
            </motion.ul>
          </motion.div>

          <HeroChart />
        </div>
      </section>

      <section className="section" id="roles">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Role-based access</p>
            <h2>Three people, three different screens.</h2>
          </div>
          <motion.div
            className="role-grid"
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {ROLES.map((item) => (
              <motion.article
                key={item.role}
                className="role-card"
                variants={rise}
                whileHover={{ y: -6 }}
              >
                <div className="role-card-top">
                  <h3>{item.role}</h3>
                  <span className="chip">{item.tag}</span>
                </div>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section section-tint" id="how">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2>From sign-up to the right dashboard.</h2>
          </div>
          <motion.ol
            className="steps"
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {STEPS.map((step, index) => (
              <motion.li key={step.title} className="step" variants={rise}>
                <span className="step-num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <Heartbeat className="cta-line" />
          <h2>Ready when your clinic is.</h2>
          <p>Create an account in under a minute.</p>
          <Link className="btn btn-light btn-lg" to="/signup">Get started</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <Logo />
          <p>A teaching project built with React, Firebase and Motion.</p>
        </div>
      </footer>
    </PageTransition>
  );
}

// The patient chart card on the right side of the hero.
function HeroChart() {
  return (
    <motion.div
      className="hero-visual"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="chart-card">
        <div className="chart-head">
          <div>
            <p className="chart-label">Patient chart · example</p>
            <p className="chart-name">Amara Okafor</p>
          </div>
          <span className="chip chip-live">
            <span className="pulse-dot" aria-hidden="true" /> Live
          </span>
        </div>
        <Heartbeat className="chart-ecg" />
        <dl className="vitals">
          <div>
            <dt>Heart rate</dt>
            <dd>72 <small>bpm</small></dd>
          </div>
          <div>
            <dt>Blood pressure</dt>
            <dd>118/76 <small>mmHg</small></dd>
          </div>
          <div>
            <dt>SpO₂</dt>
            <dd>98 <small>%</small></dd>
          </div>
        </dl>
      </div>

      {/* Two small cards that float gently up and down forever */}
      <motion.div
        className="float-card float-a"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="chart-label">Next visit</p>
        <p className="float-value">Thu 24 Oct · 09:15</p>
        <p className="float-sub">Dr. Bello, Room 3</p>
      </motion.div>
      <motion.div
        className="float-card float-b"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <p className="chart-label">Signed in as</p>
        <p className="float-value">
          <span className="role-pill role-doctor">Doctor</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
