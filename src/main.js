import { app } from "./firebase.js";

// If this logs the app name with no thrown error, env vars are wired correctly.
const statusEl = document.getElementById("status");
statusEl.textContent = `Connected to Firebase project: ${app.options.projectId}`;
