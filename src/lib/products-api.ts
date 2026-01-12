import { readJSON, writeJSON, generateSlug } from './json-utils';
import { Product } from '@/types';

const PRODUCTS_FILE_PATH = 'src/constants/product.json';

/**
 * Đọc danh sách sản phẩm từ file JSON
 */
export async function readProducts(): Promise<Product[]> {
  return await readJSON<Product[]>(PRODUCTS_FILE_PATH);
}

/**
 * Ghi danh sách sản phẩm vào file JSON
 */
export async function writeProducts(products: Product[]): Promise<void> {
  await writeJSON(PRODUCTS_FILE_PATH, products);
}

/**
 * Tìm ID lớn nhất và tạo ID mới
 */
export async function getNextProductId(): Promise<number> {
  const products = await readProducts();
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
}

/**
 * Kiểm tra category có products không
 */
export async function hasProductsInCategory(categoryId: string): Promise<boolean> {
  const products = await readProducts();
  return products.some((p) => p.parentCategory === categoryId);
}

/**
 * Kiểm tra subcategory có products không
 */
export async function hasProductsInSubcategory(subcategoryName: string): Promise<boolean> {
  const products = await readProducts();
  return products.some((p) => p.subcategory === subcategoryName);
}
