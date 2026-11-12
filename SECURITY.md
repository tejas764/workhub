# Security Policy

WorkHub AI handles academic operational information, user accounts, connected Google Workspace resources, and potentially sensitive documents. Security reports are appreciated.

## Supported code

The active application is maintained on `develop`. Older branches and experimental components may not receive the same attention. No formal response-time or remediation guarantees are provided.

## Privately report vulnerabilities

Please avoid posting sensitive details in a public issue. Use GitHub's **Security → Report a vulnerability** feature when private vulnerability reporting is enabled. Otherwise contact the repository maintainers via GitHub to arrange a private channel.

Helpful information includes the affected route/module, observed impact, reproducible steps using non-sensitive test data, and potential mitigations.

## Data and credentials

Never commit or disclose:
- Supabase service-role or secret keys, AI provider keys, OAuth tokens and refresh tokens
- `.env` files containing real credentials
- Faculty or student records, internal announcements, department documents or uploads
- Private Google Workspace data, session tokens or production database exports

Before deploying, review Supabase RLS and storage policies, authentication and role checks, authorization for each API route, provider scopes, token handling, secure cookies, dependency updates and secret rotation.

## AI-specific considerations

Document text used for retrieval is untrusted input. Limit model context to authorized data, validate document access on the server, avoid exposing restricted content in logs, and verify important generated answers before use.

## Project maturity

This is an academic project; the presence of this policy does not certify it as security-audited or production-ready.
