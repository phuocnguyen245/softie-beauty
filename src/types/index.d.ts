export type ParentCategory =
  | "All"
  | "False Lashes"
  | "Beauty Tools"
  | "Makeup Products"
  | "Skincare & Body Care"
  | "Press-on Nails";

export type Subcategory =
  // False Lashes
  | "Natural Lashes"
  | "Dramatic Lashes"
  // Beauty Tools
  | "Brushes"
  | "Applicators"
  // Makeup Products
  | "Lips"
  | "Eyes"
  | "Face"
  // Skincare & Body Care
  | "Cleansers"
  | "Serums"
  | "Moisturizers"
  | "Body Care"
  // Press-on Nails
  | "Natural Nails"
  | "Artistic Nails";

export interface CategoryStructure {
  parent: ParentCategory;
  parentSlug?: string;
  subcategories?: Subcategory[] | Array<{ name: Subcategory; slug: string }>;
}

export interface ProductVariant {
  name: string;
  price: number;
  sku?: string;
  images?: string[]; // Optional images for this variant, if not provided use parent product images
}

export interface Product {
  id: number;
  name: string;
  slug?: string; // Product slug for URL
  price: number; // Base price or price of first variant
  image: string;
  description: string;
  parentCategory: Exclude<ParentCategory, "All">;
  subcategory: Subcategory;
  variants?: ProductVariant[]; // Optional variants with different prices
  cartQuantity?: number;
  total?: number;
  selectedVariant?: string; // Track which variant is in cart
}
