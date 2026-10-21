// AuthContext.jsx - the "brain" of authentication.
//
// THE BIG IDEA
//   1. Firebase Authentication answers: "WHO is this person?"  (email + uid)
//   2. Firestore (users/{uid} document) answers: "WHAT can they do?" (role)
//
// A React Context lets any component ask for the user with one line:
//   const { user, role, signIn } = useAuth();
// instead of passing props through every component.
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { isAdminEmail } from "./roles.js";
import { friendlyError } from "./authErrors.js";

const AuthContext = createContext(null);

// Firebase tells us "a user signed in" the moment an account is created,
// before the sign-up form has finished. So the form writes the name and
// role it collected here first, and loadProfile() reads them when it
// creates the profile.
let pendingSignUp = { name: "", role: "patient" };

// Reads users/{uid}. If it doesn't exist yet (brand-new account), creates it.
async function loadProfile(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const profile = snapshot.data();
    // An admin email is always admin, whatever the document says.
    return isAdminEmail(firebaseUser.email) ? { ...profile, role: "admin" } : profile;
  }

  const newProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: pendingSignUp.name || firebaseUser.displayName || "",
    // Admin is recognised by email. Everyone else gets the role they picked.
    role: isAdminEmail(firebaseUser.email) ? "admin" : pendingSignUp.role,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, newProfile);
  pendingSignUp = { name: "", role: "patient" };
  return newProfile;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user, or null
  const [profile, setProfile] = useState(null); // Firestore profile with role
  const [loading, setLoading] = useState(true); // true until Firebase answers once
  const [authError, setAuthError] = useState("");

  // onAuthStateChanged runs on page load AND every time someone signs in
  // or out. It is the single place where we decide who is signed in.
  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await loadProfile(firebaseUser);
        setAuthError("");
        setUser(firebaseUser);
        setProfile(userProfile);
      } catch (error) {
        // No valid profile means no access, so sign them back out.
        setAuthError(friendlyError(error));
        await signOut(auth);
      } finally {
        setLoading(false);
      }
    });
    return stopListening; // stop listening when the app closes
  }, []);

  // ---- Actions the pages can call ----

  async function signUp({ name, email, password, role }) {
    setAuthError("");
    pendingSignUp = { name, role };
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
  }

  async function signIn(email, password) {
    setAuthError("");
    await signInWithEmailAndPassword(auth, email, password);
  }

  // The same Google button works for new and returning users.
  // `role` is only used if this Google account is new.
  async function signInWithGoogle(role = "patient") {
    setAuthError("");
    pendingSignUp = { name: "", role };
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logOut() {
    await signOut(auth);
  }

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    authError,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
