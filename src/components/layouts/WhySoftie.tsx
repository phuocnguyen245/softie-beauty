"use client";

import { Leaf, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Công thức dịu nhẹ",
    description:
      "Được chế tác cẩn thận với các thành phần yêu thích da, hoạt động hài hòa với vẻ đẹp tự nhiên của bạn.",
  },
  {
    icon: Sparkles,
    title: "Thành phần tối giản",
    description:
      "Công thức sạch, minh bạch với chỉ những gì da bạn thực sự cần—không hơn, không kém.",
  },
  {
    icon: Heart,
    title: "Vẻ đẹp hàng ngày",
    description:
      "Được thiết kế cho sử dụng hàng ngày, sản phẩm của chúng tôi tăng cường vẻ rạng rỡ tự nhiên của bạn một cách đơn giản.",
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
            Tại sao chọn Softie Beauty
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi tin rằng vẻ đẹp nên đơn giản, dịu nhẹ và tốt cho làn da của bạn
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
