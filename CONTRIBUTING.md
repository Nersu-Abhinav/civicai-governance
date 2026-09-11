# Contributing

CivicAI Governance is a hackathon prototype focused on responsible AI for public-service workflows.

## Principles

1. Keep public-service actions human-reviewed.
2. Never commit secrets or personal citizen data.
3. Prefer synthetic datasets for development and demos.
4. Document AI assumptions and limitations.
5. Keep accessibility and multilingual support in scope.
6. Add tests when introducing production integrations.

## Development

Keep the static prototype dependency-free where practical. Production integrations should be isolated behind server-side APIs so credentials and policy controls never reach the browser.
