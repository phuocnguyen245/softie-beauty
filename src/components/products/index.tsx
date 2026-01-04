"use client";

import { useCartStore } from "@/provider/cart-provider";
import { useState } from "react";
import { ParentCategory, Subcategory } from "@/types/index.d";
import { CategoryTabs } from "./CategoryTabs";
import { SubcategoryTabs } from "./SubcategoryTabs";
import { ProductCard } from "./ProductCard";
import categoryStructure from "@/constants/category.json";
import products from "@/constants/product.json";

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
      ? (
          categoryStructure.find((cat) => cat.parent === activeParentCategory)
            ?.subcategories || []
        ).map((sub: any) => (typeof sub === "string" ? sub : sub.name))
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8 mt-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(productToAdd) => addToCart(productToAdd)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
