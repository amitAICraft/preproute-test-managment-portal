# Preproute Test Management Portal

# Project Overview

The Preproute Test Management Portal is a comprehensive, production grade test management application designed for educational coordinators and test administrators. Built to facilitate the end to end lifecycle of academic evaluations, the portal enables users to seamlessly authenticate, manage tests, configure detailed test structures, construct questions with rich text formatting, and publish or schedule tests for students.

The application leverages a domain driven, feature first architecture, separating concerns across distinct, self contained feature folders. It coordinates multiple API integrations (such as subjects, topics, and question creation) with precise client-side validation using React Hook Form and Zod. The design strictly implements Figma specifications, delivering a premium, fully responsive dashboard that guarantees a consistent user experience across device viewports.

# Features

## Authentication

- Secure credential-based login screen matching the Figma layouts.
- Integration with authorization APIs to store authentication tokens and user state.
- Built-in route guards (`ProtectedRoute` and `PublicRoute`) to restrict unauthorized access.
- Global token injection inside API requests via Redux middleware.

## Dashboard

- Centralized view showing the complete list of available tests.
- Detailed metadata cards displaying the test type, duration, difficulty and marking scheme.
- Navigation paths directly into the test creation wizard or the question builder.
- Built-in empty states and loading skeletons to match UX guidelines.

## Test Creation

- Segmented control tabs to select the test category (e.g., Chapterwise, PYQ, Mock Test).
- Dynamic cascading selection fields for Subjects, Topics, and Sub-Topics fetched from the taxonomy APIs.
- Marking scheme configuration inputs (Correct Answer, Wrong Answer, Unattempted).
- Real-time calculation of total marks based on question counts and marking schemes.

## Question Builder

- Comprehensive sidebar showing question status indicators (saved, edited, unvisited).
- Interactive Rich Text Editor powered by TipTap for questions, options, and explanations.
- Dropdown fields to map specific topics and sub-topics to individual questions.
- Defensive validation checks to prevent saving incomplete questions.

## Publish

- Status transitions from Draft to Live status on the backend.
- Integration with the publish API endpoint to finalize test configurations.
- Accessible validation checks validating that a test has the minimum number of questions before publishing.

## Schedule

- Advanced scheduling controls allowing administrators to set future publication dates.
- Custom live duration limits (e.g., Always Available, 1 Week, 2 Weeks, or Custom Dates).
- Clean date and time picker overlays replacing native browser chrome.

# Bonus Features

- **Dashboard Local Search**: High-performance, client-side searching across test names and metadata.
- **Multi Filters**: Simultaneous cascading filters for test status, subjects, and creation dates.
- **Column Sorting**: Fully interactive header columns to sort tests in ascending or descending order.
- **Live Result Counter**: Instant display of matched search results and filtered test counts.
- **Responsive UI**: Pixel perfect implementation of Figma breakpoints ensuring compatibility with desktop, tablet, and mobile screens.

# Tech Stack

- **Frontend**: React 19, TypeScript 6, Vite 8
- **State Management**: Redux Toolkit (RTK) & RTK Query
- **Validation**: Zod 4, React Hook Form 7, @hookform/resolvers 5
- **Editor**: TipTap 3 (RichTextEditor)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4, Lucide React Icons
- **Deployment**: Vercel 

# Folder Structure

```text
Preproute-Assignment/
├── docs/                      # Architectural and coding standards documentation
├── project/
│   ├── src/
│   │   ├── app/               # Redux store & Routing configuration
│   │   ├── components/        # Reusable UI primitives, Form fields, & Layouts
│   │   ├── constants/         # Global application configurations & routes
│   │   ├── features/          # Domain-scoped features
│   │   │   ├── auth/          # Authentication screens and slices
│   │   │   ├── dashboard/     # Tests dashboard listing and statistics
│   │   │   └── tests/         # Creation form, question builder, & publish settings
│   │   ├── guards/            # Navigation guards
│   │   ├── hooks/             # Global React hooks
│   │   ├── lib/               # Utility functions and class mergers
│   │   ├── services/          # RTK Query base api configuration
│   │   └── types/             # Global TypeScript types
│   ├── package.json           # Project dependencies and run scripts
│   └── vite.config.ts         # Vite bundler options
└── README.md
└── ARCHITECTURE.md
└── API_INTEGRATION.md
└── BEST_PRACTICES.md
└── DEPLOYMENT.md
```

# Installation

To run the application locally, follow these steps:

1. Navigate to the project directory:

   ```bash
   cd project
   ```

2. Install all dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:

   ```bash
   npm run dev
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```

# Environment Variables

Configure the following environment variables in a `.env` file at the root of the `project` directory:

- `VITE_API_URL`: The base URL of the backend API server.
- `VITE_APP_NAME`: Name of the application (e.g., `Preproute`).

_Example configuration:_

```env
VITE_API_URL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_APP_NAME=Preproute
```

# API Integration

All communication with the backend is managed using RTK Query. Shared headers, token injection, and global error handling are centralized in a single base API instance. For a detailed breakdown of endpoints, tags, and request-response mappings, please refer to [coding-standards.md]

# Architecture

The project is built on a domain-driven, feature-first structure. Business logic, form validation, and query operations are encapsulated inside custom React hooks, separating them from the presentation layer. For a detailed description of the architecture, refer to [architecture.md].

# Best Practices

Linting, formatting, and typing rules are strictly enforced to preserve code quality. Prettier and ESLint are run on every commit to maintain consistency. Detailed guidelines are documented in [coding-standards.md].

# Deployment

The application compiles cleanly into a static build via Vite. It can be easily deployed to hosting services like Vercel or Railway. Environment variables are resolved dynamically at both build and run time to support serverless environments.

# Known Backend Limitations
- **CORS ISSUE**: The backend does not currently support to allow backend api access to all domain. Hence its not working on https://preproute-test-managment-portal.vercel.app/ yet. Backend team, need to whitelist this domain to acccess for this domain.


-  **CSV Upload**
The assignment mentions CSV upload, however:

   no API endpoint was available in documentation
   no CSV structure/specification was provided
   no sample CSV file was included
Therefore this functionality can not be implemented reliably with the available information.

- **Question Update API Unavailable**: The backend does not currently support modifying existing questions individually via a `PUT` endpoint. As a result, questions are deleted and recreated or saved in bulk.

- **Delete API Unavailable**: A DELETE endpoint for deleting whole tests (`DELETE /tests/:id`) is not exposed in the API; therefore, the delete action remains disabled in the user interface.

# Screenshots

### Login

<img width="1917" height="962" alt="image" src="https://github.com/user-attachments/assets/6cf5c8b7-8e07-4a83-969c-52d5ae34cafc" />

### Dashboard

<img width="1917" height="970" alt="image" src="https://github.com/user-attachments/assets/cd819ca3-6118-435f-a24a-417f6ba444f5" />

### Create Test

<img width="1912" height="972" alt="image" src="https://github.com/user-attachments/assets/9dee31e8-6110-49db-99ac-ce871a4b15eb" />

### Question Builder
<img width="1906" height="967" alt="image" src="https://github.com/user-attachments/assets/f2a31343-a5f4-4ae6-a9bb-48542d9e07c8" />
<img width="1916" height="960" alt="image" src="https://github.com/user-attachments/assets/6b654df1-4ce5-4bef-af98-04c0c18723f6" />

### Publish
<img width="1896" height="960" alt="image" src="https://github.com/user-attachments/assets/b7e4445c-7fa6-492c-bf41-d160abb4064a" />

### Schedule

<img width="1886" height="962" alt="image" src="https://github.com/user-attachments/assets/9e5bc5f5-266d-4f65-8dad-6c7e9b8bc5cc" />

# Live Demo

[Click Here_](https://preproute-test-managment-portal.vercel.app/)

# GitHub Repository

[Click here](https://github.com/amitAICraft/preproute-test-managment-portal)

# Project Documentation

This project includes detailed engineering documentation for reviewers.

For detailed implementation decisions and engineering documentation, please refer to the documents listed below.

| Document | Description |
|----------|-------------|
| README.md | Project overview, setup guide, features and application flow |
| ARCHITECTURE.md | Application architecture, folder structure, design decisions and scalability |
| API_INTEGRATION.md | Complete API integration details, request flow, endpoint mapping and backend limitations |
| BEST_PRACTICES.md | Engineering practices, coding standards, performance, security and maintainability |
| DEPLOYMENT.md | Local setup, build, deployment and troubleshooting guide |
