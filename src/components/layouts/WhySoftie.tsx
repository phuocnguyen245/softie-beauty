"use client";

import { Leaf, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Gentle Formula",
    description:
      "Carefully crafted with skin-loving ingredients that work in harmony with your natural beauty.",
  },
  {
    icon: Sparkles,
    title: "Minimal Ingredients",
    description:
      "Clean, transparent formulations with only what your skin truly needs—nothing more, nothing less.",
  },
  {
    icon: Heart,
    title: "Everyday Beauty",
    description:
      "Designed for daily use, our products enhance your natural radiance with effortless simplicity.",
  },
];

export function WhySoftie() {
  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-gradient-to-b from-secondary/20 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Why Softie Beauty
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe beauty should be simple, gentle, and kind to your skin
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 p-8 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
