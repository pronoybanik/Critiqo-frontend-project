# Critiqo

Critiqo is a product-review web application built with Next.js and React. Visitors can browse product reviews, while account and dashboard pages support review and comment management. The app also includes category administration and payment-related pages.

This repository contains the frontend only. Most user, review, category, vote, and payment data is loaded from a separate backend API.

## Tech stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Radix UI components and shadcn-style UI primitives
- React Hook Form and Zod for forms and validation
- Sonner for toast notifications

## Requirements

- Node.js 18.18 or later
- npm
- Access to a compatible Critiqo backend API

## Getting started

1. Clone the repository and enter the project directory:

   ```powershell
   git clone https://github.com/pronoybanik/Critiqo-frontend-project.git
   cd Critiqo-frontend-project
   ```

2. Install dependencies:

   ```powershell
   npm ci
   ```

3. Create a `.env.local` file in the project root and set the base URL of the backend API:

   ```env
   NEXT_PUBLIC_BASE_API=http://localhost:5000
   ```

   Replace the example URL with the URL where your backend is running. The value should be the API base URL used by routes such as `/user`, `/reviews`, and `/categories`. The backend is not included in this repository.

4. Start the development server:

   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The development server reloads the app as you edit files. Keep the backend running as well; pages that fetch API data may not work correctly without it.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run the project's Next.js lint command |

## Project structure

```text
.
├── public/                     # Static files served from the site root
├── src/
│   ├── app/                    # App Router pages, layouts, and global styles
│   │   ├── (withCommonLayout)/ # Public pages and shared site layout
│   │   ├── (withDashboardLayout)/ # Admin and guest dashboard pages
│   │   ├── login/              # Login page
│   │   └── register/           # Registration page
│   ├── assets/                 # Images and other imported assets
│   ├── components/
│   │   ├── modules/            # Feature-specific page sections and forms
│   │   ├── shared/             # Shared navigation, buttons, and utilities
│   │   └── ui/                 # Reusable UI primitives
│   ├── context/                # React context, including user state
│   ├── lib/                    # Shared helper functions
│   ├── providers/              # Application-level providers
│   ├── services/               # Backend API calls (auth, reviews, users, etc.)
│   ├── types/                  # Shared TypeScript types
│   ├── interfaces/             # Additional TypeScript declarations
│   └── middleware.ts           # Request middleware
├── .env.local                  # Local environment settings (create this file)
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and npm scripts
└── tsconfig.json               # TypeScript configuration and @/* path alias
```

The route groups in `src/app` organize layouts and do not appear in the browser URL. For example, the common-layout group contains public routes such as reviews, profile, and payment, while the dashboard group contains admin and guest routes.

## Configuration notes

- `NEXT_PUBLIC_BASE_API` is required for API-backed pages and actions. Configure it in `.env.local`, then restart the development server after changing it.
- Review image uploads use a Cloudinary cloud name and unsigned upload preset configured in `src/components/shared/UploadToCloudinary.ts`.
- Do not put private backend credentials or secrets in `NEXT_PUBLIC_*` variables; values with this prefix are exposed to the browser.

## Production

Build and run the production version with:

```powershell
npm run build
npm run start
```

Set `NEXT_PUBLIC_BASE_API` in the deployment environment to the production backend API URL before building and deploying the frontend.
