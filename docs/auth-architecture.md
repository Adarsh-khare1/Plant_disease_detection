# PlantDx — Authentication Architecture

## Purpose

PlantDx authentication should be separate from the application database.

Authentication provider:
Firebase Authentication

Application database:
MongoDB

Frontend:
Next.js

Backend:
FastAPI

---

# Responsibilities

## Firebase Authentication

Handles:

- account creation
- login
- logout
- identity
- password reset
- email verification
- Google sign-in if enabled later
- authentication tokens

Firebase should NOT store PlantDx analysis history.

---

## MongoDB

Stores PlantDx application data such as:

- user profile
- analysis history
- reports
- user preferences

MongoDB should NOT store plaintext passwords.

---

# Authentication Flow

User enters credentials

→ Next.js sends authentication request to Firebase

→ Firebase authenticates user

→ Firebase returns authenticated user/session

→ Frontend obtains Firebase ID token

→ Frontend sends ID token with protected FastAPI requests

Example:

Authorization: Bearer <firebase-id-token>

→ FastAPI verifies the token

→ FastAPI extracts authenticated Firebase user ID

→ FastAPI loads corresponding PlantDx user profile from MongoDB

→ request continues

---

# User Identity

Firebase UID is the external identity source.

MongoDB user document:

{
  "_id": "ObjectId",
  "auth_user_id": "firebase-uid",
  "name": "User Name",
  "email": "user@example.com",
  "created_at": "datetime",
  "updated_at": "datetime"
}

PlantDx analyses reference the MongoDB user ID or an agreed stable user identifier.

The final implementation should use one consistent ownership strategy.

---

# Protected Routes

Public frontend routes:

- /
- /about
- /how-it-works
- /diseases
- /diseases/{slug}
- /technology
- /login
- /signup
- /forgot-password

Protected application routes:

- /app/dashboard
- /app/analyze
- /app/history
- /app/reports
- /app/profile
- /app/settings

Unauthenticated users attempting to access protected routes should be redirected to login.

---

# Protected API Endpoints

Examples:

GET /api/v1/analyses

GET /api/v1/analyses/{analysis_id}

POST /api/v1/analyses

POST /api/v1/reports

GET /api/v1/profile

These endpoints require a valid authenticated user.

---

# Public API Endpoints

Potential public endpoints:

GET /api/v1/diseases

GET /api/v1/diseases/{class_id}

GET /api/v1/health

Whether anonymous image analysis is supported will be decided separately.

Initial authenticated application architecture should assume saved analysis requires login.

---

# Authorization

Authentication answers:

"Who is this user?"

Authorization answers:

"Is this user allowed to access this resource?"

FastAPI must ensure:

analysis.user_id == current_user.id

before returning or modifying analysis data.

Users must never be able to retrieve another user's analysis by changing an analysis ID in the URL.

The same rule applies to reports and notes.

---

# Login

Initial login methods:

- Email + password

Potential later method:

- Google sign-in

Avoid adding additional identity providers unless there is a real user requirement.

---

# Signup

Initial signup fields:

- Name
- Email
- Password
- Confirm password

Account profile information should be minimal.

Do not collect unnecessary farmer or location information during signup.

---

# Password Reset

Use the authentication provider's password-reset workflow.

PlantDx should not implement its own password-reset tokens.

---

# Email Verification

Email verification may be enabled before production.

The initial prototype may allow development accounts without strict verification depending on development requirements.

Production behavior must be finalized before deployment.

---

# Frontend Session Handling

The frontend must have access to:

- loading state
- authenticated state
- unauthenticated state
- current user

Pages should not briefly render protected user data before authentication state is known.

---

# Backend Token Verification

FastAPI should verify Firebase ID tokens server-side.

The backend must not trust:

- user IDs sent by the frontend
- email addresses sent as identity
- frontend-only authorization checks

The authenticated identity comes from the verified token.

---

# Logout

Logout should:

1. end the frontend Firebase session
2. clear local authenticated state
3. redirect the user to an appropriate public page

It should not delete PlantDx data.

---

# Account Deletion

Account deletion is a future feature.

When implemented, it must define behavior for:

- Firebase identity
- MongoDB user record
- analyses
- stored images
- generated reports

Do not expose account deletion until this behavior is implemented safely.

---

# Security Principles

- Never store plaintext passwords.
- Never expose Firebase admin credentials to the frontend.
- Verify tokens in FastAPI.
- Enforce resource ownership in the backend.
- Do not rely solely on hidden frontend routes.
- Keep secrets in environment variables.
- Do not commit secret keys or .env files to Git.
- Use HTTPS in deployed environments.

---

# Development Strategy

Frontend development may initially use a mock authenticated user.

Then integrate Firebase Authentication.

Backend protected routes should initially support the same ownership model that production authentication will use.

This avoids redesigning history and reports later.