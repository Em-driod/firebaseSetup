# Firebase setup

Shared Firebase config for the frontend team. Config values live in `.env`
(gitignored) instead of hardcoded in source, so each dev/environment can
point at a different Firebase project without touching code.

## First-time setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with the values from **Firebase Console -> Project Settings ->
General -> Your apps -> SDK setup and configuration**.

```bash
npm run dev
```

Open the printed local URL - it should say "Connected to Firebase project: ..."
with no errors. If it throws "Missing Firebase config values", `.env` isn't
filled in yet.

## Using it in your own code

```js
import { auth, db, storage } from "./src/firebase.js";
import { collection, addDoc } from "firebase/firestore";

await addDoc(collection(db, "tasks"), { text: "example", done: false });
```

Only ever import `app`/`auth`/`db`/`storage` from `src/firebase.js` -
never call `initializeApp()` a second time somewhere else.

## Rules, not secrets

The values in `.env` (apiKey, projectId, etc.) identify your Firebase
project - they are not secret and will be visible in the shipped JS bundle
either way. Keeping them in `.env` is about not hardcoding
per-environment values in source and not leaking them into `git log`
by accident, not about hiding them from users.

**Actual access control belongs in Firestore/Storage Security Rules**
(Firebase Console -> Firestore/Storage -> Rules). Don't rely on the config
being private.
