// Firebase errors come with a code like "auth/invalid-credential".
// This turns those codes into sentences a normal person understands.
const messages = {
  "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/popup-closed-by-user": "The Google window was closed before sign-in finished.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/unauthorized-domain": "This domain is not allowed to sign in. Add it in Firebase Authentication settings.",
  "auth/too-many-requests": "Too many attempts. Wait a minute, then try again.",
  "permission-denied": "The database refused access. Check that firestore.rules is published.",
};

export function friendlyError(error) {
  return messages[error?.code] || error?.message || "Something went wrong. Please try again.";
}
