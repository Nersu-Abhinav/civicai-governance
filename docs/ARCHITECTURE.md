# CivicAI Governance — Architecture

## Prototype architecture

```text
┌──────────────────────────────┐
│ Citizen Web / PWA            │
│ text · voice · photo · GPS   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Secure Civic API             │
│ validation · rate limits     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Gemini / Google AI layer     │
│ language · intent · summary  │
│ entities · routing · safety │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ Firestore   │  │ Cloud Storage│
│ case record │  │ media        │
└──────┬──────┘  └──────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Official dashboard           │
│ queue · map · trends · audit │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Human decision / action      │
│ approve · route · resolve    │
└──────────────────────────────┘
```

## Production components

### Frontend

A responsive PWA can provide two experiences:

- **Citizen mode:** low-friction report creation, multilingual UX, status tracking.
- **Official mode:** authenticated queues, filters, analytics, review and audit actions.

### AI service

Use a server-side Gemini integration. The model should receive only the minimum required information and return a structured schema, for example:

```json
{
  "language": "Telugu",
  "category": "Water Supply",
  "summary": "...",
  "location": "...",
  "urgency": "high",
  "impact": "community",
  "recommended_department": "Water Services",
  "confidence": 0.91,
  "reasoning_signals": ["essential service", "multiple households"]
}
```

Do not expose API credentials in frontend code.

### Data model

A civic case should contain:

- stable case ID
- timestamps
- source channel
- language
- sanitized citizen content
- media references
- approximate/authorized location
- AI extraction
- confidence values
- routing recommendation
- human decision
- status history
- audit metadata

### Duplicate and cluster detection

Normalize text and location signals, then use embeddings or semantic similarity to identify likely duplicates. A human reviewer should be able to merge or separate clusters.

### Priority model

Avoid making a single LLM output the final priority. A safer design combines structured signals:

```text
Priority signal = urgency + service criticality + affected population
                 + recurrence + verified evidence
```

The resulting recommendation should be visible to the reviewer and adjustable by policy.

## Security and governance

- Keep secrets in a managed secret store.
- Authenticate official users and apply role-based access.
- Separate public citizen views from internal case data.
- Encrypt data in transit and at rest.
- Log administrative actions.
- Apply retention and deletion policies.
- Sanitize uploaded files.
- Rate-limit public intake endpoints.
- Defend AI endpoints against prompt injection and malicious attachments.
- Do not expose sensitive personal information in analytics or demos.

## Scalability

The architecture can scale horizontally because intake, AI processing, storage, and analytics are separable workloads. Async processing is preferred for media analysis and high-volume bursts, while the citizen-facing API can immediately return a case reference.

## Reliability

AI services should have timeout, retry, fallback, and human-review paths. If AI is unavailable, the platform should still accept the report and place it in a manual-review queue.
