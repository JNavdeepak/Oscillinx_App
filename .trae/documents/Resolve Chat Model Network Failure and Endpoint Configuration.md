## Summary

* The client fails at `fetch` with `TypeError: Network request failed` when calling `POST http://192.168.1.4:5000/chat` from `src/screens/ChatScreen.tsx:139`.

* Backend is Express (`backend/server.js`) with `/chat` proxying to Ollama on `http://13.49.170.38:11434/api/generate`. No auth or rate limits are implemented.

## Immediate Checks

1. Verify backend is running and reachable:

* Open `http://192.168.1.4:5000/health` from the device/emulator.

* If using Android emulator, use `http://10.0.2.2:5000` instead of a LAN IP.

* Confirm Windows firewall allows inbound on port `5000`.

1. Confirm device and server are on the same network; IP `192.168.1.4` is correct for the host PC.
2. If using HTTP on Android 9+, ensure cleartext HTTP is allowed or switch to HTTPS.
3. Check backend logs for startup and errors (listen on `0.0.0.0`, proxy errors to Ollama).

## Request Format Validation

* Client sends `{ model_id: activeModel.name || activeModel.id, user_message: <string> }` with `Content-Type: application/json` (`src/screens/ChatScreen.tsx:139-147`).

* Backend requires `user_message` and accepts `model_id`; responds with `{ success, bot_reply, model_used, tokens_used }` (`backend/server.js:28-66`).

## Error Context

* Full message: `Chat error: TypeError: Network request failed` at `src/screens/ChatScreen.tsx:200` within `handleSend` (`src/screens/ChatScreen.tsx:80-206`).

* Client maps errors: Abort → timeout, `Failed to fetch` → unreachable backend, else → generic (`src/screens/ChatScreen.tsx:193-199`).

## Functional Tests

1. Health check:

* `curl http://192.168.1.4:5000/health` (or `http://10.0.2.2:5000/health` on emulator).

1. Chat probe:

* `curl -X POST http://<backend>/chat -H 'Content-Type: application/json' -d '{"model_id":"tinyllama","user_message":"Hello"}'`.

1. Upstream Ollama:

* `curl -X POST http://13.49.170.38:11434/api/generate -H 'Content-Type: application/json' -d '{"model":"tinyllama","prompt":"Hello","stream":false}'`.

## Rate Limits & Auth

* No rate limits or retries implemented client or server.

* Chat endpoint is unauthenticated; Supabase uses an anon key (not involved in chat calls).

## Proposed Fixes

1. Centralize and correct backend URL:

* Replace hardcoded `BACKEND_URL` (`src/screens/ChatScreen.tsx:18`) with `config.backendUrl` from `src/config.ts`.

* Add emulator/physical device detection fallback (`10.0.2.2` vs LAN IP).

1. Add preflight health check:

* Ping `/health` before sending and surface actionable UI messages for unreachable/timeout.

1. Improve error mapping:

* Map cleartext blocked, DNS failures, and timeouts distinctly; include server guidance for firewall and HTTPS.

1. Optional: Add retry with backoff for transient failures and configurable timeout.
2. Optional: Move secrets to env loader and avoid inline keys.

If you approve, I will implement the URL centralization and health-check, add emulator-aware fallback, and enhance error handling in `ChatScreen.tsx`, then validate by running the health and chat probes and sharing the results.
