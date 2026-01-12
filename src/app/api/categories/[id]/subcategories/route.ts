import { NextRequest, NextResponse } from 'next/server';
import {
  readCategories,
  writeCategories,
  subcategoryExists,
} from '@/lib/categories-api';
import { generateSlug } from '@/lib/json-utils';

/**
 * GET /api/categories/[id]/subcategories
 * Lấy danh sách subcategories của category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = decodeURIComponent(id);

    const categories = await readCategories();
    const category = categories.find((cat) => cat.parent === categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const subcategories = category.subcategories.map((sub) => ({
      id: sub.name,
      name: sub.name,
      slug: sub.slug,
      categoryId: category.parent,
    }));

    return NextResponse.json({ success: true, data: subcategories });
  } catch (error) {
    console.error('GET /api/categories/[id]/subcategories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories/[id]/subcategories
 * Tạo subcategory mới trong category
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = decodeURIComponent(id);
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Subcategory name is required' },
        { status: 400 }
      );
    }

    const categories = await readCategories();
    const categoryIndex = categories.findIndex((cat) => cat.parent === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Kiểm tra subcategory đã tồn tại chưa
    const exists = await subcategoryExists(categoryId, name.trim());
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Subcategory already exists in this category' },
        { status: 400 }
      );
    }

    // Thêm subcategory mới
    const newSubcategory = {
      name: name.trim(),
      slug: generateSlug(name.trim()),
    };

    categories[categoryIndex].subcategories.push(newSubcategory);
    await writeCategories(categories);

    const createdSubcategory = {
      id: newSubcategory.name,
      name: newSubcategory.name,
      slug: newSubcategory.slug,
      categoryId,
    };

    return NextResponse.json(
      { success: true, data: createdSubcategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/categories/[id]/subcategories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}
