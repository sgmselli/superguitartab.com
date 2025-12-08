[Superguitartab.com](../../README.md) >
[Developer documentation](../README.md) >
Authentication

# Authentication

This section describes how authentication works across the API and frontend, including the user model, password-based login, refresh/logout handling, and Google OAuth.

---

## User model (SQLAlchemy)

| Field | Type | Notes |
|-------|------|-------|
| id | integer | PK |
| email | string(100) | unique, required |
| password | string(200) | nullable for Google-only users |
| first_name | string(100) | required |
| last_name | string(100) | required |
| google_id | string(200) | nullable, unique |
| created_at | datetime | server default |

Validation (Pydantic `UserCreate`):
- Password required unless `google_id` is present.
- Password rules: 8–128 chars, no spaces, must include upper/lowercase, number, special char; confirm must match.
- Names: 1–50 chars, no spaces, alnum plus `._-`.

---

## Token model and storage

- JWT Access Token: short-lived (`settings.access_token_expire_minutes`), signed with `settings.access_secret_key`.
- JWT Refresh Token: longer-lived (`settings.refresh_token_expire_days`), signed with `settings.refresh_secret_key`.
- Cookies: `access_token` and `refresh_token` are set as HttpOnly, `samesite=lax`, `secure=False` in current config. The frontend must send requests with `withCredentials: true`.

---

## Password auth endpoints

Base prefix: `/api/v1/auth`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST (form) | Exchange email/password for access + refresh cookies. |
| `/refresh` | POST | Exchange refresh cookie for a new access token cookie. |
| `/logout` | POST | Clears both cookies. |

Login flow:
1. Lookup user by email; 401 if not found.
2. Verify password; 401 if incorrect.
3. Issue access + refresh JWTs; set in cookies; returns `UserResponse`.

Refresh flow:
1. Requires `refresh_token` cookie; 401 if missing/invalid.
2. Issues new access token; sets `access_token` cookie.

Logout:
- Deletes both cookies on the response.

---

## Google OAuth

Base prefix: `/api/v1/auth/google`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | GET | Redirect user to Google consent screen. |
| `/callback` | GET | Google redirect target; exchanges code for profile, then issues cookies. |

Callback behavior:
1. Exchange code; read `userinfo`.
2. If `google_id` exists -> load user.
3. Else if email exists -> attach `google_id` to that user.
4. Else create a new user with `google_id`, no password.
5. Issue access + refresh cookies; redirect to frontend `/account`.

---

## Protected routes

- Backend uses `get_current_user` dependency (cookie-based access token) for routes that require auth.
- Frontend `apiAuth` Axios instance retries once via `/auth/refresh` on 401.
- Components gate downloads and account pages using `useAuth().isAuthenticated()`.

---

## Frontend expectations

- Axios instances (`api`, `apiAuth`) send `withCredentials: true`.
- Login form uses `POST /auth/login` with `username` + `password` form fields.
- Logout calls `POST /auth/logout`.
- Google flows navigate to `/api/v1/auth/google/login`.
- Auth-required UI: downloads show modal prompting login/register when unauthenticated; account page redirects to `/login` when no user.

---

## Error behaviors

- 401: missing/invalid access or refresh token; incorrect credentials.
- 404: access token references a user id that no longer exists.
- 400: Google callback failures (invalid profile/token).

