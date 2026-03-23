# CMS — Reusable Content Management System

A baseline CMS built with Next.js, designed to be forked and customized for any project that needs blog management, user authentication, and a dashboard.

## Features

- **Blog System** — Create, edit, schedule, and publish blog posts with a TipTap rich text editor
- **Dashboard** — Admin panel with user management, blog management, and analytics
- **Authentication** — Sign in / sign up with Better Auth (supports OAuth)
- **File Uploads** — AWS S3 presigned URL pipeline for images and media
- **Dark Mode** — Light/dark theme switching via next-themes
- **Data Tables** — Sortable, filterable tables with TanStack Table
- **Responsive** — Mobile-first design with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) (App Router) + TypeScript |
| Runtime | [Bun](https://bun.sh) |
| UI | [Shadcn UI](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) |
| Rich Text | [TipTap](https://tiptap.dev) (StarterKit) |
| Auth | [Better Auth](https://better-auth.com) |
| Database | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team) |
| Storage | AWS S3 |
| Forms | React Hook Form + Zod |
| Deployment | [Vercel](https://vercel.com) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- PostgreSQL database
- AWS S3 bucket (for file uploads)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cms

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cms

# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
```

## Project Structure

```
├── app/                  # Next.js App Router (pages, API routes, layouts)
│   ├── api/              # REST API endpoints (blogs, users, uploads, auth)
│   ├── dashboard/        # Admin dashboard pages
│   ├── (auth)/           # Authentication pages
│   └── (blogs)/          # Public blog pages
├── components/           # React components
│   ├── ui/               # Shadcn UI primitives
│   ├── dashboard/        # Dashboard-specific components
│   ├── blog/             # Blog-specific components
│   ├── auth/             # Auth forms and UI
│   ├── layout/           # Navbar, Footer, etc.
│   └── common/           # Shared utilities
├── db/                   # Database schema, migrations, seeds
├── drizzle/              # Drizzle ORM migration files
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, API clients, DAL, auth config
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run linter (oxlint) |
| `bun run db:migrate` | Run database migrations |
| `bun run db:generate` | Generate migration files |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run setup:admin` | Create admin user |

## License

MIT
