import { NextRequest, NextResponse } from 'next/server';
import { readProducts, writeProducts, getNextProductId } from '@/lib/products-api';
import { subcategoryExists } from '@/lib/categories-api';
import { generateSlug } from '@/lib/json-utils';
import { Product } from '@/types';

/**
 * GET /api/products
 * Lấy danh sách tất cả sản phẩm
 */
export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Tạo sản phẩm mới
 */
export async function POST(request: NextRequest) {
  try {
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

    // Đọc danh sách sản phẩm hiện tại
    const products = await readProducts();

    // Tạo sản phẩm mới
    const newId = await getNextProductId();
    const slug = generateSlug(name);

    const newProduct: Product = {
      id: newId,
      name,
      slug,
      price: parseFloat(price),
      image,
      description,
      parentCategory,
      subcategory,
      ...(variants && variants.length > 0 && { variants }),
    };

    // Thêm sản phẩm mới vào danh sách
    products.push(newProduct);

    // Ghi lại file JSON
    await writeProducts(products);

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
