// main.jsx is the entry point: it puts <App /> on the page.
//
// The order of the wrappers matters:
//   BrowserRouter -> gives every component access to the URL (location)
//   AuthProvider  -> gives every component access to the signed-in user
//   MotionConfig  -> reducedMotion="user" turns animations down for people
//                    who asked their operating system for less motion
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "./auth/AuthContext.jsx";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
