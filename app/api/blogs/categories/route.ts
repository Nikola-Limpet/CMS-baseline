import { NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/auth/require';

// Dynamic import to prevent build-time issues
let db: any;
let blogCategories: any;

async function getDbConnection() {
  if (!db) {
    try {
      const { db: dbConnection } = await import('@/db');
      const { blogCategories: categories } = await import('@/db/schema');
      db = dbConnection;
      blogCategories = categories;
    } catch (error) {
      console.error('Failed to import database:', error);
      throw new Error('Database connection failed');
    }
  }
  return { db, blogCategories };
}

export async function GET() {
  try {
    const { db, blogCategories } = await getDbConnection();
    const categories = await db.select().from(blogCategories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { db, blogCategories } = await getDbConnection();

    const body = await request.json();
    const name = body.name;
    const description = body.description;

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name must be a non-empty string' },
        { status: 400 }
      );
    }

    // Generate a slug from the name
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await db.insert(blogCategories).values({
      name,
      slug,
      description: description || null
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error: any) { // Added :any to allow checking error.code
    console.error('Error creating category:', error);
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return NextResponse.json(
        { error: `A category with a similar name/slug already exists.` },
        { status: 409 } // 409 Conflict
      );
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
