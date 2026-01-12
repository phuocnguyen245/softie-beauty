"use client";

import { useCartStore } from "@/provider/cart-provider";
import { ArrowLeft, Phone, MessageCircle, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

export function CheckoutPage() {
  const { cart, getSubtotal } = useCartStore((state) => state);
  const subtotal = getSubtotal();
  const isEmpty = cart.length === 0;
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center space-y-8 py-16">
            <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-3xl text-foreground">Giỏ hàng của bạn đang trống</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Thanh toán
          </h1>
          <p className="text-muted-foreground">
            Vui lòng kiểm tra thông tin đơn hàng và liên hệ với chúng tôi để hoàn tất đặt hàng
          </p>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-3xl border border-border shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Đơn hàng của bạn</h2>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-border">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedVariant || ""}-${index}`}
                className="p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Product Image */}
                <div className="w-full sm:w-24 h-24 rounded-2xl overflow-hidden bg-secondary/20 flex-shrink-0">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    {item.selectedVariant && (
                      <p className="text-sm text-rose-600 font-medium mt-1">
                        {item.selectedVariant}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Số lượng: <strong className="text-foreground">{item.cartQuantity ?? 0}</strong></span>
                      <span>Giá: <strong className="text-foreground">{formatPrice(item.price)}</strong></span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tổng</p>
                      <p className="text-xl font-bold text-primary">
                        {formatPrice((item.cartQuantity ?? 0) * item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="p-6 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Instructions */}
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 rounded-3xl border border-border p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Hướng dẫn đặt hàng
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vui lòng chụp màn hình sau đó liên hệ qua các phương thức sau để đặt hàng:
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zalo */}
            <a
              href="https://zalo.me/0932445510"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Image
                  src="/zalo-icon.svg"
                  alt="Zalo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Zalo</p>
                <p className="text-sm text-muted-foreground">0932445510</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@softiebeautydn?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <Image
                  src="/tiktok-simplified-black-icon.svg"
                  alt="TikTok"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">TikTok</p>
                <p className="text-sm text-muted-foreground">@softiebeautydn</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/softiebeautyy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Facebook</p>
                <p className="text-sm text-muted-foreground">Softie Beauty</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            {/* Shopee */}
            <a
              href="https://shopee.vn/softiebeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <Image
                  src="/shopee-icon.svg"
                  alt="Shopee"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Shopee</p>
                <p className="text-sm text-muted-foreground">Đặt hàng trên Shopee</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Additional Note */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              💡 <strong className="text-foreground">Lưu ý:</strong> Sau khi liên hệ, chúng tôi sẽ xác nhận đơn hàng và hướng dẫn bạn các bước tiếp theo.
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-8">
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-lg font-semibold"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
}
