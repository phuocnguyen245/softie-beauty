"use client";

import { useCartStore } from "@/provider/cart-provider";
import { useState, useEffect } from "react";
import { ParentCategory, Product, Subcategory } from "@/types/index.d";
import { CategoryTabs } from "./CategoryTabs";
import { SubcategoryTabs } from "./SubcategoryTabs";
import { ProductCard } from "./ProductCard";
import categoryStructure from "@/constants/category.json";

export function FeaturedProducts() {
  const { addToCart } = useCartStore((state) => state);
  const [activeParentCategory, setActiveParentCategory] =
    useState<ParentCategory>("All");
  const [activeSubcategory, setActiveSubcategory] =
    useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch fresh products from API (no cache)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          cache: 'no-store',
        });
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Define all parent categories
    const parentCategories: ParentCategory[] = categoryStructure.map((cat) => cat.parent as ParentCategory);

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
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá bộ sưu tập được tuyển chọn của chúng tôi với các sản phẩm
            làm đẹp dịu nhẹ và hiệu quả
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8 mt-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as Product}
                onAddToCart={(productToAdd) => addToCart(productToAdd)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
