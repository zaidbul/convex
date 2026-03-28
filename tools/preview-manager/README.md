# Preview Manager

A local preview system for Convex that spins up isolated dev environments.

## Running

Start the preview manager:
```
bun run preview:manager
```

## API

- `POST /api/previews` — create a new preview `{ branch }`
- `GET /api/previews/:id` — get preview details
- `POST /api/previews/:id/start` — start a stopped preview
- `POST /api/previews/:id/restart` — restart a preview
- `POST /api/previews/:id/stop` — stop a preview
- `GET /api/previews/:id/status` — get status and baseUrl
- `POST /api/previews/:id/heartbeat` — keep preview alive

## Providers

- **local-docker** — runs the app in a local Docker container
- **e2b** — runs the app in an E2B cloud sandbox

## Preview URL

Once ready, previews are accessible at:
`http://127.0.0.1:4310/preview/:id/`