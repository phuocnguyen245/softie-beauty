import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts } from '@/lib/products-api';
import { subcategoryExists } from '@/lib/categories-api';
import { generateSlug } from '@/lib/json-utils';
import { Product } from '@/types';

/**
 * PUT /api/products/[id]
 * Cập nhật sản phẩm theo ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, price, image, description, parentCategory, subcategory, variants } = body;

    // Validation
    if (!name || !price || !image || !description || !parentCategory || !subcategory) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category và subcategory
    const isValidSubcategory = await subcategoryExists(parentCategory, subcategory);
    if (!isValidSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Invalid category or subcategory' },
        { status: 400 }
      );
    }

    // Đọc danh sách sản phẩm
    const products = await readProducts();

    // Tìm sản phẩm cần cập nhật
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Cập nhật sản phẩm
    const updatedProduct: Product = {
      ...products[productIndex],
      name,
      slug: generateSlug(name),
      price: parseFloat(price),
      image,
      description,
      parentCategory,
      subcategory,
      ...(variants && variants.length > 0 ? { variants } : {}),
    };
    
    // Xóa variants nếu không có
    if (!variants || variants.length === 0) {
      delete updatedProduct.variants;
    }

    products[productIndex] = updatedProduct;

    // Ghi lại file JSON
    await writeProducts(products);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Xóa sản phẩm theo ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Đọc danh sách sản phẩm
    const products = await readProducts();

    // Tìm và xóa sản phẩm
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    // Ghi lại file JSON
    await writeProducts(products);

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
