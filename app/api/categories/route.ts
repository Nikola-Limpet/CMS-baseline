import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { competitionCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
});

// GET /api/categories - List all active categories
export async function GET(_request: NextRequest) {
  try {
    const categories = await db
      .select()
      .from(competitionCategories)
      .where(eq(competitionCategories.isActive, true))
      .orderBy(competitionCategories.name);

    return NextResponse.json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = categorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { name, description } = validationResult.data;

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check if category with this name or slug already exists
    const existingCategory = await db
      .select()
      .from(competitionCategories)
      .where(eq(competitionCategories.name, name))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const [newCategory] = await db
      .insert(competitionCategories)
      .values({
        name,
        slug,
        description: description || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 