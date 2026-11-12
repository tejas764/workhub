# Contributing to WorkHub AI

Thanks for helping improve **WorkHub AI**, a collaborative department management and AI knowledge platform.

## Ways to contribute

- Fix bugs or improve error handling in the Next.js application
- Improve faculty, task, meeting, document, or dashboard workflows
- Strengthen authentication, permissions, and data protection
- Add accessible interactions and responsive layouts
- Improve AI answer grounding, evaluation, and documentation

## Start here

1. Read the [README](README.md) and explore the `develop` branch.
2. For nontrivial changes, open an issue first and explain the proposed behavior.
3. Fork the repository and create a descriptive topic branch from `develop`.
4. Install dependencies with `npm install`; configure local services with your own `.env.local`.
5. Run `npm run build` and any relevant checks before submitting a pull request.
6. Open a PR targeting `develop`, describing the change, screenshots (for UI changes), verification steps, and known limitations.

## Pull request checklist

- [ ] The PR explains the problem and solution clearly
- [ ] Code changes are focused and consistent with existing structure
- [ ] User-facing documentation is updated where necessary
- [ ] Changes have been tested or test limitations are explained
- [ ] No tokens, service-role keys, .env files, real faculty records, or institution documents are committed
- [ ] Third-party code and assets carry appropriate attribution

## Sensitive information

Use synthetic or authorized test data. Never include real faculty records, private documents, OAuth tokens, API keys, or institutional credentials in issues and pull requests.

For vulnerabilities, use [SECURITY.md](SECURITY.md), not a public issue. Be respectful of collaborators and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Architecture pointers

- `src/app`: routes, pages and API handlers
- `src/components`: UI and feature components
- `src/services`: application services
- `src/lib`: Supabase, authentication, ingestion and RAG helpers
- `supabase/migrations`: SQL migration material

Because this is a collaborative project, follow the repository's actual licensing and contributor terms; do not assume an open-source license has been granted.
