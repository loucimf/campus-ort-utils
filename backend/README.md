# ORT Manager Backend

Vercel API backend for the ORT Manager frontend.

## Setup

Create a local env file:

```bash
cp .env.example .env
```

Then set `DATABASE_URL` to the Neon connection string.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

`npm run dev` starts Vercel's local API runtime on port `3001`.

## Endpoints

- `GET /api/health`: verifies the backend is running.
- `GET /api/db/status`: verifies the backend can connect to Neon.
- `GET /api/tasks?userId=1`: lists a user's tasks.
- `PATCH /api/tasks`: updates a user task status.
- `DELETE /api/tasks?userTaskId=1`: deletes a user task row.

## Task update body

```json
{
  "userTaskId": 1,
  "status": "Completed"
}
```

Allowed status values match the database enum:

- `Pending`
- `Completed`
- `Overdue`
