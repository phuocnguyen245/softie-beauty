"use client";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { QuantitySelector } from "../QuantitySelector";
import { useEffect } from "react";
import { useCartStore } from "@/provider/cart-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
  } = useCartStore((state) => state);
  const router = useRouter();
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const isEmpty = cart.length === 0;

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-foreground">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add some beautiful products to get started!
              </p>
            </div>
            <Link
              href="/"
              onClick={toggleCart}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedVariant || ""}-${index}`}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-border shadow-sm"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary/20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-foreground text-sm leading-tight">
                          {item.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-xs text-rose-600 font-medium mt-0.5">
                            {item.selectedVariant}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="p-1 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <QuantitySelector
                        quantity={item.cartQuantity ?? 0}
                        onIncrease={() =>
                          updateQuantity(item, (item.cartQuantity ?? 0) + 1)
                        }
                        onDecrease={() => {
                          const currentQuantity = item.cartQuantity ?? 0;
                          if (currentQuantity > 1) {
                            updateQuantity(item, currentQuantity - 1);
                          }
                        }}
                        size="sm"
                      />
                      <span className="text-primary">
                        ${item.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 space-y-4 bg-white">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href="#cart"
                  onClick={handleCheckout}
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-center"
                >
                  Checkout
                </a>
                <button
                  onClick={toggleCart}
                  className="w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
