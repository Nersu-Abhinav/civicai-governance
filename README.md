# CivicAI Governance — JanMitra

> **AI for Digital Public Infrastructure & Governance**
>
> A multilingual, multimodal civic intelligence platform that converts citizen voice, text, and photo inputs into structured, explainable, department-routed public-service insights.

[![Hackathon](https://img.shields.io/badge/Code%20for%20Communities-2.0-4285F4)](https://github.com/Nersu-Abhinav/civicai-governance)
[![Track 1](https://img.shields.io/badge/Track%201-DPI%20%26%20Governance-0F9D58)](https://github.com/Nersu-Abhinav/civicai-governance)
[![AI](https://img.shields.io/badge/AI-Gemini-8E75B2)](https://ai.google.dev/)
[![Backend](https://img.shields.io/badge/Backend-Firebase-FFCA28)](https://firebase.google.com/)

## The problem

Public-service teams receive large volumes of citizen requests through forms, calls, local representatives, social channels, and in-person visits. Reports can be multilingual, unstructured, duplicated, incomplete, and difficult to prioritize.

CivicAI addresses four bottlenecks:

- **Listen:** capture citizen reports through accessible digital channels.
- **Understand:** classify, summarize, translate, and extract useful facts.
- **Route:** recommend the responsible public-service department.
- **Prioritize:** surface urgency, service impact, recurrence, and affected areas with explainable signals.

## The solution

**CivicAI Governance (JanMitra)** is an AI-assisted civic intelligence layer between citizen inputs and public-service workflows.

### Citizen experience

1. Submit a report using text and optional photo evidence.
2. Choose an Indian language or use automatic detection.
3. Receive a structured AI analysis and tracking reference.

### AI intelligence layer

1. Detect language and intent.
2. Extract category, department, location, entities, and key facts.
3. Generate a concise summary.
4. Estimate priority using interpretable signals.
5. Recommend the responsible department.
6. Flag low-confidence cases for human review.
7. Support multimodal analysis when photo evidence is supplied.

### Governance view

Officials can use the dashboard to see priority queues, service-area workload, recent reports, and explainable AI signals. The design intentionally keeps humans responsible for final public-service decisions.

## Why Track 1

The project is designed specifically for **AI for Digital Public Infrastructure & Governance**. It demonstrates how a reusable AI layer can improve citizen-to-government intake, triage, service routing, accessibility, and operational visibility.

## Core features

| Module | Capability |
|---|---|
| Citizen Intake | Text, language, location and image evidence |
| Gemini Analysis | Structured civic classification and summarization |
| Multilingual AI | Indian-language input and language detection |
| Smart Routing | Department recommendation |
| Explainable Priority | High/Medium/Low plus supporting signals |
| Human Review | Low-confidence and sensitive cases are escalated |
| Firestore | Server-side civic-report persistence |
| Governance Dashboard | KPIs, queues, service areas and recent reports |
| Privacy Controls | No public Firestore access; API key stays server-side |
| PWA | Installable web-app metadata for mobile-friendly access |

## Architecture

```text
Citizen Browser / PWA
        |
        | HTTPS
        v
Firebase Hosting
        |
        | /api/analyzeIssue rewrite
        v
Cloud Functions for Firebase
        |
        +------ Google Gemini API
        |
        +------ Cloud Firestore
        |
        +------ Secret Manager (GEMINI_API_KEY)
```

The Gemini API key is never embedded in browser JavaScript. The Cloud Function owns the AI request and writes the structured result to Firestore. Firebase's current Functions configuration supports secret parameters through Secret Manager, and Firebase Hosting can route requests to serverless backends. citeturn1search0turn0search7

The current frontend uses the Google GenAI SDK-compatible backend design. Google's current Gemini documentation recommends `@google/genai` for JavaScript applications and supports structured generation and multimodal inputs. citeturn1search1turn1search3

## Repository structure

```text
civicai-governance/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── icon.svg
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── functions/
│   ├── index.js
│   ├── package.json
│   └── .gitignore
├── data/
│   └── sample-grievances.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEMO_SCRIPT.md
│   ├── DEPLOYMENT.md
│   ├── GEMINI_INTEGRATION.md
│   └── SUBMISSION_CHECKLIST.md
├── .github/
│   └── workflows/
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

## Run the prototype

```bash
git clone https://github.com/Nersu-Abhinav/civicai-governance.git
cd civicai-governance
python -m http.server 8000
```

Open `http://localhost:8000`.

The app automatically attempts `/api/analyzeIssue`. If the Firebase backend is not available, it safely falls back to deterministic synthetic analysis so the demo remains usable offline.

## Deploy the real AI backend

1. Create/select a Firebase project.
2. Enable Hosting, Cloud Functions, and Firestore.
3. Install the Firebase CLI and authenticate.
4. Install backend dependencies:

```bash
cd functions
npm install
cd ..
```

5. Store the Gemini key as a Firebase secret:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

6. Deploy:

```bash
firebase deploy --only hosting,functions,firestore
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the complete procedure and security checklist.

Firebase Hosting provides HTTPS and CDN-backed hosting, while Firebase App Hosting is an alternative for framework-based full-stack apps with GitHub-driven rollouts. citeturn0search0turn0search1

## Demo scenarios

### 1. Pothole safety report

> “There is a large pothole near the main junction in Ward 12 and two bikes nearly fell this morning.”

Expected result: Roads & Mobility → Roads Department → High priority, with safety and transport-disruption signals.

### 2. Water interruption

> “Our locality has had no water since yesterday morning.”

Expected result: Water Supply → Water Services → High priority, with essential-service impact.

### 3. Waste hotspot with photo

Submit a short waste-accumulation message and attach a photo. Gemini can use the multimodal input to improve the category/summary while the system still keeps the final decision with an authorized human reviewer.

## Responsible AI

### Human-in-the-loop

AI recommendations are advisory. Officials remain responsible for routing, escalation, and public-service action.

### Privacy by design

The public browser does not receive Firestore write permissions. Real deployments should minimize personal data, enforce retention/deletion policies, and keep public dashboards aggregated.

### Explainability

Priority is presented with understandable signals instead of an unexplained score.

### Safety

Low-confidence outputs should be escalated. The system must be evaluated for hallucinations, multilingual errors, bias, prompt injection, abusive content, and incorrect routing before real citizen data is used.

## Evaluation plan

Measure:

- classification accuracy
- routing accuracy
- multilingual quality
- priority consistency
- low-confidence escalation rate
- human correction rate
- AI latency
- accessibility/task completion time
- duplicate-cluster precision and recall once embeddings are added

## Roadmap

- [x] Track 1 product concept and positioning
- [x] Responsive citizen + official prototype
- [x] Synthetic civic dataset
- [x] Secure Gemini backend implementation
- [x] Firebase Hosting/Functions configuration
- [x] Firestore security baseline
- [x] Multimodal image input path
- [x] PWA metadata
- [ ] Create/connect Firebase project
- [ ] Add Gemini API secret and deploy
- [ ] Voice transcription and voice-first intake
- [ ] Official authentication and role-based access
- [ ] Duplicate detection with embeddings
- [ ] Geospatial hotspot visualization
- [ ] Evaluation dataset and benchmark report
- [ ] Production accessibility/security audit

## Hackathon submission

**Project:** CivicAI Governance — JanMitra  
**Track:** AI for Digital Public Infrastructure & Governance  
**Repository:** https://github.com/Nersu-Abhinav/civicai-governance

## Disclaimer

This is a hackathon prototype. It is not a substitute for official government systems, emergency services, or legally mandated grievance procedures. Any real deployment must comply with applicable law, public-sector security/procurement requirements, data-protection obligations, accessibility standards, and organizational policies.

---

**Build with AI. Build for communities. Build solutions that matter.**
