# Engineering Philosophy

This project is built around the following key principles:

* **Maintainability**: Code is written for human readability first. We enforce strict separation of concerns, ensuring that UI rendering and business logic are kept decoupled.
* **Scalability**: By utilizing a modular architecture, features can be added, updated, or removed independently without affecting the rest of the application.
* **Readability**: Consistent naming conventions, clear code hierarchy, and formatting tools are used to keep the codebase clean.
* **Performance**: We minimize unnecessary re-renders, optimize database queries via front-end caching, and use lightweight component design.
* **User Experience (UX)**: Following Figma designs, we provide instant visual feedback via loaders, skeletons, disabled action buttons, and clear validation messaging.

---

# Project Structure

The project implements a **domain-driven, feature-first structure** under `src/features`. Each feature (e.g. `auth`, `dashboard`, `tests`) encapsulates its own pages, UI components, custom hooks, schemas, API calls, and types.

This structure improves maintainability by:
* Isolating modules to prevent changes in one area of the app from affecting other files.
* Resolving import dependencies by exposing public modules exclusively through barrel files (`index.ts`).
* Organizing files by domain to make finding code easy.

---

# Component Design

We implement a dry, multi-tiered component hierarchy:

1. **Base UI Primitives (`src/components/ui/`)**: Pure, stateless UI elements (e.g., `Button`, `Input`, `Select`, `RadioGroup`, `Badge`, `Table`). These components manage styling only and are unaware of business logic.
2. **Form Wrappers (`src/components/forms/`)**: Form field layouts (e.g., `TextField`, `PasswordField`, `SelectField`, `RadioGroupField`) that combine UI inputs with helper labels and error displays (`FormError`). These components connect fields to form providers.
3. **Layout Components (`src/components/layout/`)**: Consistent page wrappers and layout blocks (`PageContainer`, `SectionCard`, `PageHeader`, `AppLayout`).
4. **AppLayout Component**: Implements a responsive collapsible sidebar and header, keeping page structural components consistent.

Using this strategy, styling adjustments (such as borders, heights, or active states) are modified in one central file, updating the style across all pages.

---

# State Management

| State Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Server State** | RTK Query | Manages fetching, client-side caching, tag-based cache invalidation, and request deduplication. |
| **Local UI State** | React `useState` / `useRef` | Handles local variables like dialog visibility and dropdown states. |
| **Form State** | React Hook Form | Manages input values, dirty validation flags, and submission states using uncontrolled inputs for better performance. |

Separating these concerns prevents component files from swelling and keeps UI state decoupled from raw API caching.

---

# Form Management

* **React Hook Form**: Form inputs are registered as uncontrolled components, avoiding parent component re-renders on every keystroke.
* **Zod Validation**: Validates inputs using schemas like `createTestSchema.ts`. This generates validation errors and prevents requests with invalid payloads.
* **Reusable Validation**: The schema-inferred TypeScript models are shared across pages (e.g. mapping Create Test schema to the Edit Test dialog fields).
* **Backend Validation Handling**: Errors returned by the server (e.g. duplicate test names) are caught, parsed by the `getApiErrorMessage` utility, and displayed as toast messages.

---

# API Best Practices

* **Centralized API Layer**: All endpoint declarations are injected into the centralized `baseApi.ts` configuration, avoiding duplicate fetch instances.
* **Loading States**: RTK Query's `isLoading` and `isFetching` status flags are used to disable controls and show spinners during active requests.
* **Error Handling**: API errors are caught by query interceptors, formatted via `getApiErrorMessage` to extract `errors[i].msg` messages, and displayed to the user via toasts.
* **JWT Authorization**: Requests automatically inject the Bearer JWT token read from the global Redux state using the `prepareHeaders` middleware.
* **Response Validation**: Responses are unwrapped using `transformResponse` to pass clean data models to feature components.
* **Graceful Fallback Messages**: A default message is provided when specific server errors are missing.

---

# UI / UX Best Practices

* **Responsive Design**: Adapts layouts to mobile, tablet, and desktop breakpoints.
* **Loading Indicators**: Displays loading animations on buttons and renders skeleton grids during initial page loads.
* **Disabled Buttons**: Submissions disable buttons to prevent duplicate form requests.
* **Validation Messages**: Shows validation errors inline with red warning indicators.
* **Toast Notifications**: Standardizes notifications (success, warning, error) using `sonner` alerts.
* **Accessible Forms**: Uses native `<label>` configurations matching input components.
* **Consistent Spacing**: We implement padding and margins matching the design mockups.
* **Reusable Layouts**: Page headers and cards maintain styling patterns.

---

# Performance Best Practices

* **RTK Query Caching**: Reuses query results in memory, avoiding redundant API calls for data that hasn't changed.
* **useMemo Optimization**: Filters and sorts tests locally on the dashboard using `useMemo` hooks, avoiding calculations during unrelated updates.
* **Component Optimization**: Isolates form inputs in separate fields to limit the re-render scope during edits.
* **Stable Callbacks**: Hooks wrap handlers in `useCallback` to prevent breaking child component memoization.

---

# TypeScript Best Practices

* **TypeScript Strict Mode**: The compiler runs in strict mode, preventing implicit `any` fallbacks.
* **Strict Interface Mappings**: Every request payload and database response maps to strict TypeScript types (`test.types.ts`).
* **Shared Types**: API models are shared between lists and detail screens to keep properties consistent.
* **Type Safety**: Enforces type checks across RTK query mutations and resolvers.

---

# Error Handling

* **Frontend Validation**: Catches incorrect configurations using Zod schema rules before requests are compiled.
* **Backend Validation**: Displays specific field validation issues returned by the API using toast messages.
* **Network Errors**: Network offline conditions display error messages with retry options.
* **Fallback Behaviour**: Standard error messages are shown when specific server details are missing.

---

# Security Best Practices

* **JWT Authentication**: Stores authorization tokens in the Redux slice and local storage, securing administrative sessions.
* **Protected Routes**: Redirects unauthorized access requests to `/login`.
* **Environment Variables**: API host configuration keys are managed in `.env` files.
* **Input Validation**: Form fields sanitize inputs using Zod rules.

---

# Code Quality

* **Consistent Naming**: Files use standard casing (e.g. kebab-case folders, PascalCase components, camelCase hooks/utilities).
* **Component Separation**: Large pages are split into subcomponents (e.g. `QuestionEditorMain`, `QuestionListSidebar`).
* **Reusable Hooks**: Logic is encapsulated inside custom hooks (`useCreateTest`, `useUpdateTest`, `usePublishTest`).
* **Clean Folder Structure**: Clean imports are managed using barrel files.

---

# Accessibility

* **Semantic HTML**: Pages are built using semantic elements (`<nav>`, `<main>`, `<header>`, `<footer>`, `<dialog>`).
* **Keyboard Navigation**: Dialogs use native browser configurations for ESC close triggers.
* **Focus States**: Buttons and inputs implement visual focus borders.
* **Form Labels**: Reusable fields map custom IDs to form elements.

---

# Responsive Design

* **Desktop (1024px+)**: Two-column forms and sidebar layouts.
* **Tablet (768px - 1023px)**: Layouts stack vertically, and the sidebar collapses to an icon-only strip.
* **Mobile (<767px)**: Forms collapse to a single-column layout, and the sidebar transitions to a toggleable overlay.

---

# Backend Limitations

* **Question Update API Unavailable**:
  * *Handling*: The frontend saves questions in bulk (`POST /questions/bulk`), replacing questions on the test configuration.
* **Delete API Unavailable**:
  * *Handling*: The delete option is disabled on the dashboard to prevent invalid operations.
* **Question Preview Unavailable**:
  * *Handling*: The Question Builder is reused to review saved questions in read-only mode.

These limitations are handled gracefully without inventing mock client states.

---

# Future Improvements

1. **Pagination**: Fetch dashboard listings using backend-driven pagination.
2. **Debounced Auto-Save**: Auto-save drafts in the Question Builder to prevent data loss.
3. **Optimistic Updates**: Add optimistic updates to dashboard actions to improve responsiveness.
