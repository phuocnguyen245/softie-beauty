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
  subcategories?: Subcategory[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  parentCategory: Exclude<ParentCategory, "All">;
  subcategory: Subcategory;
  cartQuantity?: number;
  total?: number;
}
