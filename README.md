# Intelligent Process Automation (IPA)

This repository contains a small full-stack project for document processing and automation. It includes:

- A Next.js frontend in `client/` (TypeScript + React)
- An Express + Node.js backend in `server/` (routes in `server/src`)
- Two Flask microservices in the `server/` root: `chatbot_api.py` (port 5002) and `ocr_api.py` (port 5001)
- MongoDB for persistence (used by the server)

This README focusses on how to run the project locally and where to find key pieces.

## Architecture Overview

The system is a polyglot stack composed of:

- Frontend: Next.js (App Router) + TypeScript + MUI for theming.
- Backend: Express (Node.js) REST API with MongoDB persistence.
- Microservices: Two Python (Flask) services for Chatbot and OCR tasks.
- NLP/OCR: Integrated through dedicated endpoints; OCR via Tesseract (Flask) and NLP via Node or Python helpers.

### Frontend (App Router)

The project has been migrated to the Next.js App Router. All new pages live under `client/src/app/`. Legacy `pages/` artifacts have been removed/neutralized. Global layout, theming, and providers are defined in `app/layout.tsx`.

Key frontend elements:
- `app/layout.tsx`: Root layout providing MUI Theme, Navbar, Toasts.
- `app/documents/page.tsx`: Documents listing.
- `app/documents/[id]/page.tsx`: Dynamic document view.
- `components/DocumentUploader.tsx`: Upload component (backward-compatible with legacy props).
- `components/DocumentListing.tsx`: Enhanced listing with loading, empty, error states.

### Theming

Material UI theme instantiation occurs client-side (`ThemeProviderClient`) to avoid server runtime issues. Theme options live in `src/theme/theme.ts`. Only import `themeOptions` server-side; create the theme in a client component.

### API Client

`src/services/apiClient.ts` centralizes Axios calls. Interceptors attach auth tokens and unify error notifications.

## Environment Variables

Core variables (create `.env` in root and optionally `client/.env.local`):

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string for Express API |
| `PORT` | Express server port (default 5005 if set differently in server code) |
| `JWT_SECRET` | JWT signing secret (server) |
| `NODE_ENV` | Environment mode |
| `GEMINI_API_KEY` | Chatbot service key (used by `chatbot_api.py`) |
| `NEXT_PUBLIC_API_URL` | Base URL for frontend to reach Express API (e.g. http://localhost:5005/api) |
| `NEXT_PUBLIC_CHATBOT_URL` | Frontend URL to Flask chatbot (e.g. http://localhost:5002) |
| `NEXT_PUBLIC_OCR_URL` | Frontend URL to OCR microservice (e.g. http://localhost:5001) |
| `CHATBOT_URL` | Server-side URL to chatbot service |
| `OCR_URL` | Server-side URL to OCR service |

## Scripts

Frontend (`client/`):
- `npm run dev` — Start Next.js dev server.
- `npm run build` — Production build.
- `npm run start` — Start production server.

Backend (`server/`):
- `npm run dev` — Start Express with auto-reload.
- `npm run start` — Production start.

Python Microservices (`server/` root):
- `python chatbot_api.py` — Start chatbot (port 5002).
- `python ocr_api.py` — Start OCR (port 5001).

## Local Development Flow

1. Start MongoDB.
2. Launch Express API (`npm run dev` in `server/`).
3. Launch Flask services (separate terminals).
4. Launch Next.js frontend (`npm run dev` in `client/`).
5. Visit `http://localhost:3000/documents`.

## Error Handling & UX

`DocumentListing` shows skeleton + spinner while loading, inline `Alert` + retry on error, and an empty state with a guided upload prompt. A manual refresh button enables quick re-fetch without a full page reload.

## Deployment Notes

Recommended next steps for production readiness:
- Add Dockerfiles and `docker-compose.yml` tying together services and MongoDB.
- Harden auth (token refresh, secure cookie settings).
- Add monitoring (basic health endpoints, logging aggregation).
- Implement e2e tests (Playwright) for critical flows (upload, view document, chatbot message).

## Contributing

Open issues or PRs describing feature changes. Keep changes small and focused. Avoid introducing server-side theme creation.

## Security

Never commit real secrets. Provide a sanitized `.env.example`. Rotate `JWT_SECRET` in production and restrict network access to MongoDB.

---
This document reflects the current App Router + MUI setup after modernization.

## Quickstart (Windows / PowerShell)

1. Copy the example env and fill values:

```powershell
cp .env.example .env
# and optionally create client/.env.local using values from .env.example
```

2. Start MongoDB (if you have it installed locally). For a quick local server you can run MongoDB Community or use Docker.

3. Start the Express server:

```powershell
cd server
npm install
npm run dev
# server defaults to port 5005
```

4. Start the Flask microservices (in separate terminals):

```powershell
cd server
# Chatbot (requires GEMINI_API_KEY in .env)
python chatbot_api.py

# OCR
python ocr_api.py
```

5. Start the Next.js frontend:

```powershell
cd client
npm install
npm run dev
# frontend defaults to port 3000
```

Notes:
- The frontend uses `NEXT_PUBLIC_API_URL` to reach the Express backend (default: http://localhost:5005/api).
- The server and client can use `CHATBOT_URL` / `NEXT_PUBLIC_CHATBOT_URL` and `OCR_URL` / `NEXT_PUBLIC_OCR_URL` to point to the Flask microservices.

## Important files / structure

- `server/server.js` — Express server entrypoint; mounts routes from `server/src/routes` and serves `/api-docs`.
- `server/src/controllers` — controllers for auth, upload, chatbot, OCR, etc.
- `client/src/services/apiClient.ts` — frontend API client used across pages/components.
- `server/chatbot_api.py`, `server/ocr_api.py` — local Flask microservices used by the project.

## Health checks and debugging

- The Express server now performs a quick runtime check on startup to see if `CHATBOT_URL` and `OCR_URL` are reachable and logs warnings if not. This helps detect missing microservices early.

## Next improvements (recommended)

1. Add a `docker-compose.yml` to run MongoDB, the Express server, Next client, and Flask microservices together.
2. Add a `.env.example` (already present) and ensure each service documents required secrets (e.g., `GEMINI_API_KEY` for the chatbot).
3. Add CI that runs lint/build on push.

If you'd like, I can add a Docker Compose stack next (I can draft one using build contexts and small Dockerfiles for each service)."*** End Patch

