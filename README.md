# CivicAI Governance — JanMitra

> **AI for Digital Public Infrastructure & Governance**
>
> A multilingual, multimodal civic intelligence platform that converts citizen voice, text, and photo inputs into structured, prioritized, department-routed public-service insights.

[![Track](https://img.shields.io/badge/Hackathon-Code%20for%20Communities%202.0-4285F4)](https://github.com/Nersu-Abhinav/civicai-governance)
[![Track 1](https://img.shields.io/badge/Track%201-Digital%20Public%20Infrastructure%20%26%20Governance-0F9D58)](https://github.com/Nersu-Abhinav/civicai-governance)
[![Status](https://img.shields.io/badge/Status-Prototype%20in%20Development-F4B400)](https://github.com/Nersu-Abhinav/civicai-governance)

## 1. The Problem

Government teams receive large volumes of citizen requests through forms, phone calls, local representatives, social channels, and in-person visits. The information is often unstructured, multilingual, duplicated, incomplete, or difficult to prioritize.

This creates four bottlenecks:

- **Listen:** citizen voices are fragmented across channels.
- **Understand:** free-form messages need classification and summarization.
- **Route:** requests must reach the appropriate department or service owner.
- **Prioritize:** officials need an evidence-based view of urgency, volume, location, and recurring issues.

## 2. Our Solution

**CivicAI Governance (JanMitra)** acts as an AI-assisted civic intelligence layer between citizen inputs and public-service workflows.

### Citizen side

1. Submit a complaint/request using **text, voice, or photo**.
2. Select or automatically detect the preferred Indian language.
3. Receive a simple confirmation and tracking reference.

### AI intelligence layer

1. Detect language and intent.
2. Extract location, category, entities, and key facts.
3. Summarize the request.
4. Estimate urgency and citizen-impact level.
5. Detect probable duplicates and recurring issues.
6. Recommend the responsible department/service.
7. Produce explainable priority signals rather than opaque scores.

### Governance dashboard

Officials can view:

- priority queues
- issue hotspots
- category trends
- unresolved/aging requests
- duplicate clusters
- department workload
- citizen-impact indicators
- AI-generated situation summaries

The objective is **decision support, not autonomous government decision-making**. Human officials remain responsible for final action.

## 3. Why This Fits Track 1

Code for Communities 2.0 describes Track 1 as **AI for Digital Public Infrastructure & Governance**, focused on improving public services, governance systems, citizen experiences, and digital infrastructure efficiency. CivicAI directly targets those areas through a reusable AI layer for citizen-to-government workflows. citehttps://gdg.community.dev/events/details/google-gdg-cloud-udaipur-presents-build-with-ai-code-for-communities-20-udaipur-edition/

## 4. Core Features

| Module | Capability |
|---|---|
| Citizen Intake | Text, voice, photo and location input |
| Multilingual AI | Language detection, translation and simple summaries |
| Classification | Issue category, intent and entities |
| Smart Routing | Department/service recommendation |
| Priority Engine | Urgency + impact + affected population + recurrence |
| Duplicate Detection | Groups similar complaints into issue clusters |
| Governance Dashboard | KPIs, trends, hotspots and workload |
| Explainability | Shows why an item received its priority/routing recommendation |
| Human Review | Officials can edit, approve, re-route or reject AI suggestions |
| Audit Trail | Records AI recommendation, human action and status changes |

## 5. Proposed User Journey

```text
Citizen
  │
  ├── Text / Voice / Photo / Location
  │
  ▼
CivicAI Intake
  │
  ▼
Google AI / Gemini
  │
  ├── Language + Intent
  ├── Category + Entities
  ├── Summary
  ├── Priority signals
  └── Department recommendation
  │
  ▼
Validation + Duplicate Detection
  │
  ▼
Human Review Queue
  │
  ├── Approve
  ├── Re-route
  ├── Request information
  └── Resolve
  │
  ▼
Governance Dashboard
  │
  ├── Hotspots
  ├── Trends
  ├── Department workload
  └── Impact insights
```

## 6. Google Cloud / AI Architecture

The target production architecture is:

- **Frontend:** responsive web/PWA
- **Authentication:** Firebase Authentication when required by deployment
- **Application/API:** Cloud Run or Firebase-backed serverless APIs
- **AI:** Gemini via Google AI / Vertex AI
- **Data:** Firestore for operational civic records
- **Files:** Cloud Storage for submitted media
- **Analytics:** BigQuery for aggregated, privacy-conscious analytics
- **Maps/location:** Google Maps Platform where appropriate
- **Observability:** Cloud Logging and monitoring

The prototype in this repository starts with a lightweight browser demo so the core experience can be demonstrated quickly. Production integrations should keep secrets server-side and apply appropriate access controls.

## 7. AI Design Principles

### Human-in-the-loop

AI recommendations are suggestions. Routing, escalation, and public-service actions require authorized human review.

### Privacy by design

Collect only information needed for the service. Avoid exposing personal data on public dashboards. Apply retention, access-control, and deletion policies before production deployment.

### Explainable prioritization

Priority should be decomposed into understandable signals such as urgency, service impact, recurrence, and affected area rather than presented as an unexplained model score.

### Multilingual accessibility

The interface should support Indian languages and plain-language responses. Voice-first interaction is important for users who may have limited typing ability or literacy.

### Bias and safety controls

AI outputs must be validated for hallucination, language errors, demographic bias, prompt injection, abusive content, and incorrect routing. Low-confidence cases should be escalated to human review.

## 8. Prototype Scope

The first demonstrable version focuses on a complete golden path:

1. Citizen submits an issue.
2. AI-style analysis produces category, summary, priority and department.
3. Dashboard displays the issue and its reasoning.
4. Official changes status or routing.
5. Analytics update to show the community-level pattern.

The browser prototype contains representative data and simulated AI responses. Replace the demo adapter with a secure Gemini API service before presenting the system as a live AI deployment.

## 9. Suggested Demo Scenarios

### Scenario A — Pothole cluster

Five citizens report road damage in different languages. CivicAI identifies the same geographic cluster, groups the reports, increases the evidence signal, and routes the issue to the appropriate civic/roads department.

### Scenario B — Water interruption

A citizen submits a voice complaint. The system extracts the locality, recognizes a water-supply issue, summarizes it, and places it into the relevant service queue.

### Scenario C — Waste hotspot

Multiple photo/text reports appear near the same location. The dashboard surfaces the hotspot and shows an increasing trend so officials can investigate the underlying service problem rather than treating every complaint independently.

## 10. Repository Structure

```text
civicai-governance/
├── index.html                 # Interactive prototype
├── styles.css                 # Prototype UI
├── app.js                     # Demo intelligence + dashboard logic
├── data/
│   └── sample-grievances.json # Safe synthetic demo dataset
├── docs/
│   ├── ARCHITECTURE.md        # Technical architecture
│   ├── DEMO_SCRIPT.md         # 2–3 minute demo narrative
│   └── SUBMISSION_CHECKLIST.md# Hackathon submission checklist
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 11. Running the Prototype

No build step is required for the initial prototype.

```bash
git clone https://github.com/Nersu-Abhinav/civicai-governance.git
cd civicai-governance
```

Open `index.html` in a browser, or serve the folder with any static HTTP server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## 12. Roadmap

- [x] Product concept and Track 1 alignment
- [x] Interactive prototype shell
- [x] Synthetic civic dataset
- [x] Demo narrative and architecture documentation
- [ ] Gemini API integration through a secure backend
- [ ] Voice ingestion and transcription
- [ ] Indian-language evaluation set
- [ ] Firestore persistence
- [ ] Official review workflow
- [ ] Duplicate/cluster detection using embeddings
- [ ] Geospatial hotspot visualization
- [ ] Privacy and audit controls
- [ ] Production deployment

## 13. Evaluation Plan

The prototype should be evaluated on:

- classification accuracy
- routing accuracy
- multilingual quality
- duplicate-cluster precision/recall
- priority consistency
- AI response latency
- human-review correction rate
- accessibility and task completion time

AI quality should be measured on a labeled, synthetic or appropriately governed dataset before real citizen data is introduced.

## 14. Team & Submission

**Project:** CivicAI Governance — JanMitra  
**Track:** AI for Digital Public Infrastructure & Governance  
**Repository:** https://github.com/Nersu-Abhinav/civicai-governance

## 15. Disclaimer

This is a hackathon prototype. It is not a substitute for official government systems, professional advice, emergency services, or legally mandated grievance procedures. Any real deployment must comply with applicable law, public-sector procurement/security requirements, data-protection obligations, accessibility standards, and organizational policies.

---

**Build with AI. Build for communities. Build solutions that matter.**
