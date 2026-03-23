import { NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { db } from '@/db';
import { blogTags } from '@/db/schema';

export async function GET() {
  try {
    const tags = await db.select().from(blogTags);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { name } = await request.json();
    
    // Generate a slug from the name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const result = await db.insert(blogTags).values({
      name,
      slug
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
