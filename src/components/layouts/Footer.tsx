"use client";

import { Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-primary">Softie Beauty</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chăm sóc da dịu nhẹ, hiệu quả cho sự tự tin mỗi ngày. Tôn vinh
              vẻ đẹp tự nhiên của bạn.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#home"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-foreground">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Vận chuyển
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-foreground">Theo dõi chúng tôi</h4>
            <div className="flex gap-3">
              <a
                href="https://zalo.me/0932445510"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 transition-colors group"
                aria-label="Zalo"
              >
                <Image
                  src="/zalo-icon.svg"
                  alt="Zalo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://www.tiktok.com/@softiebeautydn?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 transition-colors group"
                aria-label="TikTok"
              >
                <Image
                  src="/tiktok-simplified-black-icon.svg"
                  alt="TikTok"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://facebook.com/softiebeautyy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://shopee.vn/softiebeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary/10 transition-colors group"
                aria-label="Shopee"
              >
                <Image
                  src="/shopee-icon.svg"
                  alt="Shopee"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Softie Beauty. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
