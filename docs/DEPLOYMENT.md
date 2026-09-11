# CivicAI Governance — Deployment Guide

## Architecture

```text
Browser / PWA
     |
     | HTTPS /api/analyzeIssue
     v
Firebase Hosting
     |
     v
Cloud Functions for Firebase (asia-south1)
     |
     +---- Google Gemini API
     |
     +---- Cloud Firestore
```

The browser never receives the Gemini API key. The Cloud Function reads `GEMINI_API_KEY` from Firebase Secret Manager.

## 1. Create a Firebase project

Create or select a Firebase project in the Firebase console and enable:

- Firebase Hosting
- Cloud Functions
- Cloud Firestore
- Secret Manager when prompted by Functions deployment

For Functions/Cloud Run-backed deployment, use a billing-enabled Firebase/Google Cloud project as required by the current Firebase product setup.

## 2. Install the Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

Select the Firebase project you created.

## 3. Install backend dependencies

```bash
cd functions
npm install
cd ..
```

## 4. Configure the Gemini secret

Create the secret through Firebase/Cloud Secret Manager or the Firebase CLI:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Paste your Gemini API key when prompted. **Never commit the key to GitHub.**

The backend defaults to the current Gemini Flash model configured in `functions/index.js`. If you want to change it, configure the `GEMINI_MODEL` parameter during deployment.

## 5. Deploy

From the repository root:

```bash
firebase deploy --only hosting,functions,firestore
```

Firebase Hosting will provide a secure `web.app`/`firebaseapp.com` URL. The `/api/analyzeIssue` path is rewritten to the Gemini-backed Cloud Function.

## 6. Test the backend

Open the deployed app and submit a sample report such as:

> There is a large pothole near the main junction in Ward 12 and two bikes nearly fell this morning.

Expected output should include a category, department recommendation, priority, language, confidence, explanation, and human-review signal.

Health endpoint:

```text
/api/health
```

## 7. Local development

For the static fallback prototype, simply serve the root directory:

```bash
python -m http.server 8000
```

The app will fall back to local synthetic analysis if `/api/analyzeIssue` is unavailable.

For full Firebase emulation, initialize the Firebase Local Emulator Suite and run the Functions/Hosting emulators using the Firebase CLI.

## Security checklist

- Never put `GEMINI_API_KEY` in `app.js`, HTML, CSS, GitHub Actions logs, or a public `.env` file.
- Keep Firestore client reads/writes disabled until an authenticated official workflow is implemented.
- Use synthetic data for the public demo.
- Do not expose personally identifiable information on the dashboard.
- Add authentication and role-based access control before real government use.
- Review retention, deletion, consent, accessibility, and applicable Indian data-protection/public-sector requirements before production use.
- Treat Gemini output as advisory and keep authorized humans responsible for public-service decisions.
