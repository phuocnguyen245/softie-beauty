import { ShoppingCart, Sparkles } from "lucide-react";
import { QuantitySelector } from "../QuantitySelector";
import { RefObject } from "react";
import { formatPrice } from "@/lib/utils";

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
        <p className="text-sm text-muted-foreground">Giá</p>
        <p className="text-3xl text-primary">{formatPrice(price)}</p>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Số lượng</label>
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
          <span>Thêm vào giỏ</span>
        </button>
        {/* <button
          onClick={onBuyNow}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all border border-border"
        >
          <Sparkles className="w-5 h-5" />
          <span>Mua ngay</span>
        </button> */}
      </div>

   
    </div>
  );
}
