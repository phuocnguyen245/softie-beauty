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
 * PUT /api/categories/[id]
 * Cập nhật category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categories = await readCategories();
    const categoryIndex = categories.findIndex((cat) => cat.parent === id);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Kiểm tra tên mới đã tồn tại chưa (nếu khác tên cũ)
    if (name.trim() !== id && categories.some((cat) => cat.parent === name.trim())) {
      return NextResponse.json(
        { success: false, error: 'Category name already exists' },
        { status: 400 }
      );
    }

    // Cập nhật category
    const updatedCategory = {
      ...categories[categoryIndex],
      parent: name.trim(),
      parentSlug: generateSlug(name.trim()),
    };

    categories[categoryIndex] = updatedCategory;
    await writeCategories(categories);

    return NextResponse.json({
      success: true,
      data: structureToCategory(updatedCategory),
    });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Xóa category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = await readCategories();
    const categoryIndex = categories.findIndex((cat) => cat.parent === id);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Kiểm tra ràng buộc: không cho xóa nếu có subcategories
    const hasSubs = await hasSubcategories(id);
    if (hasSubs) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete category: it has subcategories. Please delete all subcategories first.',
        },
        { status: 400 }
      );
    }

    // Kiểm tra ràng buộc: không cho xóa nếu có products
    const hasProducts = await hasProductsInCategory(id);
    if (hasProducts) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete category: it has products. Please delete or move all products first.',
        },
        { status: 400 }
      );
    }

    const deletedCategory = categories[categoryIndex];
    categories.splice(categoryIndex, 1);
    await writeCategories(categories);

    return NextResponse.json({
      success: true,
      data: structureToCategory(deletedCategory),
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
