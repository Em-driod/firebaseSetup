# CarePortal Firebase starter

This React + Vite app demonstrates Firebase email/password and Google sign-in,
a Firestore user profile, role-based dashboards for admins, doctors and
patients, and page animations with Motion (formerly Framer Motion).

See `TEACHING.md` for a lesson-by-lesson guide to the code.

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

- The landing page (`/`) links to sign up (`/signup`) and sign in (`/signin`).
- Users can create an account with a name, email and password, or continue
  with Google. On sign-up they choose **Patient** or **Doctor**.
- **Admin cannot be chosen.** An email listed in `ADMIN_EMAILS`
  (`src/auth/roles.js`) is recognised as admin automatically. The same list
  is in `firestore.rules`; keep the two in sync.
- The profile is stored at `users/{uid}` with the role. After sign-in the app
  reads the role and redirects to `/admin`, `/doctor` or `/patient`.
- The admin dashboard lists every user profile from Firestore. The doctor and
  patient dashboards show example data.

## Publish the Firestore rules and create the admin

1. Replace `admin@careportal.com` with your email in both
   `src/auth/roles.js` and `firestore.rules`.
2. Publish the rules in **Firebase Console -> Firestore Database -> Rules**,
   or with `firebase deploy --only firestore:rules`.
3. Sign up with that email. The form shows "Admin email recognised" and you
   land on the admin dashboard.

The rules let users create only their own profile, as doctor or patient, or
as admin when their email is on the admin list. Users can change only their
own display name. Only an admin can list profiles or change a role.

With email/password sign-up, whoever registers an admin email first gets
admin access, so create the admin account before sharing the app. In a real
clinic, doctors should be approved by an admin instead of choosing the role
themselves.

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

- `src/App.jsx`: all routes, with `useLocation()` and `AnimatePresence` for
  page transitions.
- `src/main.jsx`: starts React with the router, auth provider and Motion config.
- `src/firebase.js`: one shared initialization point for Firebase.
- `src/auth/`: roles and admin emails, the auth context, and error messages.
- `src/components/`: route guard, page transition, heartbeat line, form parts.
- `src/pages/`: landing, sign in, sign up and the role dashboards.
- `src/styles.css`: all styling, with light and dark colours.
- `firestore.rules`: profile access rules; publish these before using the app.
- `TEACHING.md`: the class guide.
