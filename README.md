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
   NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
   ```

   Replace the example URL with your backend's versioned API base URL. The frontend uses `/api/v1` for existing user, review, and category routes; newly added SEO/content tools derive the backend's `/api` base from this value. The backend is not included in this repository.

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

## SEO, content editing, and Vercel deployment

### SEO management and editor

Administrators can manage site-wide SEO defaults and per-content metadata at
`/admin/seo`. The content editor supports blog posts and reviews, with
paragraphs, H1–H4 headings, lists, links, images, SEO analysis, search previews,
JSON-LD schema, and image metadata. Content HTML is saved through the backend,
which sanitizes it before storage. Public blog details are available at
`/blog/[slug]`.

The SEO metadata for the home, about, contact, blog-list, and review-list pages
is loaded from the backend's public SEO endpoint where a published `Page`
record exists. The frontend uses page-specific defaults if the endpoint is
unavailable or a page record has not been seeded. SEO schema JSON-LD is emitted
when returned by that endpoint; a basic page/site JSON-LD value is emitted as a
fallback. To keep these routes aligned with the SEO tool, initialize the
backend's default site settings and public page records.

Known limitations: the frontend currently has a sample-data blog index; create
and edit routes use `/admin/blog/new`, `/admin/blog/[id]`,
`/admin/reviews/new`, and `/admin/reviews/[id]`. SEO tools for unsaved content
become available after the first save. The configured Cloudinary upload helper
uses its existing unsigned upload setup.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_API` | Yes | Backend versioned API base URL for existing services (for example, `https://api.example.com/api/v1`). New SEO/content endpoints use the corresponding `/api` root. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public frontend origin used as the metadata base, canonical fallback, and deployment URL (for example, `https://www.example.com`). |

Set these values in `.env.local` for development and in the Vercel project
environment for Preview and Production. Do not put private credentials in
`NEXT_PUBLIC_*` variables.

### Deploy to Vercel

Import the frontend project into Vercel, configure the environment variables
above, and use the following production build command:

```text
npm run build
```

Vercel detects Next.js automatically; no custom output directory is required.
