// PageTransition - wrap a page in this to make it fade and slide.
//
// Every motion animation has three moments:
//   initial -> how it looks before it appears
//   animate -> how it looks once it is on screen
//   exit    -> how it looks as it leaves (needs <AnimatePresence> in App.jsx)
import { motion } from "motion/react";

export default function PageTransition({ children, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
