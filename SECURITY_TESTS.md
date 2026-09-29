# Security Hardening & RBAC Audit

This document details the server-side security checks and authorization rules implemented in the backend, verifying that frontend manipulations cannot bypass business logic.

## 1. Project Access Isolation
- **Attempt**: A user tries to view or modify a project they are not a member of by passing its ID in the URL.
- **Expected Result**: 404 Not Found (implemented via `requireProjectAccess` middleware).
- **Why 404 instead of 403?**: Returning a 403 Forbidden leaks the existence of the private project to unauthorized actors. Returning a 404 securely masks it.

## 2. Project Owner Privileges
- **Attempt**: A standard project member attempts to send a `PATCH /api/projects/:id` or `DELETE /api/projects/:id` request using their valid JWT token.
- **Expected Result**: 403 Forbidden ("You must be the project owner to perform this action").
- **Implementation**: Enforced by `requireProjectAccess('OWNER')`.

## 3. Member Management Limits
- **Attempt**: A standard member attempts to add a new member or remove an existing member via `POST /api/projects/:id/members`.
- **Expected Result**: 403 Forbidden.
- **Attempt**: A project owner tries to remove themselves from the project using `DELETE /api/projects/:id/members/:userId`.
- **Expected Result**: 403 Forbidden ("Cannot remove the project owner"). The owner must transfer ownership or delete the project.

## 4. Admin Privileges vs Regular Users
- **Attempt**: A user tries to create an Admin account by intercepting the registration request and adding `"role": "ADMIN"` to the JSON payload.
- **Expected Result**: The user is created as a standard `USER`.
- **Implementation**: The Zod `registerSchema` only accepts specific fields, explicitly ignoring any `role` fields sent in the request. Admins must be provisioned via database writes.

## 5. Brute Force & API Abuse Protection
- **Attempt**: An attacker attempts to brute-force a user's password on `POST /api/auth/login`.
- **Expected Result**: After 10 attempts within a 15-minute window, the attacker receives a 429 Too Many Requests response.
- **Implementation**: Handled by `express-rate-limit` wrapped specifically around the `/api/auth` router.

## 6. Task Context Hijacking
- **Attempt**: A user tries to edit a task belonging to a different project by sending a valid task ID via `PATCH /api/tasks/:taskId` but modifying the payload to change the project ID, or accessing it without project membership.
- **Expected Result**: 404 Not Found.
- **Implementation**: `requireTaskAccess` fetches the task, gets its `project` reference, and performs a strict `ProjectMember` check against the requesting user.

## 7. Global Data Validation
- **Attempt**: A user tries to bypass frontend forms and send incomplete or malformed data to `POST /api/projects` (e.g., negative priorities, invalid dates, random statuses).
- **Expected Result**: 400 Bad Request with a structured error envelope explaining exactly which fields failed validation.
- **Implementation**: End-to-end Zod schemas in the `validate` middleware.
