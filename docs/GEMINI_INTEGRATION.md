# Gemini Integration Plan

The repository's current browser prototype intentionally uses local synthetic analysis. The production/hackathon AI path should move model calls to a secure server-side service.

## Recommended flow

```text
Browser → Civic API → Gemini → structured JSON → validation → Firestore → dashboard
```

## Model contract

Ask Gemini to return only a validated JSON object with:

- `language`
- `category`
- `summary`
- `location`
- `urgency`
- `impact`
- `recommended_department`
- `confidence`
- `reasoning_signals`

The backend should reject malformed output and send low-confidence cases to human review.

## Safety requirements

- Never put the Gemini API key in `index.html`, `app.js`, or any client-side bundle.
- Validate and constrain model output before storing it.
- Treat citizen text and uploaded media as untrusted input.
- Use allow-listed departments/categories rather than arbitrary model-generated routing destinations.
- Keep personally identifying information out of aggregate analytics.
- Log model version/configuration and human overrides for evaluation.

## Evaluation before live data

Build a labeled synthetic test set covering:

1. English + major Indian languages targeted by the pilot.
2. Ambiguous requests.
3. Duplicate reports.
4. Urgent safety issues.
5. Spam and abusive inputs.
6. Prompt-injection attempts.
7. Images that are irrelevant or unsafe.

Measure category accuracy, routing accuracy, false-high-priority rate, multilingual quality, and human correction rate.

## Production note

The prototype is deliberately usable without an API key. This allows the demo UI to remain safe to publish while the secure Gemini integration is developed separately.
