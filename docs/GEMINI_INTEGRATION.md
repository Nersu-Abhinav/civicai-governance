# Gemini Integration

CivicAI now includes a server-side Gemini integration. The browser never contains the Gemini API key.

## Request flow

```text
Browser
  -> POST /api/analyzeIssue
  -> Firebase Hosting rewrite
  -> Cloud Function `analyzeIssue`
  -> Gemini
  -> structured JSON
  -> Firestore
  -> Browser
```

## Structured model contract

The function requests a JSON object containing:

- `summary`
- `category`
- `department`
- `priority`
- `language`
- `confidence`
- `reason`
- `tags`
- `humanReview`
- `signals`

Structured output makes the frontend deterministic and easier to evaluate than parsing free-form model text.

## Multimodal input

The frontend can send a supported image as base64 inline data together with the citizen message. The function forwards it to Gemini for multimodal analysis.

For production, add explicit upload-size limits, malware/content scanning, retention rules, and a consent/notice flow before accepting arbitrary public uploads.

## Safety behavior

The backend:

- uses a low temperature for consistent triage;
- requests structured JSON output;
- clamps confidence to `[0, 1]`;
- forces human review when confidence is below the configured threshold;
- treats AI as decision support rather than an autonomous government decision-maker;
- returns a generic error instead of leaking internal exceptions;
- stores the Gemini key as a Firebase secret.

## Model configuration

The default model is configured through the `GEMINI_MODEL` Firebase parameter in `functions/index.js`. Keeping the model configurable allows the project to track the currently supported Gemini Flash model without changing frontend code.

## Evaluation before real data

Create a labeled synthetic test set across roads, water, sanitation, electricity, education, transport, and general services. Include multilingual, ambiguous, duplicate, urgent, abusive, irrelevant-image, and prompt-injection cases.

Measure:

- classification accuracy
- department-routing accuracy
- false-high-priority rate
- multilingual quality
- hallucination rate
- latency
- human correction rate

The public prototype remains usable without a configured backend because `app.js` has a deterministic local fallback.
