# Deployment Guide

This document describes the steps required to build, test, and deploy the Preproute Test Management Portal locally and to hosting services like Vercel.

---

# Prerequisites

Ensure you have the following software installed before proceeding:
* **Node.js**: Version 18.x or 20.x (Recommended)
* **npm**: Version 9.x or later (bundled with Node.js)
* **Git**: Command-line or GUI tools for version control

---

# Clone Repository

To set up the project on your machine, clone the repository and navigate into the project folder:

```bash
git clone <repository-url>
cd Preproute-Assignment
```

---

# Install Dependencies

All dependencies are defined in `package.json`. Navigate to the `project` directory and install them:

```bash
cd project
npm install
```

---

# Environment Variables

Configure environment variables before launching or building the application. Create a `.env` file at the root of the `project` directory.

### Required Environment Variables

| Variable Name | Purpose | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend REST API server. | `https://admin-moderator-backend-staging.up.railway.app/api` |
| `VITE_APP_NAME` | The display name of the application. | `Preproute` |

*Create the file manually or copy the template:*
```bash
cp .env.example .env
```

---

# Running Locally

To start the Vite local development server:

```bash
npm run dev
```

The application will launch automatically in your default browser at:
* **URL**: `http://localhost:3000`

---

# Production Build

To compile a production-ready build:

```bash
npm run build
```

* **Output Directory**: The compiled assets are generated in the `project/dist` folder.
* **Output Assets**: Contains optimized, minified HTML, CSS, JavaScript, and asset files ready for static hosting.

---

# Preview Production Build

To test the production build locally before deployment:

```bash
npm run preview
```

---

# Vercel Deployment

Deploying the static Vite application on Vercel requires the following steps:

1. **Import GitHub Repository**:
   * Log in to the Vercel Dashboard and click **Add New** > **Project**.
   * Import the `Preproute-Assignment` repository.
2. **Framework Detection**:
   * Vercel will automatically detect the project as a **Vite** application.
3. **Build & Development Settings**:
   * Set **Root Directory** to `project` (if the project is in the subdirectory).
   * Confirm the default commands:
     * **Build Command**: `npm run build` (or `tsc -b && vite build`)
     * **Output Directory**: `dist`
4. **Configure Environment Variables**:
   * Under the **Environment Variables** section, add the following key-value pairs:
     * Key: `VITE_API_URL` / Value: `<your-backend-api-url>`
     * Key: `VITE_APP_NAME` / Value: `Preproute`
5. **Deploy**:
   * Click **Deploy**. Vercel will build the project and provide a live URL.

---

# Build Verification

Verify that all screens and functionalities operate correctly post-deployment:

1. **Login**:
   * Navigate to the login screen.
   * Enter credentials (`vedant-admin` / `vedant123`) and verify redirect.
2. **Dashboard**:
   * Verify the test list loads and displays test cards.
   * Test the search input, filters (subject, status, date), and column headers sorting.
3. **Create Test**:
   * Click **Create Test** and select taxonomy options (Subject, Topics, Sub-topics).
   * Submit the form and verify navigation to the Question Builder.
4. **Question Builder**:
   * Build questions, insert rich text content, and check option mappings.
   * Verify saved questions show up as green slots in the sidebar.
5. **Publish**:
   * Verify that publishing checks prevent submission when the question count is not met.
   * Publish a test and verify its status updates to `live` on the dashboard.
6. **Schedule**:
   * Validate custom scheduler options and date-time boundaries.

---

# Troubleshooting

* **Missing Environment Variables**:
  * *Symptoms*: Blank pages or failed API requests during login/data retrieval.
  * *Resolution*: Ensure environment variables are added in the `.env` file locally or inside Vercel's environment variables configuration.
* **API Connection**:
  * *Symptoms*: Queries hanging in loading state or network requests failing with generic warnings.
  * *Resolution*: Check the backend server status and verify the `VITE_API_URL` does not contain trailing slashes or duplicate paths.
* **CORS Errors**:
  * *Symptoms*: Browser console logs block requests due to Missing Access-Control-Allow-Origin headers.
  * *Resolution*: Ensure the backend allows calls from your local domain or the deployed Vercel host.
* **Build Errors (TypeScript / Lint)**:
  * *Symptoms*: Build pipeline fails during `tsc -b`.
  * *Resolution*: Resolve type errors before compiling or run `npm run type-check` locally to check for missing declarations.
* **Routing Issues (404 on refresh)**:
  * *Symptoms*: Refreshing page on sub-routes returns Vercel 404 error page.
  * *Resolution*: Create a `vercel.json` file in the root of the project with redirection rules for single-page routing:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```

---

# Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on port 3000. |
| `npm run build` | Compiles typescript code and bundles assets for production. |
| `npm run preview` | Serves the built `dist` folder locally for verification. |
| `npm run lint` | Runs ESLint configuration to check code formatting and conventions. |
| `npm run lint:fix` | Automatically fixes style violations. |
| `npm run format` | Standardizes codebase using Prettier configuration. |
| `npm run type-check` | Runs the compiler to verify TypeScript declarations without outputting code. |

---

# Deployment Checklist

- [ ] Repository cloned locally
- [ ] Dependencies installed successfully
- [ ] `.env` configuration file created and keys added
- [ ] Verified local development server runs on port 3000
- [ ] Ran `npm run build` and verified the compilation completes without errors
- [ ] Deployed static directory to hosting server (Vercel)
- [ ] Environment variables configured in hosting console
- [ ] Verification steps completed on the live URL

---

# Live Demo
*Placeholder: Deployed Vercel URL will be attached here upon final deployment*
