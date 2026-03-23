# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run oxlint
- `bun run lint:fix` - Run oxlint with auto-fix

### Database Commands
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio (database viewer)
- `bun run setup:admin` - Setup admin user (run after initial setup)

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router and TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Package Manager**: bun
- **Rich Text**: Tiptab editor with KaTeX for mathematical notation
- **File Storage**: AWS S3

### Project Structure

#### App Router Organization
```
app/
├── (auth)/           - Authentication flows (sign-in, sign-up)
├── (blogs)/          - Blog content management
├── (Events)/         - Competitions, events, news
├── dashboard/        - Admin interface
└── api/              - API routes
```

#### Key Components Structure
```
components/
├── auth/             - Authentication components
├── common/           - Shared utilities (KatexRenderer, ImageUploader)
├── dashboard/        - Admin dashboard components
├── practice/         - Practice problem components
├── tiptap-ui/        - Custom TipTap editor components
└── ui/               - Shadcn UI components
```

#### Data Layer
```
db/
├── schema.ts         - Drizzle database schema
├── migrations/       - SQL migration files
└── migrate.ts        - Migration runner

data/
├── practice-problems/ - Static practice problem data
└── types.ts          - TypeScript type definitions
```

### Mathematical Content Handling
- **Rendering**: Use `KatexRenderer` component for LaTeX/mathematical notation
- **Editor**: TipTap editor with custom math formula button extension
- **Practice Problems**: Structured by competition type (CIMOC, PHIMO) and year/grade

### Authentication & Authorization
- Uses Clerk for authentication
- Role-based access: students, teachers, admins
- Protected routes in dashboard for admin functions

### Database Schema Key Tables
- `users` - User profiles (extends Clerk users)
- `Olympaid Competition` - Competition and event information  
- `blog_posts` - Blog articles with rich text content
- Practice problem data is primarily static files, not database-stored

### File Upload & Media
- AWS S3 integration for file storage
- `ImageUploader` component for admin file uploads
- Configured domains in `next.config.ts` for external images

## Development Guidelines

### Code Conventions
- Use TypeScript strictly - avoid `any` types
- Components use PascalCase, files use kebab-case
- Prefer named exports over default exports
- Use Zod for validation schemas
- Follow existing patterns for database queries and API routes

### Mathematical Content
- Always use `KatexRenderer` for displaying mathematical notation
- Structure practice problems by competition → year → grade hierarchy
- Include accessibility features for mathematical content

### Performance Considerations
- Large mathematical content should use React.memo
- Practice problem lists may need virtualization for scale
- Use Next.js Image component for optimized image loading

### Testing
- Check for existing test patterns before adding new tests
- Focus on mathematical rendering accuracy and accessibility
- Test role-based access control thoroughly