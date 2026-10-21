# CarePortal: class guide

Teach the lessons in this order. Each one points to the files to open.

## Lesson 0: How the files fit together

```
index.html            <div id="root"> where React draws the app
src/main.jsx          starts React and wraps the app in Router + Auth + Motion
src/App.jsx           the map: which URL shows which page
src/firebase.js       connects to Firebase (Auth + Firestore)
src/auth/
  roles.js            the three roles and the ADMIN_EMAILS list
  AuthContext.jsx     sign up, sign in, sign out, load the role
  authErrors.js       turns Firebase error codes into plain English
src/components/
  ProtectedRoute.jsx  the guard in front of private pages
  PageTransition.jsx  fade + slide for every page
  Heartbeat.jsx       the animated ECG line
  AuthShell.jsx       layout shared by Sign in and Sign up
  FormBits.jsx        inputs, buttons, the error box
src/pages/
  Landing.jsx         the home page
  SignIn.jsx          sign-in form
  SignUp.jsx          sign-up form with the role picker
  Dashboard.jsx       admin, doctor and patient dashboards
firestore.rules       the real security, runs on Google's servers
```

## Lesson 1: Routing and `location` (App.jsx)

- `<Route path="/signin" element={<SignIn />} />` means: when the URL is
  `/signin`, show `SignIn`.
- `useLocation()` gives the current URL as an object, e.g.
  `{ pathname: "/signin" }`.
- `<Navigate to="/signin" />` is a redirect written as a component.

**Try it:** add a `/about` route that shows `<h1>About</h1>`.

## Lesson 2: Animation with Motion (formerly Framer Motion)

Put `motion.` in front of any HTML tag (`motion.div`, `motion.h1`) and it can animate.

| Idea | Where to look | What it does |
| --- | --- | --- |
| `initial` / `animate` | PageTransition.jsx | start state, then end state |
| `exit` + `AnimatePresence` | App.jsx, FormBits.jsx | animate something *before* it is removed |
| `key={location.pathname}` | App.jsx | a new key tells React "this is a new page", so the old one exits |
| `variants` + `staggerChildren` | Landing.jsx, Dashboard.jsx | the parent says "show", children appear one after another |
| `whileInView` | Landing.jsx (role cards) | animate when scrolled into view |
| `whileHover` / `whileTap` | role cards, SubmitButton | react to the mouse or a press |
| `repeat: Infinity` | Heartbeat.jsx, floating cards | loop forever |
| `pathLength` | Heartbeat.jsx | draw an SVG line from 0% to 100% |
| `layoutId` | SignUp.jsx (role picker) | the same id in a new place slides there smoothly |

**Try it:** in PageTransition.jsx change `y: 16` to `x: 60`. Pages now slide sideways.

## Lesson 3: Authentication (AuthContext.jsx)

Two questions, two Firebase products:

1. **Who are you?** Firebase **Authentication** checks the email and password
   (or Google) and gives back a `user` with a unique `uid`.
2. **What can you do?** Firestore stores a document at `users/{uid}` with the `role`.

The flow when someone signs up:

```
SignUp form  ->  signUp()  ->  createUserWithEmailAndPassword()
                                   |
                       onAuthStateChanged fires
                                   |
                 loadProfile(): users/{uid} exists?
                    no  -> create it with the role
                    yes -> read the role
                                   |
               setProfile() -> role is known -> redirect to /admin, /doctor or /patient
```

`onAuthStateChanged` is the single place that decides who is signed in.
It also runs when the page reloads, which is why users stay signed in.

**Try it:** sign up, then open Firebase Console -> Firestore -> `users` and
find your document.

## Lesson 4: Role-based access

| Role | How you get it |
| --- | --- |
| Admin | your email is in `ADMIN_EMAILS` (roles.js **and** firestore.rules) |
| Doctor | you pick it on the sign-up form |
| Patient | you pick it on the sign-up form; also the default for Google |

Three layers protect each page:

1. **SignUp.jsx** hides the role picker when an admin email is typed, so
   admin can never be picked by hand.
2. **ProtectedRoute.jsx** sends you away from pages that are not for your role.
3. **firestore.rules** refuses database requests that break the rules,
   even if someone edits the React code in their browser.

Layers 1 and 2 are for a good experience. Layer 3 is the real security.

**Try it:** sign in as a patient and type `/admin` in the address bar.
You get sent back to `/patient`.

## Setting up the admin account

1. In `src/auth/roles.js` **and** `firestore.rules`, replace
   `admin@careportal.com` with your email.
2. Publish the rules: Firebase Console -> Firestore -> Rules -> paste -> Publish.
3. Sign up with that email. The admin badge appears, and you land on `/admin`.

## Talking point: what a real clinic would do differently

In this project anyone can pick "Doctor". In a real clinic, new doctors would
sign up as pending, and an admin would approve them. An admin email list also
works best with verified emails: with email and password sign-up, whoever
registers the admin email first gets admin access. So create the admin
account yourself before you share the app.
