# CarePortal Firebase starter

This Vite app demonstrates Firebase email/password and Google sign-in, a
Firestore user profile, and different starter dashboards for admins, doctors,
and patients.

## Setup

1. Create/select a Firebase project and register a Web app.
2. In **Authentication -> Sign-in method**, enable **Email/Password** and
   **Google**. Add your development host under **Authentication -> Settings ->
   Authorized domains** if it is not already listed.
3. Create a **Cloud Firestore** database.
4. Copy `.env.example` to `.env` and fill in the web app configuration values
   from **Project settings -> General -> Your apps**. Do not commit `.env`.
5. Install and run the app:

   ```powershell
   npm install
   npm run dev
   ```

## How sign-in and roles work

- Users can create an account with a name, email, and password, sign in with
  email/password, or continue with Google. The Google button handles both a
  first-time signup and a later sign-in.
- A new user's Firestore profile is created at `users/{uid}` with the role
  `patient`. Signing up does not let a user select or assign a privileged role.
- After sign-in, the app reads the profile role and shows the corresponding
  admin, doctor, or patient dashboard.
- The dashboard cards are UI placeholders, not complete patient-management
  features. A role-based UI is not itself an access-control boundary; apply
  Firestore/Storage rules to every real data collection you add.
- An account with no profile is safely initialized as a patient. A profile
  with an unknown role is rejected rather than being given another dashboard.

## Publish the Firestore rules and initialize an admin

The included `firestore.rules` protects the user profiles:

- Users can create only their own `patient` profile.
- Users can read their own profile and change only their display name.
- Only an administrator can list profiles or change a profile's role.

Publish these rules in **Firebase Console -> Firestore Database -> Rules**.
Alternatively, use the Firebase CLI after setting up Firebase in the project:

```powershell
firebase deploy --only firestore:rules
```

To bootstrap the first administrator:

1. Sign up for your own account through the app. It will start as `patient`.
2. In **Firestore Database -> Data**, open the `users` collection and the
   document whose ID is your Firebase Authentication UID.
3. Change that document's `role` field to the string `admin`.
4. Sign out and sign in again. The admin dashboard should appear.

The Firebase Console is an administrative interface and can edit data outside
the client security rules. Keep project-owner access limited to trusted
administrators. Once an administrator exists, role changes can be made by an
authorized administrator in a trusted admin workflow. This starter does not
include a role-management screen or a server-side admin API.

## Important security boundaries

The role controls which dashboard this starter displays, and Firestore rules
protect the profile document. A hidden button or a different dashboard is not
security: when you add app data, write rules for those collections that check
the authenticated user's role and, where appropriate, their relationship to
the record. Never put Firebase service-account credentials or private server
secrets in the frontend.

The web SDK configuration in `.env` is included in the client bundle at build
time; it identifies the project and is not an authorization secret. `.env` is
gitignored to keep per-environment configuration out of source control.

## Project files

- `src/firebase.js`: one shared initialization point for Firebase Auth,
  Firestore, and Storage.
- `src/main.js`: signup, login, Google popup, profile creation, and role routing.
- `src/styles.css`: responsive sign-in and dashboard styling.
- `firestore.rules`: profile access rules; publish these to the Firebase
  project before using the profile features.
