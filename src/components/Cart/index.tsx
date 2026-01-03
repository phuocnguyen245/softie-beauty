import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore } from "@/provider/cart-provider";

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getSubtotal } = useCartStore(
    (state) => state
  );

  const subtotal = getSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal ? subtotal + shipping : 0;
  const isEmpty = cart.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center space-y-8 py-16">
            <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-3xl text-foreground">Your cart is empty</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover our beautiful collection of gentle, effective skincare
                products
              </p>
            </div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </a>
          <h1 className="text-3xl sm:text-4xl text-foreground">
            Shopping Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-secondary/20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${item.price.toFixed(2)} per item
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <QuantitySelector
                        quantity={item.cartQuantity ?? 0}
                        onIncrease={() =>
                          updateQuantity(item, item.cartQuantity ?? 0 + 1)
                        }
                        onDecrease={() =>
                          updateQuantity(item, item.cartQuantity ?? 0 - 1)
                        }
                        size="md"
                      />
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl text-primary">
                          $
                          {(
                            Number(item.price) * Number(item.cartQuantity ?? 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm sticky top-24 space-y-6">
              <h3 className="text-foreground">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-2xl text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                Proceed to Checkout
              </button>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
