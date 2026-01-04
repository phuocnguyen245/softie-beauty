import { ShoppingCart, Sparkles } from "lucide-react";
import { QuantitySelector } from "../QuantitySelector";
import { RefObject } from "react";

interface AddToCartSectionProps {
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  buttonRef?: RefObject<HTMLButtonElement>;
}

export function AddToCartSection({
  price,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  buttonRef,
}: AddToCartSectionProps) {
  return (
    <div className="space-y-6 bg-white rounded-3xl p-6 border border-border shadow-sm">
      {/* Price */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Price</p>
        <p className="text-3xl text-primary">${price.toFixed(2)}</p>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Quantity</label>
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => onQuantityChange(quantity + 1)}
          onDecrease={() => onQuantityChange(quantity - 1)}
          size="md"
        />
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          ref={buttonRef}
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={onBuyNow}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all border border-border"
        >
          <Sparkles className="w-5 h-5" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <span>Cruelty-free & vegan</span>
        </div>
      </div>
    </div>
  );
}
