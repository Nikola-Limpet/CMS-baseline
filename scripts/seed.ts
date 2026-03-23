// env loaded via dotenv-cli in package.json script
import { db } from '../db';
import {
  user,
  account,
  blogPosts,
  blogCategories,
  blogTags,
  blogPostCategories,
  blogPostTags,
  events,
  eventCategories,
  eventPostCategories,
  testimonials,
} from '../db/schema';
import { hashPassword } from 'better-auth/crypto';
import { v4 as uuid } from 'uuid';

async function seed() {
  console.log('Seeding database...\n');
  // ── Reset Database ───────────────────────────────────────────────────

  await db.delete(testimonials);
  await db.delete(eventPostCategories);
  await db.delete(events);
  await db.delete(eventCategories);
  await db.delete(blogPostTags);
  await db.delete(blogPostCategories);
  await db.delete(blogPosts);
  await db.delete(blogTags);
  await db.delete(blogCategories);
  await db.delete(account);
  await db.delete(user);

  console.log('✓ Database cleared');

  // ── Users ──────────────────────────────────────────────────────────────

  const adminId = uuid();
  const authorId = uuid();

  const adminHash = await hashPassword('admin123');
  const authorHash = await hashPassword('author123');

  await db.insert(user).values([
    {
      id: adminId,
      name: 'Admin',
      email: 'admin@cms.local',
      emailVerified: true,
      role: 'admin',
      bio: 'System administrator for the CMS platform.',
    },
    {
      id: authorId,
      name: 'Jane Author',
      email: 'jane@cms.local',
      emailVerified: true,
      role: 'user',
      bio: 'Writer and developer. I write about web development, design, and open source tools.',
    },
  ]).onConflictDoNothing();

  await db.insert(account).values([
    {
      id: uuid(),
      accountId: adminId,
      providerId: 'credential',
      userId: adminId,
      password: adminHash,
    },
    {
      id: uuid(),
      accountId: authorId,
      providerId: 'credential',
      userId: authorId,
      password: authorHash,
    },
  ]).onConflictDoNothing();

  console.log('✓ Users created');
  console.log('  admin@cms.local / admin123 (admin)');
  console.log('  jane@cms.local  / author123 (author)\n');

  // ── Categories ─────────────────────────────────────────────────────────

  const categoryIds = {
    technology: uuid(),
    design: uuid(),
    tutorials: uuid(),
    updates: uuid(),
  };

  await db.insert(blogCategories).values([
    { id: categoryIds.technology, name: 'Technology', slug: 'technology', description: 'Posts about web technology and programming' },
    { id: categoryIds.design, name: 'Design', slug: 'design', description: 'UI/UX design, typography, and visual design' },
    { id: categoryIds.tutorials, name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides and how-to articles' },
    { id: categoryIds.updates, name: 'Updates', slug: 'updates', description: 'Project updates and announcements' },
  ]).onConflictDoNothing();

  console.log('✓ Categories created\n');

  // ── Tags ───────────────────────────────────────────────────────────────

  const tagIds = {
    nextjs: uuid(),
    react: uuid(),
    typescript: uuid(),
    opensource: uuid(),
    tailwind: uuid(),
  };

  await db.insert(blogTags).values([
    { id: tagIds.nextjs, name: 'Next.js', slug: 'nextjs' },
    { id: tagIds.react, name: 'React', slug: 'react' },
    { id: tagIds.typescript, name: 'TypeScript', slug: 'typescript' },
    { id: tagIds.opensource, name: 'Open Source', slug: 'open-source' },
    { id: tagIds.tailwind, name: 'Tailwind CSS', slug: 'tailwind-css' },
  ]).onConflictDoNothing();

  console.log('✓ Tags created\n');

  // ── Blog Posts ─────────────────────────────────────────────────────────

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  const posts = [
    {
      id: uuid(),
      title: 'Building a Modern CMS with Next.js and Drizzle ORM',
      slug: 'building-modern-cms-nextjs-drizzle',
      excerpt: 'A deep dive into how we built this CMS from scratch using Next.js App Router, Drizzle ORM, and Better Auth for a clean developer experience.',
      content: `<h2>Why Build a Custom CMS?</h2>
<p>Off-the-shelf CMS platforms are great, but sometimes you need something tailored to your workflow. This project started as a way to have full control over the content pipeline — from editing to publishing — without the overhead of a headless CMS subscription.</p>

<h2>The Stack</h2>
<p>We chose a modern, type-safe stack that prioritizes developer experience:</p>
<ul>
  <li><strong>Next.js 16</strong> with App Router for file-system based routing and server components</li>
  <li><strong>Drizzle ORM</strong> for type-safe database queries with zero runtime overhead</li>
  <li><strong>Better Auth</strong> for authentication with OAuth and email/password support</li>
  <li><strong>TipTap</strong> as the rich text editor for blog content</li>
  <li><strong>Tailwind CSS</strong> with shadcn/ui for a consistent design system</li>
</ul>

<h2>Key Design Decisions</h2>
<p>Server Components are the default. We only reach for client components when we need interactivity — form inputs, the text editor, and navigation menus. This keeps the JavaScript bundle small and pages fast.</p>

<h3>Data Access Layer</h3>
<p>All database queries go through a centralized DAL in <code>lib/dal/</code>. Each function is wrapped with React's <code>cache()</code> for request-level deduplication. This means if two components on the same page call <code>getFeaturedBlogPost()</code>, only one database query fires.</p>

<h3>Authentication</h3>
<p>Better Auth handles user sessions, password hashing, and OAuth flows. The admin plugin gives us role-based access control without writing custom middleware. Protected routes check the session server-side and redirect if needed.</p>

<h2>What's Next</h2>
<p>We're planning to add scheduled publishing, a richer editor with image uploads, and an API for external integrations. The codebase is open source — fork it and make it yours.</p>`,
      coverImage: '/images/blog/cms_next_drizzle_lofi.png',
      published: true,
      publishedAt: daysAgo(2),
      userId: authorId,
      categories: [categoryIds.technology, categoryIds.tutorials],
      tags: [tagIds.nextjs, tagIds.typescript],
    },
    {
      id: uuid(),
      title: 'Designing a Clean Blog Layout with Tailwind CSS',
      slug: 'designing-clean-blog-layout-tailwind',
      excerpt: 'How we approached the visual design of this CMS — dark mode first, serif headings, and a focus on readability.',
      content: `<h2>Design Philosophy</h2>
<p>Good design should be invisible. Readers should focus on the content, not the chrome around it. That's why we chose a minimal aesthetic with generous whitespace and a clear typographic hierarchy.</p>

<h2>Typography</h2>
<p>We use <strong>Instrument Serif</strong> for headings to add warmth and personality, paired with <strong>Geist Sans</strong> for body text. The contrast between serif and sans-serif creates a clear visual hierarchy without needing heavy font weights or large size differences.</p>

<h2>Dark Mode First</h2>
<p>The homepage hero is always dark — it sets the tone for the product. The rest of the site respects the user's system preference via <code>next-themes</code>. We use CSS custom properties for all colors, making theme switching seamless.</p>

<h2>Component Library</h2>
<p>Every UI element comes from shadcn/ui. Instead of importing a pre-built library, shadcn copies component source code directly into your project. This means you own the code and can customize it freely. We've customized the Button, Card, and Badge components to match our design language.</p>

<h2>Responsive Strategy</h2>
<p>Mobile-first with Tailwind breakpoints. The blog grid goes from 1 column on mobile to 3 columns on desktop. The navigation collapses into a slide-out panel. Every interactive element has proper touch targets (minimum 44px).</p>`,
      coverImage: '/images/blog/tailwind_design_lofi.png',
      published: true,
      publishedAt: daysAgo(5),
      userId: authorId,
      categories: [categoryIds.design],
      tags: [tagIds.tailwind, tagIds.react],
    },
    {
      id: uuid(),
      title: 'Getting Started: Your First Blog Post',
      slug: 'getting-started-first-blog-post',
      excerpt: 'A quick walkthrough of creating, editing, and publishing your first blog post using the CMS dashboard.',
      content: `<h2>Step 1: Sign In</h2>
<p>Head to <code>/sign-in</code> and log in with your credentials. If you're running the seed script, use <code>jane@cms.local</code> / <code>author123</code> to get started.</p>

<h2>Step 2: Open the Dashboard</h2>
<p>Once signed in, click "Dashboard" in the navigation bar. You'll see an overview of your content — recent posts, quick stats, and action buttons.</p>

<h2>Step 3: Create a New Post</h2>
<p>Click "New Post" from the dashboard. You'll see the blog editor with:</p>
<ul>
  <li>A <strong>title field</strong> — the slug is auto-generated from the title</li>
  <li>A <strong>TipTap rich text editor</strong> — supports headings, lists, code blocks, images, and more</li>
  <li>A <strong>featured image uploader</strong> — drag and drop or click to upload</li>
  <li><strong>Categories and tags</strong> — select existing ones or create new ones inline</li>
  <li>A <strong>publish toggle</strong> — save as draft or publish immediately</li>
</ul>

<h2>Step 4: Preview and Publish</h2>
<p>Your post auto-saves every 10 seconds as a draft. When you're ready, toggle "Published" and hit save. Your post will appear on the blog page immediately.</p>

<h2>Tips</h2>
<p>Write a good excerpt — it shows up on the blog listing page and in search results. Add a cover image for visual impact. Use categories to organize your content and tags for discoverability.</p>`,
      coverImage: '/images/blog/first_post_lofi.png',
      published: true,
      publishedAt: daysAgo(8),
      userId: authorId,
      categories: [categoryIds.tutorials],
      tags: [tagIds.nextjs],
    },
    {
      id: uuid(),
      title: 'Why We Chose Better Auth Over NextAuth',
      slug: 'why-better-auth-over-nextauth',
      excerpt: 'A comparison of authentication libraries for Next.js and why Better Auth was the right fit for this project.',
      content: `<h2>The Authentication Landscape</h2>
<p>Authentication in Next.js has several options: NextAuth (now Auth.js), Clerk, Lucia, and Better Auth. Each has trade-offs in complexity, flexibility, and control.</p>

<h2>Why Better Auth?</h2>
<p>We chose Better Auth for several reasons:</p>

<h3>1. Database-First</h3>
<p>Better Auth uses your existing database directly. No separate auth database, no external service. Your user table lives alongside your content tables in the same PostgreSQL database, making JOINs between users and blog posts trivial.</p>

<h3>2. Plugin System</h3>
<p>The <code>admin()</code> plugin adds role-based access control. The <code>organization()</code> plugin adds multi-tenant support. These are opt-in — you only pay for what you use.</p>

<h3>3. Full Control</h3>
<p>Unlike managed auth services, you own the entire auth flow. Password hashing, session management, and token generation all happen in your infrastructure. No vendor lock-in, no monthly fees.</p>

<h2>Integration with Drizzle</h2>
<p>Better Auth's Drizzle adapter lets us define auth tables in the same schema file as our application tables. The type inference flows through — <code>user.$inferSelect</code> gives us a fully typed user object that includes our custom fields like <code>bio</code> and <code>preferences</code>.</p>

<h2>The Trade-Off</h2>
<p>Better Auth requires more setup than a managed service like Clerk. But for an open-source CMS that people will self-host, owning the auth layer is essential. You shouldn't need a third-party subscription to log into your own CMS.</p>`,
      coverImage: '/images/blog/betterauth_lofi.png',
      published: true,
      publishedAt: daysAgo(12),
      userId: authorId,
      categories: [categoryIds.technology],
      tags: [tagIds.nextjs, tagIds.typescript, tagIds.opensource],
    },
    {
      id: uuid(),
      title: 'Open Source and What Comes Next',
      slug: 'open-source-and-whats-next',
      excerpt: 'This CMS is now open source. Here is what we have planned for the roadmap and how you can contribute.',
      content: `<h2>Going Open Source</h2>
<p>We believe developer tools should be open. This CMS is released under the MIT license — fork it, modify it, use it commercially, whatever you need.</p>

<h2>Roadmap</h2>
<p>Here's what we're working on next:</p>
<ul>
  <li><strong>Scheduled publishing</strong> — set a date and time for posts to go live automatically</li>
  <li><strong>Draft collaboration</strong> — share draft links with reviewers before publishing</li>
  <li><strong>API access</strong> — REST endpoints for headless usage</li>
  <li><strong>Image optimization</strong> — automatic resizing and WebP conversion on upload</li>
  <li><strong>Search</strong> — full-text search across all published content</li>
</ul>

<h2>Contributing</h2>
<p>The best way to contribute is to use it. File issues when you find bugs, suggest features that would make your workflow better, and share what you build with it.</p>

<p>If you want to contribute code, the project uses:</p>
<ul>
  <li><strong>bun</strong> as the package manager</li>
  <li><strong>oxlint</strong> for linting</li>
  <li><strong>Drizzle Kit</strong> for database migrations</li>
  <li><strong>TypeScript strict mode</strong> throughout</li>
</ul>

<p>Run <code>bun run dev</code> to start the development server, <code>bun run db:seed</code> to populate sample data, and you're ready to go.</p>`,
      coverImage: '/images/blog/opensource_lofi.png',
      published: true,
      publishedAt: daysAgo(15),
      userId: adminId,
      categories: [categoryIds.updates],
      tags: [tagIds.opensource],
    },
  ];

  for (const post of posts) {
    const { categories, tags, ...postData } = post;

    await db.insert(blogPosts).values(postData).onConflictDoNothing();

    if (categories.length > 0) {
      await db.insert(blogPostCategories).values(
        categories.map((categoryId) => ({
          postId: post.id,
          categoryId,
        }))
      ).onConflictDoNothing();
    }

    if (tags.length > 0) {
      await db.insert(blogPostTags).values(
        tags.map((tagId) => ({
          postId: post.id,
          tagId,
        }))
      ).onConflictDoNothing();
    }
  }

  console.log(`✓ ${posts.length} blog posts created\n`);

  // ── Event Categories ──────────────────────────────────────────────────

  const eventCatIds = {
    competition: uuid(),
    workshop: uuid(),
    meetup: uuid(),
  };

  await db.insert(eventCategories).values([
    { id: eventCatIds.competition, name: 'Competition', slug: 'competition', description: 'Math and science competitions' },
    { id: eventCatIds.workshop, name: 'Workshop', slug: 'workshop', description: 'Hands-on learning workshops' },
    { id: eventCatIds.meetup, name: 'Meetup', slug: 'meetup', description: 'Community meetups and socials' },
  ]).onConflictDoNothing();

  console.log('✓ Event categories created\n');

  // ── Events ────────────────────────────────────────────────────────────

  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  const seedEvents = [
    {
      id: uuid(),
      title: 'Spring Math Olympiad 2026',
      slug: 'spring-math-olympiad-2026',
      excerpt: 'Test your problem-solving skills in our annual spring math competition. Open to all grade levels.',
      content: `<h2>About the Olympiad</h2>
<p>The Spring Math Olympiad is our flagship annual competition, bringing together students from across the region to tackle challenging problems in algebra, geometry, combinatorics, and number theory.</p>

<h2>Format</h2>
<ul>
  <li><strong>Individual Round</strong> — 90 minutes, 30 problems of increasing difficulty</li>
  <li><strong>Team Round</strong> — 45 minutes, 10 problems solved collaboratively in teams of 4</li>
  <li><strong>Speed Round</strong> — 30 minutes, rapid-fire questions</li>
</ul>

<h2>Who Can Participate?</h2>
<p>Students in grades 6–12 are welcome. No prior competition experience is required — this is a great event for first-timers and seasoned competitors alike.</p>

<h2>Prizes</h2>
<p>Top scorers in each division receive certificates and medals. The winning team receives a trophy and individual prizes.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400&q=80',
      published: true,
      publishedAt: daysAgo(3),
      eventDate: daysFromNow(14),
      eventEndDate: daysFromNow(14),
      location: 'University Conference Hall, Room 301',
      registrationUrl: 'https://example.com/register/spring-olympiad',
      userId: adminId,
      categories: [eventCatIds.competition],
    },
    {
      id: uuid(),
      title: 'Introduction to Competitive Programming Workshop',
      slug: 'intro-competitive-programming-workshop',
      excerpt: 'Learn the fundamentals of competitive programming — data structures, algorithms, and problem-solving strategies.',
      content: `<h2>What You'll Learn</h2>
<p>This workshop covers the essentials every competitive programmer needs:</p>
<ul>
  <li>Array and string manipulation techniques</li>
  <li>Sorting algorithms and when to use them</li>
  <li>Greedy algorithms and dynamic programming basics</li>
  <li>Graph traversal (BFS/DFS)</li>
  <li>Tips for reading competition problems effectively</li>
</ul>

<h2>Prerequisites</h2>
<p>You should be comfortable with basic programming in at least one language (Python, C++, or Java). We'll provide practice problems in all three languages.</p>

<h2>What to Bring</h2>
<p>A laptop with your preferred IDE or editor installed. We'll have Wi-Fi and power outlets available.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
      published: true,
      publishedAt: daysAgo(1),
      eventDate: daysFromNow(7),
      eventEndDate: daysFromNow(7),
      location: 'Online — Zoom',
      registrationUrl: 'https://example.com/register/cp-workshop',
      userId: authorId,
      categories: [eventCatIds.workshop],
    },
    {
      id: uuid(),
      title: 'Monthly Dev Community Meetup — April',
      slug: 'dev-community-meetup-april-2026',
      excerpt: 'Join us for our monthly meetup — lightning talks, networking, and pizza.',
      content: `<h2>Agenda</h2>
<ul>
  <li><strong>6:00 PM</strong> — Doors open, food and drinks</li>
  <li><strong>6:30 PM</strong> — Lightning talk: "Building a CMS with Next.js" by Jane Author</li>
  <li><strong>7:00 PM</strong> — Lightning talk: "Auth in 2026 — What's Changed" by Admin</li>
  <li><strong>7:30 PM</strong> — Open networking and Q&A</li>
  <li><strong>8:30 PM</strong> — Wrap up</li>
</ul>

<h2>Lightning Talk Proposals</h2>
<p>Want to give a 15-minute talk? We're always looking for speakers. Topics can be anything tech-related — a project you built, a tool you love, a lesson you learned.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
      published: true,
      publishedAt: daysAgo(5),
      eventDate: daysFromNow(21),
      location: 'Tech Hub Co-working Space',
      userId: adminId,
      categories: [eventCatIds.meetup],
    },
    {
      id: uuid(),
      title: 'Winter Problem Solving Contest 2025',
      slug: 'winter-problem-solving-contest-2025',
      excerpt: 'Our winter contest featured 120 participants across 3 divisions. Here are the results and standout problems.',
      content: `<h2>Results</h2>
<p>Congratulations to all 120 participants across Junior, Intermediate, and Senior divisions!</p>

<h2>Highlights</h2>
<p>Problem 5 in the Senior division — a combinatorics challenge involving lattice paths — had a solve rate of just 8%. The elegant solution used a bijection to Catalan numbers.</p>

<p>The Junior division saw a record number of perfect scores in the individual round, with 7 students achieving full marks.</p>

<h2>Thank You</h2>
<p>Thanks to our volunteers, problem setters, and sponsors for making this event possible. See you next winter!</p>`,
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
      published: true,
      publishedAt: daysAgo(60),
      eventDate: daysAgo(45),
      eventEndDate: daysAgo(44),
      location: 'City Convention Center',
      userId: authorId,
      categories: [eventCatIds.competition],
    },
  ];

  for (const event of seedEvents) {
    const { categories: eventCats, ...eventData } = event;

    await db.insert(events).values(eventData).onConflictDoUpdate({
      target: events.slug,
      set: { coverImage: eventData.coverImage, updatedAt: new Date() },
    });

    if (eventCats.length > 0) {
      await db.insert(eventPostCategories).values(
        eventCats.map((categoryId) => ({
          eventId: event.id,
          categoryId,
        }))
      ).onConflictDoNothing();
    }
  }

  console.log(`✓ ${seedEvents.length} events created\n`);

  // ── Testimonials ──────────────────────────────────────────────────────

  await db.insert(testimonials).values([
    {
      id: uuid(),
      authorName: 'Sarah Chen',
      authorTitle: 'Lead Developer at TechCo',
      content: 'This CMS is exactly what we needed — fast, clean, and easy to customize. The TipTap editor is a joy to use, and the dashboard gives us full control over our content.',
      rating: 5,
      featured: true,
      published: true,
      displayOrder: 0,
    },
    {
      id: uuid(),
      authorName: 'Marcus Rodriguez',
      authorTitle: 'Freelance Writer',
      content: 'I have tried dozens of CMS platforms. This one stands out for its simplicity. No bloat, no unnecessary features — just a great writing experience with a beautiful frontend.',
      rating: 5,
      featured: true,
      published: true,
      displayOrder: 1,
    },
    {
      id: uuid(),
      authorName: 'Emily Park',
      authorTitle: 'Founder, DesignStudio',
      content: 'Open source, self-hosted, and looks great out of the box. We forked it for our agency blog and had it running in production within an afternoon.',
      rating: 4,
      featured: true,
      published: true,
      displayOrder: 2,
    },
    {
      id: uuid(),
      authorName: 'David Kim',
      authorTitle: 'Student',
      content: 'As a computer science student, this project taught me a lot about Next.js, Drizzle ORM, and building full-stack applications. The code is clean and well-organized.',
      rating: 5,
      featured: false,
      published: true,
      displayOrder: 3,
    },
  ]).onConflictDoNothing();

  console.log('✓ 4 testimonials created\n');
  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
