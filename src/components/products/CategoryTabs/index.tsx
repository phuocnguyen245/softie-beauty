"use client";

import { ParentCategory } from "@/types/index.d";

interface CategoryTabsProps {
  categories: ParentCategory[];
  activeCategory: ParentCategory;
  onCategoryChange: (category: ParentCategory) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="w-full py-8 border-b border-border/50 bg-gradient-to-b from-pink-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Horizontal Scrollable */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:gap-4 lg:justify-center min-w-max lg:min-w-0">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const isAll = category === "All";
              
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    relative px-6 py-3 rounded-full text-sm font-medium 
                    transition-all duration-300 ease-out whitespace-nowrap
                    ${
                      isActive
                        ? "bg-gradient-to-r from-pink-200 to-rose-200 text-rose-900 shadow-md scale-105"
                        : isAll
                        ? "bg-gradient-to-r from-pink-50 to-amber-50 text-gray-700"
                        : "bg-gradient-to-r from-pink-50 to-amber-50 text-gray-700 hover:from-pink-100 hover:to-amber-100 hover:shadow-sm hover:scale-102"
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${category}`}
                >
                  <span className="relative z-10">{category}</span>
                  
                  {/* Active indicator dot */}
                  {isActive && !isAll && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Label - Desktop Only */}
        <div className="hidden lg:block text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-rose-600 font-medium">
              {activeCategory === "All" ? "all products" : activeCategory}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

