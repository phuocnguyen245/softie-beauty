import { NextRequest, NextResponse } from 'next/server';
import {
  readCategories,
  writeCategories,
  structureToCategory,
  categoryToStructure,
  hasSubcategories,
} from '@/lib/categories-api';
import { hasProductsInCategory } from '@/lib/products-api';
import { generateSlug } from '@/lib/json-utils';

/**
 * GET /api/categories
 * Lấy danh sách tất cả categories
 */
export async function GET() {
  try {
    const categories = await readCategories();
    const formattedCategories = categories.map(structureToCategory);
    return NextResponse.json({ success: true, data: formattedCategories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Tạo category mới
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categories = await readCategories();

    // Kiểm tra category đã tồn tại chưa
    if (categories.some((cat) => cat.parent === name.trim())) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Tạo category mới
    const newCategory = {
      parent: name.trim(),
      parentSlug: generateSlug(name.trim()),
      subcategories: [],
    };

    categories.push(newCategory);
    await writeCategories(categories);

    return NextResponse.json(
      { success: true, data: structureToCategory(newCategory) },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
