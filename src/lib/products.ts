import productsData from "@/constants/product.json";
import categoriesData from "@/constants/category.json";
import { Product, CategoryStructure } from "@/types";

export interface ProductWithDetails extends Product {
  tagline?: string;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  benefits?: string[];
  howToUse?: string;
  ingredients?: string;
  suitableFor?: string;
}

// Legacy functions for backward compatibility (used in client components)
// These read from imported JSON (static at build time)
export function getAllProducts(): ProductWithDetails[] {
  return productsData as ProductWithDetails[];
}

export function getProductBySlug(slug: string): ProductWithDetails | undefined {
  return productsData.find(
    (product) => product.slug?.toLowerCase() === slug.toLowerCase()
  ) as ProductWithDetails | undefined;
}

export function getCategoryStructure(): CategoryStructure[] {
  return categoriesData as unknown as CategoryStructure[];
}

export function getRelatedProducts(
  currentProduct: ProductWithDetails,
  limit: number = 4
): ProductWithDetails[] {
  return productsData
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        (product.parentCategory === currentProduct.parentCategory ||
          product.subcategory === currentProduct.subcategory)
    )
    .slice(0, limit) as ProductWithDetails[];
}

// New async functions for server components (fetch from API with no cache)
export async function fetchAllProducts(): Promise<ProductWithDetails[]> {
  try {
    // For server-side fetch, use absolute URL
    // In production, construct from environment or use relative URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      // Try to detect from environment
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      } else {
        // Fallback to localhost for development
        baseUrl = 'http://localhost:3000';
      }
    }
    
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    // Fallback to static data
    return productsData as ProductWithDetails[];
  }
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
  try {
    const products = await fetchAllProducts();
    return products.find(
      (product) => product.slug?.toLowerCase() === slug.toLowerCase()
    ) as ProductWithDetails | undefined;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    // Fallback to static data
    return getProductBySlug(slug);
  }
}

export async function fetchRelatedProducts(
  currentProduct: ProductWithDetails,
  limit: number = 4
): Promise<ProductWithDetails[]> {
  try {
    const products = await fetchAllProducts();
    return products
      .filter(
        (product) =>
          product.id !== currentProduct.id &&
          (product.parentCategory === currentProduct.parentCategory ||
            product.subcategory === currentProduct.subcategory)
      )
      .slice(0, limit) as ProductWithDetails[];
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    // Fallback to static data
    return getRelatedProducts(currentProduct, limit);
  }
}
