# FTGM Premium Course Platform

Pure HTML / CSS / JS. No build step. Runs directly from any static host (or by opening `index.html` after serving via a local web server — required because ES modules don't work from `file://`).

## Files

```
index.html      → session router (redirects to admin / creator / login)
login.html      → shared login for Super Admin & Creators
admin.html      → Super Admin dashboard (UID BCggZZxfjagRMveRQi6ogMrK7c53)
creator.html    → Creator studio (courses, students, license keys, notifications)
student.html    → Public student panel. Open with ?c=<CREATOR_UID>
assets/
  firebase.js   → Firebase v10 modular init (project: salman-drm)
  theme.css     → Premium glassmorphism SaaS theme
  ui.js         → Toasts, modals, confirm, skeleton, helpers
```

## Firebase setup (already wired to `salman-drm`)

1. In the Firebase console for `salman-drm`, enable:
   - **Authentication → Email/Password**
   - **Authentication → Anonymous** (used by the public student panel so it can read/write Firestore under the "auth != null" rules)
2. Firestore rules (as supplied):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if request.auth != null; }
     }
   }
   ```
3. The **Super Admin** is the account with UID `BCggZZxfjagRMveRQi6ogMrK7c53`. Create that user in Firebase Auth once (email + password) — that UID is what `salman-drm` will issue.

## Data model

```
admin/config              { panelTitle, announcement, footerText, footerButtons[], footerLinks[] }
creators/{uid}            { name, email, status, expiryDate, createdAt, settings }
creators/{uid}/courses/{cid}
                          { title, description, image, price, redirect, videoUrl?, active, createdAt }
creators/{uid}/courses/{cid}/licenseKeys/{kid}
                          { key, used, deviceId, studentEmail, activatedAt }
creators/{uid}/students/{sid}
                          { name, email, blocked, deviceId, activatedCourses, createdAt }
notifications/{nid}       { title, body, createdAt, target:'all'|'one', creatorId?, readBy[] }
```

No passwords are ever stored in Firestore.

## Roles & flow

- **Super Admin**: create/edit/delete/block creators, extend expiry (7/15/30/90/365/Unlimited), send notifications to one/many/all, edit panel title, announcement, footer text/buttons/links; see all students, courses and license keys.
- **Creator**: manage their courses, generate license keys, manage their students, receive notifications, change password, share their student panel URL.
- **Student**: opens `student.html?c=<creator_uid>`, sees the creator's active courses, clicks *Get Course*, enters a license key + email, unlocks (one device only). *Buy Now* opens the course's redirect URL.

## Video player

`student.html` picks a player based on the course URL (`videoUrl` field, or falls back to `redirect`):
- Google Drive link → embedded Drive preview
- YouTube link → YouTube embed with autoplay
- Direct file (`.mp4/.webm/.ogg/.m3u8`) → premium custom player with fullscreen, playback speed, resume progress, loading spinner, PiP, and keyboard shortcuts (`space` play/pause, `←/→` seek 5s, `f` fullscreen, `m` mute).

## Running locally

```
cd ftgm
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying

Upload the `ftgm/` folder to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting, Cloudflare Pages, etc.). No environment variables needed — the config is public (Firebase web keys are safe to expose; Firestore rules enforce access).