# Authentication and Session Management Strategy

This document details the authentication, session management, and authorization mechanisms for the application's API.

## 1. Core Technology: JSON Web Tokens (JWT)

We will use JSON Web Tokens (JWT) for authenticating users. JWT is a stateless, self-contained standard for creating access tokens that assert some number of claims.

### JWT Structure:
-   **Header:** Algorithm (e.g., HS256) & Token Type (JWT).
-   **Payload (Claims):**
    -   `sub` (Subject): The `user_id`.
    -   `iss` (Issuer): The application's domain.
    -   `exp` (Expiration Time): A short-lived expiration (e.g., 15 minutes) to enhance security.
    -   `iat` (Issued At): Timestamp of when the token was issued.
    -   `rol` (Role): User role, e.g., 'user' (for future use).
-   **Signature:** A securely signed hash of the header, payload, and a server-side secret key (`JWT_SECRET`). The signature ensures the token's integrity.

## 2. Authentication Flow

1.  **Registration (`POST /api/auth/register`):**
    -   User provides `email`, `password`, `first_name`, and `last_name`.
    -   The server validates the input.
    -   The password is put through a strong hashing algorithm (e.g., **bcrypt**) to generate a `password_hash`. A unique `salt` is generated for each user.
    -   A new user record is created in the database.
    -   The server returns the new `UserDto` object.

2.  **Login (`POST /api/auth/login`):**
    -   User provides `email` and `password`.
    -   The server finds the user by email.
    -   It compares the provided password with the stored `password_hash` using bcrypt's compare function.
    -   On success, the server generates two tokens:
        -   **Access Token:** A short-lived JWT (e.g., 15 minutes) containing the user's ID and other non-sensitive claims. This token is used to access protected routes.
        -   **Refresh Token:** A long-lived, opaque, and cryptographically secure random string (e.g., 30 days). This token is stored in the database, linked to the user, and sent to the client via an `HttpOnly`, `Secure` cookie. It is used only to get a new access token.
    -   The access token is returned in the JSON response.

3.  **Accessing Protected Routes:**
    -   The client sends the **Access Token** in the `Authorization` header of every request to a protected endpoint (e.g., `Authorization: Bearer <access_token>`).
    -   A server-side middleware intercepts the request.

4.  **Token Refresh:**
    -   When the Access Token expires, the client's request will fail with a `401 Unauthorized` status.
    -   The client will then make a request to a dedicated endpoint (e.g., `POST /api/auth/refresh-token`) without an `Authorization` header but with the Refresh Token cookie.
    -   The server validates the Refresh Token against the database, checks if it's expired or has been revoked, and if valid, issues a new Access Token.

## 3. Security Middleware

A middleware function will be applied to all protected API routes. Its responsibilities are:
1.  Check for the `Authorization: Bearer <token>` header.
2.  Verify the JWT's signature using the `JWT_SECRET`.
3.  Check the token's expiration (`exp` claim).
4.  If the token is valid, extract the `user_id` from the payload and attach the user object to the request (e.g., `req.user`) for use in downstream route handlers.
5.  If the token is invalid or missing, return a `401 Unauthorized` error.

## 4. Secure Password Reset Flow

1.  **Request (`POST /api/auth/request-password-reset`):**
    -   User submits their email address.
    -   The server generates a secure, single-use, and short-lived password reset token (e.g., a UUID or cryptographically random string).
    -   This token is stored in the `User` table (`password_reset_token`) along with an expiry timestamp (`password_reset_token_expiry`).
    -   The server sends an email to the user containing a link with the token (e.g., `https://app.com/reset-password?token=...`).

2.  **Reset (`POST /api/auth/reset-password`):**
    -   User clicks the link and is directed to a form to enter a new password.
    -   The form is submitted with the `token` and `newPassword`.
    -   The server finds the user by the `token`.
    -   It verifies that the token has not expired.
    -   If valid, the new password is hashed with bcrypt, the user's `password_hash` is updated, and the `password_reset_token` is cleared from the database to prevent reuse.
    -   A confirmation email is sent to the user.

## 5. Session Management & Logout

-   **Stateless Nature:** By using JWTs, the server remains stateless. No session data is stored on the server itself.
-   **Logout (`POST /api/auth/logout`):**
    -   **Client-side:** The client must delete the Access Token from its memory/storage.
    -   **Server-side (for enhanced security):** To invalidate the Refresh Token immediately, the server should delete the corresponding Refresh Token from the database. This ensures the user cannot generate new Access Tokens after logging out.

---

## 6. Authorization and Access Control

Authorization determines what an authenticated user is allowed to do. Our primary model is **Ownership-Based Access Control (OBAC)**.

### Core Principle
A user can only interact with resources they own. For example:
- A user can only `GET`, `PUT`, or `DELETE` a `Property` if the `property.owner_id` matches their own `user.user_id`.
- This principle extends to all related resources: `Assets`, `Tasks`, `Expenses`, etc., which are linked to a `Property` or directly to the `User`.

### Implementation
This will be implemented using a series of authorization middleware functions that run *after* the authentication middleware.

**Example Flow for `GET /api/properties/{propertyId}`:**

1.  **Authentication Middleware:** Verifies the user's JWT. If valid, it attaches the user's data (e.g., `req.user = { user_id: 123, ... }`) to the request object.
2.  **Authorization Middleware (`checkPropertyOwnership`):**
    a. Extracts the `propertyId` from the request parameters (`req.params.propertyId`).
    b. Extracts the `userId` from the request object (`req.user.user_id`).
    c. Queries the database to fetch the property: `SELECT owner_id FROM Properties WHERE property_id = {propertyId}`.
    d. **Compares the IDs:** `if (property.owner_id !== userId)`.
    e. If the IDs do not match, the middleware rejects the request with a `403 Forbidden` or `404 Not Found` status. A 404 is often preferred as it doesn't leak information about the existence of a resource.
    f. If the IDs match, it calls `next()` to pass control to the actual route handler.

### Middleware Design
We can create reusable middleware functions for different resources:
-   `canAccessProperty(req, res, next)`
-   `canAccessAsset(req, res, next)`
-   `canAccessTask(req, res, next)`

These middleware functions will handle the logic of fetching the resource, checking its owner ID against the authenticated user's ID, and either allowing or denying access.

### Future Enhancements: Role-Based Access Control (RBAC)
While OBAC is the primary model, the system is designed for future extension to Role-Based Access Control (RBAC). The JWT payload already includes a `rol` (role) claim. This could be used to introduce roles like:
-   **`admin`**: Can view/manage all data for administrative purposes.
-   **`property_manager`**: Can be granted access to specific properties they do not own.
