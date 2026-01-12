import { NextRequest, NextResponse } from 'next/server';
import {
  readCategories,
  writeCategories,
  subcategoryExists,
} from '@/lib/categories-api';
import { hasProductsInSubcategory } from '@/lib/products-api';
import { generateSlug } from '@/lib/json-utils';

/**
 * PUT /api/categories/[id]/subcategories/[subId]
 * Cập nhật subcategory
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subId: string }> }
) {
  try {
    const { id, subId } = await params;
    const categoryId = decodeURIComponent(id);
    const subcategoryId = decodeURIComponent(subId);
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

    const subcategoryIndex = categories[categoryIndex].subcategories.findIndex(
      (sub) => sub.name === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Kiểm tra tên mới đã tồn tại chưa (nếu khác tên cũ)
    if (name.trim() !== subcategoryId) {
      const exists = await subcategoryExists(categoryId, name.trim());
      if (exists) {
        return NextResponse.json(
          { success: false, error: 'Subcategory name already exists in this category' },
          { status: 400 }
        );
      }
    }

    // Cập nhật subcategory
    categories[categoryIndex].subcategories[subcategoryIndex] = {
      name: name.trim(),
      slug: generateSlug(name.trim()),
    };

    await writeCategories(categories);

    const updatedSubcategory = {
      id: name.trim(),
      name: name.trim(),
      slug: generateSlug(name.trim()),
      categoryId,
    };

    return NextResponse.json({
      success: true,
      data: updatedSubcategory,
    });
  } catch (error) {
    console.error('PUT /api/categories/[id]/subcategories/[subId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]/subcategories/[subId]
 * Xóa subcategory
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subId: string }> }
) {
  try {
    const { id, subId } = await params;
    const categoryId = decodeURIComponent(id);
    const subcategoryId = decodeURIComponent(subId);

    const categories = await readCategories();
    const categoryIndex = categories.findIndex((cat) => cat.parent === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const subcategoryIndex = categories[categoryIndex].subcategories.findIndex(
      (sub) => sub.name === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Kiểm tra ràng buộc: không cho xóa nếu có products
    const hasProducts = await hasProductsInSubcategory(subcategoryId);
    if (hasProducts) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete subcategory: it has products. Please delete or move all products first.',
        },
        { status: 400 }
      );
    }

    const deletedSubcategory = categories[categoryIndex].subcategories[subcategoryIndex];
    categories[categoryIndex].subcategories.splice(subcategoryIndex, 1);
    await writeCategories(categories);

    return NextResponse.json({
      success: true,
      data: {
        id: deletedSubcategory.name,
        name: deletedSubcategory.name,
        slug: deletedSubcategory.slug,
        categoryId,
      },
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/categories/[id]/subcategories/[subId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}
