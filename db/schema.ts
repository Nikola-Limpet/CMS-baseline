// =============================================================================
// SCHEMA - Main entry point
// =============================================================================
// This file re-exports everything from the schema directory.
//
// Schema is organized into the following domain modules:
//   - enums.ts : Custom enum definitions
//   - auth.ts  : Better Auth tables (user, session, account, etc.)
//   - blog.ts  : Blog posts, categories, and tags

export * from './schema/index';
