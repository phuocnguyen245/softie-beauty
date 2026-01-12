"use client";

import Image from "next/image";

export function Hero() {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-secondary/30 to-background py-16 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
                Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Trải nghiệm chăm sóc da dịu nhẹ, hiệu quả với thành phần tối giản.
                Tôn vinh vẻ đẹp tự nhiên của bạn với các công thức sạch,
                lấy cảm hứng từ Hàn Quốc.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                Mua ngay
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-foreground rounded-full hover:bg-secondary transition-all border border-border"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                width={500}
                height={500}
                src="https://images.unsplash.com/photo-1633867573885-34f80cc0072a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwYmVhdXR5JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3Njc0MTYxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Natural beauty"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
