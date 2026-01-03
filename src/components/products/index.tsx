"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/provider/cart-provider";
import { useState } from "react";
import {
  ParentCategory,
  Subcategory,
  CategoryStructure,
} from "@/types/index.d";
import { CategoryTabs } from "./CategoryTabs";
import { SubcategoryTabs } from "./SubcategoryTabs";

// Category structure with subcategories
const categoryStructure: CategoryStructure[] = [
  {
    parent: "False Lashes",
    subcategories: ["Natural Lashes", "Dramatic Lashes"],
  },
  {
    parent: "Beauty Tools",
    subcategories: ["Brushes", "Applicators"],
  },
  {
    parent: "Makeup Products",
    subcategories: ["Lips", "Eyes", "Face"],
  },
  {
    parent: "Skincare & Body Care",
    subcategories: ["Cleansers", "Serums", "Moisturizers", "Body Care"],
  },
  {
    parent: "Press-on Nails",
    subcategories: ["Natural Nails", "Artistic Nails"],
  },
];

const products = [
  // Skincare & Body Care - Cleansers
  {
    id: 1,
    name: "Gentle Cleansing Foam",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjBjbGVhbnNlciUyMGJvdHRsZXxlbnwxfHx8fDE3Njc0MTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "pH-balanced daily cleanser",
    parentCategory: "Skincare & Body Care" as const,
    subcategory: "Cleansers" as const,
  },
  // Skincare & Body Care - Serums
  {
    id: 2,
    name: "Hydrating Essence Serum",
    price: 48.0,
    image:
      "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzZXJ1bSUyMGJvdHRsZXxlbnwxfHx8fDE3NjczOTQ2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Lightweight hydrating serum",
    parentCategory: "Skincare & Body Care" as const,
    subcategory: "Serums" as const,
  },
  {
    id: 4,
    name: "Radiance Glow Serum",
    price: 55.0,
    image:
      "https://images.unsplash.com/photo-1614159102369-effd79eadadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY3MzMwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Brightening vitamin C serum",
    parentCategory: "Skincare & Body Care" as const,
    subcategory: "Serums" as const,
  },
  // Skincare & Body Care - Moisturizers
  {
    id: 3,
    name: "Nourishing Face Cream",
    price: 42.0,
    image:
      "https://images.unsplash.com/photo-1679394042175-717ca34ef0f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY29zbWV0aWMlMjBjcmVhbXxlbnwxfHx8fDE3Njc0MTYxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Rich moisturizing cream",
    parentCategory: "Skincare & Body Care" as const,
    subcategory: "Moisturizers" as const,
  },
  {
    id: 6,
    name: "Dewy Skin Set",
    price: 89.0,
    image:
      "https://images.unsplash.com/photo-1627921522614-86d4b431bd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY3MzgxNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Complete skincare routine",
    parentCategory: "Skincare & Body Care" as const,
    subcategory: "Moisturizers" as const,
  },
  // Makeup Products - Lips
  {
    id: 5,
    name: "Soft Touch Lip Balm",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1535980904816-5741c64232bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYmVhdXR5JTIwcHJvZHVjdHxlbnwxfHx8fDE3Njc0MTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Nourishing lip treatment",
    parentCategory: "Makeup Products" as const,
    subcategory: "Lips" as const,
  },
  // False Lashes - Natural
  {
    id: 7,
    name: "Luxury False Lashes - Natural",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1583241800698-4f71c7b90b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxzZSUyMGxhc2hlc3xlbnwxfHx8fDE3Njc0MTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Natural everyday lashes",
    parentCategory: "False Lashes" as const,
    subcategory: "Natural Lashes" as const,
  },
  {
    id: 10,
    name: "Soft Volume Lashes",
    price: 26.0,
    image:
      "https://images.unsplash.com/photo-1583241800698-4f71c7b90b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxzZSUyMGxhc2hlc3xlbnwxfHx8fDE3Njc0MTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Soft natural volume",
    parentCategory: "False Lashes" as const,
    subcategory: "Natural Lashes" as const,
  },
  // False Lashes - Dramatic
  {
    id: 11,
    name: "Dramatic Volume Lashes",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1583241800698-4f71c7b90b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxzZSUyMGxhc2hlc3xlbnwxfHx8fDE3Njc0MTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Bold dramatic look",
    parentCategory: "False Lashes" as const,
    subcategory: "Dramatic Lashes" as const,
  },
  // Beauty Tools - Brushes
  {
    id: 8,
    name: "Professional Makeup Brush Set",
    price: 68.0,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBicnVzaGVzfGVufDF8fHx8MTc2NzQxNjE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "12-piece premium brush collection",
    parentCategory: "Beauty Tools" as const,
    subcategory: "Brushes" as const,
  },
  // Beauty Tools - Applicators
  {
    id: 12,
    name: "Beauty Blender Set",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBicnVzaGVzfGVufDF8fHx8MTc2NzQxNjE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Soft makeup sponges",
    parentCategory: "Beauty Tools" as const,
    subcategory: "Applicators" as const,
  },
  // Press-on Nails - Natural
  {
    id: 9,
    name: "Nude Press-on Nails",
    price: 19.0,
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzcyUyMG9uJTIwbmFpbHN8ZW58MXx8fHwxNzY3NDE2MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Classic nude manicure",
    parentCategory: "Press-on Nails" as const,
    subcategory: "Natural Nails" as const,
  },
  // Press-on Nails - Artistic
  {
    id: 13,
    name: "French Tip Press-on Nails",
    price: 22.0,
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzcyUyMG9uJTIwbmFpbHN8ZW58MXx8fHwxNzY3NDE2MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elegant french manicure",
    parentCategory: "Press-on Nails" as const,
    subcategory: "Artistic Nails" as const,
  },
];

export function FeaturedProducts() {
  const { addToCart } = useCartStore((state) => state);
  const [activeParentCategory, setActiveParentCategory] =
    useState<ParentCategory>("All");
  const [activeSubcategory, setActiveSubcategory] =
    useState<Subcategory | null>(null);

  // Define all parent categories
  const parentCategories: ParentCategory[] = [
    "All",
    "False Lashes",
    "Beauty Tools",
    "Makeup Products",
    "Skincare & Body Care",
    "Press-on Nails",
  ];

  // Get subcategories for the active parent category
  const currentSubcategories =
    activeParentCategory !== "All"
      ? categoryStructure.find((cat) => cat.parent === activeParentCategory)
          ?.subcategories || []
      : [];

  // Handle parent category change
  const handleParentCategoryChange = (category: ParentCategory) => {
    setActiveParentCategory(category);
    setActiveSubcategory(null); // Reset subcategory when parent changes
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: Subcategory) => {
    setActiveSubcategory(subcategory);
  };

  // Filter products based on active category and subcategory
  const filteredProducts = (() => {
    if (activeParentCategory === "All") {
      return products;
    }

    if (activeSubcategory) {
      // Show only products from the selected subcategory
      return products.filter(
        (product) => product.subcategory === activeSubcategory
      );
    }

    // Show all products from the parent category
    return products.filter(
      (product) => product.parentCategory === activeParentCategory
    );
  })();

  return (
    <section id="products" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of gentle, effective beauty
            essentials
          </p>
        </div>

        {/* Parent Category Tabs */}
        <CategoryTabs
          categories={parentCategories}
          activeCategory={activeParentCategory}
          onCategoryChange={handleParentCategoryChange}
        />

        {/* Subcategory Tabs - Show only when parent category is not "All" */}
        {currentSubcategories.length > 0 && (
          <SubcategoryTabs
            subcategories={currentSubcategories}
            activeSubcategory={activeSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <a
                href="#product"
                className="block aspect-square overflow-hidden bg-secondary/20"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </a>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <a href="#product">
                    <h3 className="text-foreground hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
