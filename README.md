# MOVE Mathematical Olympiad Platform

A comprehensive website for the MOVE organization to announce competitions, share resources, and connect with students participating in mathematics competitions across Asia.

## Project Overview

This platform serves as the central hub for the MOVE organization. It provides information about upcoming competitions, resources for students, event announcements, and celebrates achievements of participants. The website combines informational content with interactive features for students and administrators.




<!-- bg-gradient-to-br from-teal-50 via-sky-50 to-blue-50  (bg gradient) -->

<!-- rgb(20 184 166 / 0.15)" // Teal, slightly less opaque -->
<!-- rgb(59 130 246 / 0.1) // Blue, less opaque -->
## Core Features

### 1. Public Content
- **Home Page**: Overview of the organization and featured competitions
- **Events Section**: Calendar and details of upcoming/past competitions
- **Blog Posts**: Articles about mathematics, competition experiences, and announcements
- **Awarding Page**: Recognition of winners and participants
- **Resources**: Sample questions, practice materials, and preparation guides
- **About Page**: Information about the organization and its mission

### 2. Interactive Features
- **Practice Problems**: Interactive math problems with immediate feedback (client-side evaluation)
- **Competition Registration**: Sign-up forms for upcoming competitions
- **User Profiles**: Student profiles with competition history and achievements

### 3. Administrative Features
- **Content Management**: CRUD operations for events, blog posts, and resources
- **User Management**: View and manage student accounts
- **Media Management**: Upload and organize images and documents
- **Competition Management**: Create and update competition details

## Technology Stack

### Frontend
- **Framework**: Next.js (React) with TypeScript
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation

### Backend & Infrastructure
- **Database & Authentication**: Supabase
  - PostgreSQL database for structured data
  - Storage buckets for files and media
  - Authentication with social login (Google)
- **Deployment**: Vercel

### Key Libraries
- **Rich Text Editor**: TipTap for blog post authoring
- **Date/Time**: date-fns for date manipulation
- **Mathematics**: MathJax/KaTeX for rendering mathematical notations
- **State Management**: Zustand for client-side state
- **File Storage**: AWS S3 for secure file uploads and storage

## File Upload System (S3)

The application uses AWS S3 for file uploads instead of local filesystem storage. This provides scalable, secure file management.

### Environment Variables for S3

Add these to your `.env.local` file:

```env
# AWS S3 Configuration (Required for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_BUCKET_NAME=your-smart-edu-bucket

# Optional: Public environment variables for client-side URL construction
NEXT_PUBLIC_AWS_BUCKET_NAME=your-smart-edu-bucket
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### S3 Setup

1. **Create S3 Bucket**: Create a bucket in your AWS account
2. **Configure CORS**: Add CORS configuration to allow uploads:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```
3. **IAM Permissions**: Create IAM user with these S3 permissions:
   - `s3:PutObject`
   - `s3:GetObject` 
   - `s3:DeleteObject`
   - `s3:PutObjectAcl`

### Upload Functions

```typescript
// Practice problem images
import { uploadPracticeImage } from '@/lib/utils/upload'
const imageUrl = await uploadPracticeImage(file, problemId)

// General images
import { uploadImage } from '@/lib/utils/upload'
const imageUrl = await uploadImage(file, 'context')

// Blog images
import { uploadBlogImage } from '@/lib/utils/upload'
const imageUrl = await uploadBlogImage(file)
```

### File Organization

Files are organized in S3 with the following structure:
- `practice-problems/{problemId}/images/` - Practice problem images
- `blog-images/` - Blog post images  
- `uploads/{type}/` - General uploads
- `images/{context}/` - Contextual images

## Implementation Plan

### Phase 1: Core Setup & Public Pages
1. Project initialization with Next.js, TypeScript, and Tailwind CSS
2. Supabase setup for database and authentication
3. Implement basic layout and navigation
4. Create static pages (Home, About)
5. Build Events section with listing and details

### Phase 2: Interactive Features
1. Implement authentication system for students and admins
2. Create practice problem platform with interactive questions
3. Build user profile pages
4. Develop blog system with rich text editing

### Phase 3: Admin Dashboard
1. Create admin portal with content management capabilities
2. Implement media management system
3. Build analytics dashboard for admin insights
4. Finalize user management features

### Phase 4: Refinement & Launch
1. Implement responsive design optimizations
2. Conduct performance optimization
3. Add internationalization support (Khmer/English)
4. Deploy to production

## Database Schema (Supabase)

### Tables
- **users**: User profiles (extended from auth.users)
- **events**: Competition and event information
- **blog_posts**: Blog articles and announcements
- **awards**: Recognition and award records
- **resources**: Educational materials and documents
- **practice_problems**: Math problems for student practice

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd move-market-site

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.