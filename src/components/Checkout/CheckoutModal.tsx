"use client";

import { useCartStore } from "@/provider/cart-provider";
import { X, ShoppingBag, MessageCircle, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";
import { useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, getSubtotal } = useCartStore((state) => state);
  const subtotal = getSubtotal();
  const isEmpty = cart.length === 0;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-foreground">Thanh toán</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-12">
                <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Giỏ hàng của bạn đang trống
                  </h3>
                  <p className="text-muted-foreground">
                    Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <>
                {/* Cart Summary */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="text-lg font-semibold text-foreground">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y divide-border">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.id}-${item.selectedVariant || ""}-${index}`}
                        className="p-4 flex flex-col sm:flex-row gap-4"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2 min-w-0">
                          <div>
                            <h4 className="font-semibold text-foreground truncate">
                              {item.name}
                            </h4>
                            {item.selectedVariant && (
                              <p className="text-sm text-rose-600 font-medium mt-1">
                                {item.selectedVariant}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Số lượng:{" "}
                                <strong className="text-foreground">
                                  {item.cartQuantity ?? 0}
                                </strong>
                              </span>
                              <span>
                                Giá:{" "}
                                <strong className="text-foreground">
                                  {formatPrice(item.price)}
                                </strong>
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Tổng</p>
                              <p className="text-lg font-bold text-primary">
                                {formatPrice((item.cartQuantity ?? 0) * item.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="p-4 bg-muted/30 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Instructions */}
                <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 rounded-2xl border border-border p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Hướng dẫn đặt hàng
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Vui lòng chụp màn hình sau đó liên hệ qua các phương thức sau để đặt hàng:
                    </p>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Zalo */}
                    <a
                      href="https://zalo.me/0932445510"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                        <Image
                          src="/zalo-icon.svg"
                          alt="Zalo"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">Zalo</p>
                        <p className="text-xs text-muted-foreground truncate">
                          0932445510
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://www.tiktok.com/@softiebeautydn?is_from_webapp=1&sender_device=pc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors flex-shrink-0">
                        <Image
                          src="/tiktok-simplified-black-icon.svg"
                          alt="TikTok"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">TikTok</p>
                        <p className="text-xs text-muted-foreground truncate">
                          @softiebeautydn
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://facebook.com/softiebeautyy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">Facebook</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Softie Beauty
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>

                    {/* Shopee */}
                    <a
                      href="https://shopee.vn/softiebeauty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors flex-shrink-0">
                        <Image
                          src="/shopee-icon.svg"
                          alt="Shopee"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">Shopee</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Đặt hàng trên Shopee
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  </div>

                  {/* Additional Note */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong className="text-foreground">Lưu ý:</strong> Sau khi liên hệ, chúng tôi sẽ xác nhận đơn hàng và hướng dẫn bạn các bước tiếp theo.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
