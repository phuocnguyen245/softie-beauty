import { Check } from "lucide-react";
import { useState } from "react";

interface ProductInfoProps {
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients: string;
  suitableFor: string;
}

export function ProductInfo({
  description,
  benefits,
  howToUse,
  ingredients,
  suitableFor,
}: ProductInfoProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "benefits" | "howto" | "ingredients"
  >("description");

  const tabs = [
    { id: "description" as const, label: "Description" },
    { id: "benefits" as const, label: "Key Benefits" },
    { id: "howto" as const, label: "How to Use" },
    { id: "ingredients" as const, label: "Ingredients" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm transition-all ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm min-h-[200px]">
        {activeTab === "description" && (
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">Suitable for:</span>{" "}
                {suitableFor}
              </p>
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <p className="text-muted-foreground flex-1">{benefit}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "howto" && (
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {howToUse}
            </p>
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {ingredients}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
