# Intelligent Process Automation (IPA)

This repository contains a small full-stack project for document processing and automation. It includes:

- A Next.js frontend in `client/` (TypeScript + React)
- An Express + Node.js backend in `server/` (routes in `server/src`)
- Two Flask microservices in the `server/` root: `chatbot_api.py` (port 5002) and `ocr_api.py` (port 5001)
- MongoDB for persistence (used by the server)

This README focusses on how to run the project locally and where to find key pieces.

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

