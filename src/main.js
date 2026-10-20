import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import "./styles.css";

const authView = document.getElementById("auth-view");
const dashboardView = document.getElementById("dashboard-view");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authDescription = document.getElementById("auth-description");
const authMessage = document.getElementById("auth-message");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit-button");
const googleButton = document.getElementById("google-button");
const switchCopy = document.getElementById("switch-copy");
const switchModeButton = document.getElementById("switch-mode");
const signOutButton = document.getElementById("signout-button");
const accountEmail = document.getElementById("account-email");
const roleLabel = document.getElementById("role-label");
const dashboardTitle = document.getElementById("dashboard-title");
const dashboardDescription = document.getElementById("dashboard-description");
const dashboardCards = document.getElementById("dashboard-cards");

const googleProvider = new GoogleAuthProvider();
const roles = {
  admin: {
    label: "ADMINISTRATOR DASHBOARD",
    title: "Your overview",
    description: "Manage the care team and keep the portal running smoothly.",
    cards: [
      ["Team access", "Review team roles and coordinate access to the portal."],
      ["People", "A starting point for managing doctor and patient records."],
      ["Portal settings", "A place for organization-wide settings and workflows."],
    ],
  },
  doctor: {
    label: "DOCTOR DASHBOARD",
    title: "Your clinical workspace",
    description: "A focused workspace for your care team and patient workflow.",
    cards: [
      ["My patients", "Connect this section to the patients assigned to your care."],
      ["Appointments", "Add your appointment schedule and visit workflow here."],
      ["Care notes", "Build a secure workflow for clinical notes and follow-ups."],
    ],
  },
  patient: {
    label: "PATIENT DASHBOARD",
    title: "Your care, in one place",
    description: "View your care information and stay connected with your team.",
    cards: [
      ["My care team", "Show the doctors and care providers supporting you."],
      ["Appointments", "Connect this section to your upcoming appointments."],
      ["My information", "Add a secure place to review your personal details."],
    ],
  },
};

let mode = "login";

function setMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle("notice-error", isError);
  authMessage.classList.toggle("notice-success", !isError);
  authMessage.hidden = !message;
}

function authErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed before sign-in finished.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow pop-ups and try again.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/unauthorized-domain": "This domain is not authorized for sign-in. Add it in Firebase Authentication settings.",
    "permission-denied": "Firebase denied access to the user profile. Check that the Firestore rules are published.",
  };
  return messages[error.code] || error.message || "Something went wrong. Please try again.";
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  googleButton.disabled = isBusy;
  switchModeButton.disabled = isBusy;
  submitButton.textContent = isBusy
    ? "Please wait..."
    : mode === "login"
      ? "Sign in"
      : "Create account";
}

function setMode(nextMode) {
  mode = nextMode;
  const isSignup = mode === "signup";
  authTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  authDescription.textContent = isSignup
    ? "Create an account to get started."
    : "Sign in to continue to your dashboard.";
  nameField.hidden = !isSignup;
  nameInput.required = isSignup;
  passwordInput.autocomplete = isSignup ? "new-password" : "current-password";
  switchCopy.textContent = isSignup ? "Already have an account?" : "New to CarePortal?";
  switchModeButton.textContent = isSignup ? "Sign in" : "Create an account";
  setMessage("");
  setBusy(false);
}

async function ensureUserProfile(user, preferredName = "") {
  const profileRef = doc(db, "users", user.uid);
  const displayName = preferredName || user.displayName || "";

  return runTransaction(db, async (transaction) => {
    const profileSnapshot = await transaction.get(profileRef);
    if (!profileSnapshot.exists()) {
      transaction.set(profileRef, {
        uid: user.uid,
        email: user.email || "",
        displayName,
        role: "patient",
        createdAt: serverTimestamp(),
      });
      return { role: "patient" };
    }

    const profile = profileSnapshot.data();
    if (!roles[profile.role]) {
      throw new Error("This account has no valid role. Ask an administrator to review it.");
    }
    if (preferredName && !profile.displayName) {
      transaction.update(profileRef, { displayName: preferredName });
    }
    return profile;
  });
}

function showDashboard(user, profile) {
  const dashboard = roles[profile.role];
  if (!dashboard) {
    throw new Error("This account has no valid role. Ask an administrator to review it.");
  }

  accountEmail.textContent = user.email || "Signed in with Google";
  roleLabel.textContent = dashboard.label;
  dashboardTitle.textContent = dashboard.title;
  dashboardDescription.textContent = dashboard.description;
  dashboardCards.replaceChildren(
    ...dashboard.cards.map(([title, description]) => {
      const card = document.createElement("article");
      card.className = "dashboard-card";
      const heading = document.createElement("h2");
      heading.textContent = title;
      const copy = document.createElement("p");
      copy.textContent = description;
      card.append(heading, copy);
      return card;
    })
  );
  authView.hidden = true;
  dashboardView.hidden = false;
}

function showAuth() {
  dashboardView.hidden = true;
  authView.hidden = false;
}

switchModeButton.addEventListener("click", () => {
  setMode(mode === "login" ? "signup" : "login");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");
  setBusy(true);

  try {
    if (mode === "signup") {
      const credential = await createUserWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value
      );
      const displayName = nameInput.value.trim();
      await updateProfile(credential.user, { displayName });
      await ensureUserProfile(credential.user, displayName);
    } else {
      await signInWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value
      );
    }
  } catch (error) {
    setMessage(authErrorMessage(error), true);
    setBusy(false);
  }
});

googleButton.addEventListener("click", async () => {
  setMessage("");
  setBusy(true);
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    await ensureUserProfile(credential.user);
  } catch (error) {
    setMessage(authErrorMessage(error), true);
    setBusy(false);
  }
});

signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  try {
    await signOut(auth);
  } catch (error) {
    dashboardDescription.textContent = authErrorMessage(error);
  } finally {
    signOutButton.disabled = false;
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showAuth();
    setBusy(false);
    return;
  }

  authView.hidden = true;
  dashboardView.hidden = false;
  dashboardTitle.textContent = "Loading your dashboard...";
  dashboardDescription.textContent = "";

  try {
    const profile = await ensureUserProfile(user);
    showDashboard(user, profile);
  } catch (error) {
    showAuth();
    setMessage(authErrorMessage(error), true);
    try {
      await signOut(auth);
    } catch (signOutError) {
      setMessage(
        `${authErrorMessage(error)} Sign-out also failed: ${authErrorMessage(signOutError)}`,
        true
      );
    }
  }
});
