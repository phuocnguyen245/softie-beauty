"use client";

import { Subcategory } from "@/types/index.d";

interface SubcategoryTabsProps {
  subcategories: Subcategory[];
  activeSubcategory: Subcategory | null;
  onSubcategoryChange: (subcategory: Subcategory) => void;
}

export function SubcategoryTabs({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
}: SubcategoryTabsProps) {
  return (
    <div className="w-full py-4 bg-gradient-to-b from-rose-50/40 to-transparent animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subcategories */}
        <div className="overflow-x-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-center">
            {subcategories.map((subcategory) => {
              const isActive = activeSubcategory === subcategory;

              return (
                <button
                  key={subcategory}
                  onClick={() => onSubcategoryChange(subcategory)}
                  className={`
                    relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium 
                    transition-all duration-200 ease-out whitespace-nowrap
                    ${
                      isActive
                        ? "bg-rose-100 text-rose-800 shadow-sm border border-rose-200"
                        : "bg-white/80 text-gray-600 hover:bg-rose-50 hover:text-rose-700 border border-gray-200/50"
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${subcategory}`}
                >
                  {subcategory}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
