// App.jsx is the map of the whole app: which URL shows which page.
//
// LESSON 1 - useLocation()
//   `location` is an object describing the current URL, for example
//   { pathname: "/signin" }. It changes every time the user moves to
//   another page.
//
// LESSON 2 - Page animations
//   <AnimatePresence> can only animate a page *out* if it knows the page
//   is leaving. We give <Routes> the current location and use
//   location.pathname as its `key`. When the path changes, the key changes,
//   so React treats it as a new page: the old one plays its `exit`
//   animation, then the new one plays its `initial -> animate` animation.
//   mode="wait" means "finish the exit before starting the enter".
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public pages: anyone can open these */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private pages: ProtectedRoute checks the user's role first */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Dashboard role="admin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allow={["doctor"]}>
              <Dashboard role="doctor" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute allow={["patient"]}>
              <Dashboard role="patient" />
            </ProtectedRoute>
          }
        />

        {/* Any unknown URL goes back to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
