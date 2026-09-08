# Frontend Notes

## Key decisions

- React + TypeScript + Vite are used for a small, focused single-page application.
- Axios is configured with the backend API URL and automatically adds the JWT bearer token to protected requests.
- The login token and username are stored in `localStorage` so a browser refresh does not immediately sign the user out.
- The frontend uses the backend's offset pagination response for cleaning records. The page size is currently 5 records.
- Status filtering is sent to the backend so filtering and pagination remain server-side.
- Equipment is loaded once after login and the first equipment item is selected by default.
- Record creation and editing reuse the same form. After a successful save, the current record list is refreshed without reloading the page.
- Audit history is loaded on demand for the selected cleaning record and displays field-level old and new values.
- Responsive CSS supports desktop layouts, narrow screens, horizontally scrollable record tables, and touch-friendly controls.

## Authentication and security

- The frontend calls `POST /api/auth/login` and receives a JWT from the backend.
- The backend, rather than the frontend, is responsible for authorization. The frontend only controls the visible login state and sends the token.
- Sign out removes the stored token and username and returns the user to the login screen.
- `localStorage` is convenient for this take-home application but is exposed to JavaScript. A production application would consider secure, HttpOnly cookies with CSRF protection and a refresh-token flow.
- The demo credentials are provided by the backend seed script: `admin` / `demo-password`.

## Deliberately left out

- There is no role-based UI or permission matrix yet. Authenticated users currently have the same access to equipment and cleaning-record APIs.
- Equipment CRUD and bulk import are available through the backend API but do not have dedicated frontend screens.
- There is no client-side caching library, optimistic update, or offline mode because the workflow is small and server state is authoritative.
- There are no frontend unit or end-to-end tests yet. The highest-value next additions would cover login persistence, save-error handling, record filtering, and audit display.
- The frontend relies on the backend for validation and displays a general error message rather than field-level API validation details.

## With more time

- Add role-aware navigation and protected actions once backend roles are introduced.
- Add a dedicated equipment management/import view for administrators.
- Replace `localStorage` token storage with a secure cookie-based session.
- Add Playwright coverage for login, record creation/editing, pagination, and audit history.
- Add accessible focus management for the login form, record form, and audit panel.
