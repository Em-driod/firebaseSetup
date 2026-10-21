// Heartbeat - an ECG line that draws itself again and again.
//
// pathLength goes from 0 (nothing drawn) to 1 (the full line).
// repeat: Infinity makes it loop like a real heart monitor.
import { motion } from "motion/react";

const ECG_PATH =
  "M0 30 H70 L80 30 L87 14 L95 46 L103 8 L111 52 L118 30 H170 L180 30 L187 18 L195 42 L203 4 L211 54 L218 30 H300";

export default function Heartbeat({ className = "" }) {
  return (
    <svg className={`heartbeat ${className}`} viewBox="0 0 300 60" fill="none" aria-hidden="true">
      <path d={ECG_PATH} className="heartbeat-track" />
      <motion.path
        d={ECG_PATH}
        className="heartbeat-line"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
      />
    </svg>
  );
}
