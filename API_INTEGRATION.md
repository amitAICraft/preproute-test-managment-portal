# API Integration Overview

This document describes the API integration layer of the Preproute Test Management Portal. Communication between the React frontend and the backend REST services is structured using Redux Toolkit (RTK) Query. A single base service handles global headers, token injection, and error interception, while feature-specific APIs inject endpoints into the base instance. This maintains a clean separation of concerns and leverages automated query caching and tag-based invalidation.

---

# Authentication Flow

```text
               POST /auth/login
[Login Page] ────────────────────> [authApi Endpoint]
     ▲                                   │
     │ (Redirect)                        ▼ (Extract Token & User)
[Router Guard] <──(Sync Store)─── [Redux authSlice]
```

1. **Login Request**:
   Users enter their credentials on the login screen. This triggers a `POST` request to `/auth/login` via `useLoginMutation`.
2. **JWT Handling**:
   The response contains a token and a user profile envelope. RTK Query unwraps the payload and passes the JSON Web Token (JWT) directly to the login handler.
3. **Token Storage**:
   The token is stored in the Redux store (`authSlice`) and synchronized with LocalStorage under the `token` key to persist sessions across page reloads.
4. **Protected Routes**:
   Route guards (`ProtectedRoute` and `PublicRoute`) monitor Redux auth state. Unauthenticated users trying to access dashboard routes are redirected to `/login`.
5. **Authorization Headers**:
   The Redux state is read by the base query configuration before every API call. If a token exists, it is automatically appended to the request headers as an `Authorization: Bearer <token>` header.

---

# API Architecture

```text
[UI Components] ──> [Custom Feature Hooks] ──> [RTK Query Hooks]
                                                      │
                                                      ▼
[Backend REST APIs] <── [Network Layer] <── [baseApi Middleware]
```

* **Frontend Components**: Bind to custom hooks (e.g., `useCreateTest`), remaining agnostic of raw fetch configurations.
* **RTK Query**: Manages query life cycles, state selectors, loading flags, and caching.
* **API Layer (`baseApi.ts`)**: Defines base query configurations, prepends URLs, attaches authentication tokens, and handles global interceptors.
* **Backend Services**: The REST API endpoints that process payloads and validate parameters.

---

# Endpoint Summary

The table below lists all endpoints integrated into the application:

| Feature | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/auth/login` | `POST` | Authenticate admin credentials and retrieve JWT. |
| **Dashboard** | `/tests` | `GET` | Retrieve the list of all created tests. |
| **Taxonomy** | `/subjects` | `GET` | Fetch all available subject options. |
| **Taxonomy** | `/topics/subject/:subjectId` | `GET` | Fetch all topics mapped to a specific subject. |
| **Taxonomy** | `/sub-topics/multi-topics` | `POST` | Fetch sub-topics belonging to a list of topic IDs. |
| **Create Test** | `/tests` | `POST` | Register a new test metadata structure. |
| **Edit Test** | `/tests/:id` | `PUT` | Replace basic test metadata (e.g., duration, markings). |
| **Questions** | `/questions/fetchBulk` | `POST` | Retrieve details for a list of question UUIDs. |
| **Questions** | `/questions/bulk` | `POST` | Save questions associated with a test in bulk. |
| **Publish** | `/tests/:id` | `PUT` | Set test status to `live` (status: "live"). |

---

# Screen-wise API Mapping

## Login
* **APIs Used**: `POST /auth/login`
* **Flow**:
  1. The user enters their email and password, which must satisfy client-side checks.
  2. The form data is sent to the `/auth/login` endpoint.
* **Success Behaviour**:
  * The response data (`token` and `user` object) is stored in Redux and local storage.
  * A success toast notification is displayed.
  * The user is redirected to `/dashboard`.
* **Failure Behaviour**:
  * Error is parsed by `getApiErrorMessage`.
  * The validation message or a fallback message is shown as a toast notification.
  * Form fields remain populated, allowing the user to correct credentials.

## Dashboard
* **APIs Used**: `GET /tests`
* **Flow**:
  1. Entering the page triggers the `getTests` query.
  2. The component renders a list of cards from the returned array.
* **Loading**: Renders a full-width skeleton grid while the query state is `isLoading`.
* **Error Handling**: Displays an error box (`ErrorState`) with a retry button if the query fails.
* **Refresh Behaviour**: Triggering the dashboard refresh pulls fresh data from the server and updates cache values, updating the table fields.

## Create Test
* **APIs Used**: `GET /subjects`, `GET /topics/subject/:subjectId`, `POST /sub-topics/multi-topics`, `POST /tests`
* **Validation**:
  * Zod ensures subjects, topics, and names are selected and configured correctly.
  * Fields like duration and questions are validated as positive integers.
* **Payload**:
  ```json
  {
    "name": "string",
    "type": "chapterwise | pyq | mock-test",
    "subject": "string",
    "topics": ["string"],
    "sub_topics": ["string"],
    "correct_marks": number,
    "wrong_marks": number,
    "unattempt_marks": number,
    "difficulty": "easy | medium | difficult",
    "total_time": number,
    "total_marks": number,
    "total_questions": number,
    "status": "draft"
  }
  ```
* **Create Flow**:
  1. Taxonomy endpoints are called sequentially as dropdowns are populated.
  2. Form submission calculates the total marks and sends the test payload to `POST /tests`.
  3. On success, the UI navigates to `/tests/questions?testId=<new_id>`.
* **Backend Validation**:
  * Shows validation failures (e.g. duplicate test names) dynamically using custom error formatting toasts.

## Question Builder
* **APIs Used**: `POST /questions/fetchBulk`, `POST /questions/bulk`
* **Question Creation**: Questions are built locally and saved back to the test on submission.
* **Bulk API**:
  * Saves the full question array using `POST /questions/bulk` with option mappings (`option1` through `option4`, `correct_option`, `explanation`).
* **Question Sequencing**:
  * Tracked locally via the active question index.
  * Completing questions updates the sidebar status indicators.
* **Validation**:
  * Form configurations enforce complete options and select correct answers before allowing transition.
* **Navigation**:
  * Clicking numbers in the sidebar switches active indices.
  * Clicking "Exit" redirects the user back to the test creation screen.
* **Read-only Behaviour**:
  * Published tests (`status === 'live'`) lock down editor elements, preventing modifications to form controls.

## Publish Test
* **APIs Used**: `PUT /tests/:id`
* **Publish API**: Triggers a status change.
* **Payload**:
  ```json
  {
    "status": "live"
  }
  ```
* **Validation**: Checks that the number of saved questions matches the test's `totalQuestions` property before allowing publication.
* **Loading**: Disables the submit button and displays a spinner while the operation is in flight.
* **Success**: Redirects the user to `/dashboard` with a success toast.

## Schedule Publish
* **APIs Used**: `PUT /tests/:id`
* **Schedule API**: Configured as a frontend scheduling wrapper before status execution.
* **Date & Time Validation**: Ensures start dates are set in the future and end dates follow start dates.
* **Payload**: Combines schedule configs into status properties before execution.
* **Response**: Finalizes the metadata configuration status of the test.

---

# Error Handling Strategy

* **Validation Errors**: Checked client-side via Zod schema resolvers. Errors are mapped to inputs using `FormField` validation labels.
* **Backend Errors**:
  * Caught inside base query middleware.
  * Read-only validation error objects (e.g. `errors[i].msg`) are concatenated and formatted using `getApiErrorMessage`.
* **Network Errors**: Detects offline states or missing responses, displaying connection failure alerts.
* **Loading States**: Skeletons block page overlays during active fetches, while loading spinners disable action buttons during updates.
* **Toast Notifications**: Built using `sonner` to display success, info, and error notifications.
* **Fallback Messages**: Displays standard error strings when backend error messages are missing.

---

# API Performance

* **RTK Query Cache**: Stores queries in memory, reusing results across components to eliminate redundant API calls.
* **Automatic Refetch**: Invalidate listings automatically using tag matching (`providesTags: ['Test']` and `invalidatesTags: ['Test']`).
* **Request Deduplication**: Prevents multiple components from firing matching queries simultaneously.

---

# Security

* **JWT (JSON Web Token)**: Sent with every request once login is validated.
* **Authorization Header**: Formatted as `Authorization: Bearer <token>` in the base query.
* **Protected Endpoints**: Blocked by router guards to prevent access without credentials.
* **Input Validation**: Sanitized using Zod before request payload compilation.
* **Environment Variables**: API hostnames are fetched from `.env` properties to avoid hardcoding.

---

# Backend Limitations

* **Question Update API Unavailable**:
  * *Limitation*: No endpoint exists to update questions individually.
  * *Solution*: The frontend saves the question list in bulk (`POST /questions/bulk`), replacing questions on the test configuration.
* **Delete Test API Unavailable**:
  * *Limitation*: No DELETE endpoint is exposed.
  * *Solution*: The delete button is disabled on the dashboard to prevent invalid operations.
* **Question Preview API Unavailable**:
  * *Limitation*: No preview endpoint is exposed.
  * *Solution*: The Question Builder is reused to review saved questions in read-only mode.

---

# Assumptions

* **Frontend Scheduling**: Because scheduling properties were omitted from the API documentation, scheduling parameters are validated and stored on the client side, and the test is updated to `live` status during publication.
* **Test Type Support**: Support for `PYQ` and `Mock-Test` is disabled in the form tabs, as the backend currently only supports `Chapterwise` tests.
* **Delete Functionality**: The delete option is left disabled in the user interface because the backend API documentation does not expose a deletion method.

---

# Future API Improvements

1. **Question CRUD Support**: Introduce `PUT` and `DELETE` endpoints for individual questions (`/questions/:id`) to avoid bulk payload overhead.
2. **Delete Test Endpoint**: Add `DELETE /tests/:id` to allow clean test removal.
3. **Draft States**: Add support for draft questions to allow users to save progress without failing validation.
