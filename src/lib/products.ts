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

export function getAllProducts(): ProductWithDetails[] {
  return productsData as ProductWithDetails[];
}

export function getProductBySlug(slug: string): ProductWithDetails | undefined {
  console.log({ productsData });

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
