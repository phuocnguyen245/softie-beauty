import { readJSON, writeJSON, generateSlug } from './json-utils';
import { Category, SubcategoryItem } from '@/types';

const CATEGORIES_FILE_PATH = 'src/constants/category.json';

export interface CategoryStructure {
  parent: string;
  parentSlug: string;
  subcategories: Array<{ name: string; slug: string }>;
}

/**
 * Đọc danh sách categories từ file JSON
 */
export async function readCategories(): Promise<CategoryStructure[]> {
  return await readJSON<CategoryStructure[]>(CATEGORIES_FILE_PATH);
}

/**
 * Ghi danh sách categories vào file JSON
 */
export async function writeCategories(categories: CategoryStructure[]): Promise<void> {
  await writeJSON(CATEGORIES_FILE_PATH, categories);
}

/**
 * Chuyển đổi CategoryStructure sang Category format
 */
export function structureToCategory(structure: CategoryStructure): Category {
  return {
    id: structure.parent,
    name: structure.parent,
    slug: structure.parentSlug,
    subcategories: structure.subcategories.map((sub) => ({
      id: sub.name,
      name: sub.name,
      slug: sub.slug,
      categoryId: structure.parent,
    })),
  };
}

/**
 * Chuyển đổi Category sang CategoryStructure format
 */
export function categoryToStructure(category: Category): CategoryStructure {
  return {
    parent: category.name,
    parentSlug: category.slug,
    subcategories: category.subcategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
    })),
  };
}

/**
 * Lấy tất cả subcategories từ một category
 */
export async function getSubcategoriesByCategory(categoryId: string): Promise<SubcategoryItem[]> {
  const categories = await readCategories();
  const category = categories.find((cat) => cat.parent === categoryId);
  if (!category) return [];
  
  return category.subcategories.map((sub) => ({
    id: sub.name,
    name: sub.name,
    slug: sub.slug,
    categoryId: category.parent,
  }));
}

/**
 * Kiểm tra category có subcategories không
 */
export async function hasSubcategories(categoryId: string): Promise<boolean> {
  const categories = await readCategories();
  const category = categories.find((cat) => cat.parent === categoryId);
  return category ? category.subcategories.length > 0 : false;
}

/**
 * Kiểm tra subcategory có tồn tại trong category không
 */
export async function subcategoryExists(categoryId: string, subcategoryName: string): Promise<boolean> {
  const categories = await readCategories();
  const category = categories.find((cat) => cat.parent === categoryId);
  if (!category) return false;
  return category.subcategories.some((sub) => sub.name === subcategoryName);
}
