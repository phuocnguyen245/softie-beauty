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
    <div
      className="w-full py-8 pb-12 border-b border-border/50 bg-gradient-to-b from-pink-50/30 to-transparent"
      style={{ overflow: "visible" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ overflow: "visible" }}
      >
        <div
          className="overflow-x-hidden overflow-y-visible -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ overflow: "visible" }}
        >
          <div
            className="flex flex-wrap gap-3 sm:gap-4 lg:justify-center"
            style={{ overflow: "visible" }}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const isAll = category === "All";

              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    group relative px-6 py-3 rounded-full text-sm font-medium 
                    whitespace-nowrap overflow-visible transition-shadow duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-pink-200 to-rose-200 text-rose-900 shadow-md"
                        : isAll
                        ? "bg-gradient-to-r from-pink-50 to-amber-50 text-gray-700 shadow-sm"
                        : "bg-gradient-to-r from-pink-50 to-amber-50 text-gray-700 shadow-sm hover:shadow-md"
                    }
                  `}
                  style={{ overflow: "visible" }}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${category}`}
                >
                  {/* Hover overlay for smooth transition */}
                  {!isActive && !isAll && (
                    <span className="absolute rounded-full inset-0 bg-gradient-to-r from-pink-100 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none" />
                  )}
                  <span className="relative z-10">{category}</span>

                  {/* Active indicator dot */}
                  {isActive && !isAll && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-pulse z-20"
                      style={{ overflow: "visible" }}
                    />
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
