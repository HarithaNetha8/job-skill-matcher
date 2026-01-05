## Purpose

This file gives an AI coding agent the minimal, actionable context to be productive in this repository (backend-first Express + MongoDB). Use it to make safe, consistent code changes without guessing project conventions.

**Big Picture**
- **Server:** Single Express app at [server/server.js](server/server.js). Connects to MongoDB via [server/config/db.js](server/config/db.js).
- **Auth:** Routes mounted at `/api/auth` in [server/routes/authRoutes.js](server/routes/authRoutes.js). Auth uses JWTs and password hashing (`bcryptjs`).
- **Models:** Mongoose models live in [server/models](server/models); primary model: [server/models/User.js](server/models/User.js).
- **Client:** A `client/` folder exists; treat it as a separate front-end that talks to the server's HTTP API.

**How to run (developer)**
- Install and run the server:

  cd server
  npm install
  npm run dev

- Production run: in `server/` run `npm start` (script runs `node server.js`).

**Environment & secrets**
- Server reads `server/.env` for `PORT`, `MONGO_URI`, and `JWT_SECRET`. Never commit real secrets. Example keys found in repository: `MONGO_URI`, `JWT_SECRET`.

**Key implementation patterns & gotchas (project-specific)**
- CommonJS modules (`require` / `module.exports`) — keep that style consistent.
- Routes use async/await but often return raw JSON objects (e.g., `res.json({ token, role })`). Follow this pattern for new endpoints.
- Authorization header: the server reads the token with `req.header('Authorization')` in [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js). Do NOT prefix with `Bearer ` — the header should contain the raw token string.
- `User` schema details: `role` is an enum `['seeker','recruiter']`; `skills` is an array of strings. See [server/models/User.js](server/models/User.js).

**API examples**
- Register (from client): POST `/api/auth/register` with JSON body `{ name, email, password, role }`.
- Login: POST `/api/auth/login` with `{ email, password }` returns `{ token, role }`.
- Protected endpoints: include `Authorization` header with the token value returned by `/login`.

**When changing code**
- Update only CommonJS style imports/exports unless converting entire file consistently.
- When adding new env keys, add them to `server/.env.example` (create if missing) and mention them in this file.
- Keep error responses JSON-shaped and use status codes (e.g., `res.status(400).json({ msg: '...' })`).

**Files to inspect when modifying auth or DB logic**
- [server/server.js](server/server.js) — app boot, middleware, route mounting
- [server/config/db.js](server/config/db.js) — MongoDB connect and logging
- [server/routes/authRoutes.js](server/routes/authRoutes.js) — auth flow, password hashing, token issuance
- [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js) — how token is read and validated
- [server/models/User.js](server/models/User.js) — model fields and constraints

If anything above is unclear or you want examples added (tests, example client calls), ask and I will iterate.
