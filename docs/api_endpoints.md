# API Endpoint Definitions

This document outlines the RESTful API endpoints for the application.

---

## Authentication

-   **`POST /api/auth/register`**
    -   **Description:** Registers a new user.
    -   **Request Body:** `RegisterDto`
    -   **Response Body:** `ApiResponse<UserDto>`

-   **`POST /api/auth/login`**
    -   **Description:** Authenticates a user and returns a JWT.
    -   **Request Body:** `LoginDto`
    -   **Response Body:** `ApiResponse<LoginResponseDto>`

-   **`POST /api/auth/logout`**
    -   **Description:** Logs out the user (e.g., by invalidating the token if using a blacklist).
    -   **Requires Auth:** Yes

-   **`POST /api/auth/request-password-reset`**
    -   **Description:** Sends a password reset link to the user's email.
    -   **Request Body:** `{ email: string }`

-   **`POST /api/auth/reset-password`**
    -   **Description:** Resets the user's password using a valid token.
    -   **Request Body:** `{ token: string, newPassword: string }`

---

## User & Preferences

-   **`GET /api/users/me`**
    -   **Description:** Retrieves the profile of the currently authenticated user.
    -   **Requires Auth:** Yes
    -   **Response Body:** `ApiResponse<UserDto>`

-   **`PUT /api/users/me`**
    -   **Description:** Updates the profile of the currently authenticated user.
    -   **Requires Auth:** Yes
    -   **Request Body:** `UpdateUserDto`
    -   **Response Body:** `ApiResponse<UserDto>`

-   **`GET /api/users/me/preferences`**
    -   **Description:** Retrieves the preferences of the currently authenticated user.
    -   **Requires Auth:** Yes
    -   **Response Body:** `ApiResponse<UserPreferencesDto>`

-   **`PUT /api/users/me/preferences`**
    -   **Description:** Updates the preferences of the currently authenticated user.
    -   **Requires Auth:** Yes
    -   **Request Body:** `UpdateUserPreferencesDto`
    -   **Response Body:** `ApiResponse<UserPreferencesDto>`

---

## Properties

-   **`GET /api/properties`**
    -   **Description:** Retrieves a list of all properties owned by the user.
    -   **Requires Auth:** Yes
    -   **Response Body:** `ApiResponse<PropertyDto[]>`

-   **`POST /api/properties`**
    -   **Description:** Creates a new property for the user.
    -   **Requires Auth:** Yes
    -   **Request Body:** `CreatePropertyDto`
    -   **Response Body:** `ApiResponse<PropertyDto>`

-   **`GET /api/properties/{propertyId}`**
    -   **Description:** Retrieves a single property by its ID.
    -   **Requires Auth:** Yes (and ownership)
    -   **Response Body:** `ApiResponse<PropertyDto>`

-   **`PUT /api/properties/{propertyId}`**
    -   **Description:** Updates an existing property.
    -   **Requires Auth:** Yes (and ownership)
    -   **Request Body:** `UpdatePropertyDto`
    -   **Response Body:** `ApiResponse<PropertyDto>`

-   **`DELETE /api/properties/{propertyId}`**
    -   **Description:** Deletes a property (soft delete).
    -   **Requires Auth:** Yes (and ownership)

---

## Assets

-   **`GET /api/properties/{propertyId}/assets`**
    -   **Description:** Retrieves all assets for a specific property.
    -   **Requires Auth:** Yes (and ownership of property)
    -   **Response Body:** `ApiResponse<AssetDto[]>`

-   **`POST /api/properties/{propertyId}/assets`**
    -   **Description:** Creates a new asset for a specific property.
    -   **Requires Auth:** Yes (and ownership of property)
    -   **Request Body:** `CreateAssetDto`
    -   **Response Body:** `ApiResponse<AssetDto>`

-   **`GET /api/assets/{assetId}`**
    -   **Description:** Retrieves a single asset by its ID.
    -   **Requires Auth:** Yes (and ownership of asset)
    -   **Response Body:** `ApiResponse<AssetDto>`

-   **`PUT /api/assets/{assetId}`**
    -   **Description:** Updates an asset.
    -   **Requires Auth:** Yes (and. ownership of asset)
    -   **Request Body:** `UpdateAssetDto`
    -   **Response Body:** `ApiResponse<AssetDto>`

-   **`DELETE /api/assets/{assetId}`**
    -   **Description:** Deletes an asset.
    -   **Requires Auth:** Yes (and ownership of asset)

---

## Tasks

-   **`GET /api/tasks`**
    -   **Description:** Retrieves all tasks for the user. Can be filtered by property, status, etc. via query params.
    -   **Requires Auth:** Yes
    -   **Response Body:** `ApiResponse<TaskDto[]>`

-   **`POST /api/tasks`**
    -   **Description:** Creates a new task.
    -   **Requires Auth:** Yes
    -   **Request Body:** `CreateTaskDto`
    -   **Response Body:** `ApiResponse<TaskDto>`

-   **`GET /api/tasks/{taskId}`**
    -   **Description:** Retrieves a single task by its ID.
    -   **Requires Auth:** Yes (and ownership of task)
    -   **Response Body:** `ApiResponse<TaskDto>`

-   **`PUT /api/tasks/{taskId}`**
    -   **Description:** Updates a task.
    -   **Requires Auth:** Yes (and ownership of task)
    -   **Request Body:** `UpdateTaskDto`
    -   **Response Body:** `ApiResponse<TaskDto>`

-   **`DELETE /api/tasks/{taskId}`**
    -   **Description:** Deletes a task.
    -   **Requires Auth:** Yes (and ownership of task)

---

## Expenses

-   **`GET /api/expenses`**
    -   **Description:** Retrieves all expenses for the user. Can be filtered by property, category, etc. via query params.
    -   **Requires Auth:** Yes
    -   **Response Body:** `ApiResponse<ExpenseDto[]>`

-   **`POST /api/expenses`**
    -   **Description:** Creates a new expense record.
    -   **Requires Auth:** Yes
    -   **Request Body:** `CreateExpenseDto`
    -   **Response Body:** `ApiResponse<ExpenseDto>`

-   **`GET /api/expenses/{expenseId}`**
    -   **Description:** Retrieves a single expense by its ID.
    -   **Requires Auth:** Yes (and ownership)
    -   **Response Body:** `ApiResponse<ExpenseDto>`

-   **`PUT /api/expenses/{expenseId}`**
    -   **Description:** Updates an expense.
    -   **Requires Auth:** Yes (and ownership)
    -   **Request Body:** `UpdateExpenseDto`
    -   **Response Body:** `ApiResponse<ExpenseDto>`

-   **`DELETE /api/expenses/{expenseId}`**
    -   **Description:** Deletes an expense.
    -   **Requires Auth:** Yes (and ownership)
