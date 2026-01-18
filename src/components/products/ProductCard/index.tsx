"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/index.d";
import { useState, useRef } from "react";
import Image from "next/image";
import { useAddToCartAnimation } from "@/context/AnimationContext";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedVariant?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.name
  );
  const [showVariants, setShowVariants] = useState(false);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const { triggerAnimation } = useAddToCartAnimation();

  // Get current price based on selected variant
  const getCurrentPrice = () => {
    if (product.variants && selectedVariant) {
      const variant = product.variants.find((v) => v.name === selectedVariant);
      return variant?.price || product.price;
    }
    return product.price;
  };

  // Get current image based on selected variant
  const getCurrentImage = () => {
    if (product.variants && selectedVariant) {
      const variant = product.variants.find((v) => v.name === selectedVariant);
      return variant?.image || product.image;
    }
    return product.image;
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: getCurrentPrice(),
      selectedVariant: product.variants ? selectedVariant : undefined,
    };

    // Trigger animation
    if (addToCartButtonRef.current) {
      triggerAnimation(addToCartButtonRef.current);
    }

    // Add to cart
    onAddToCart(productToAdd, selectedVariant);
  };

  const productSlug = product.slug || `product-${product.id}`;

  return (
    <div className="flex flex-col group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
      {/* Product Image */}
      <Link
        href={`/product-detail/${productSlug}`}
        className="block aspect-square overflow-hidden bg-secondary/20"
      >
        <Image
          src={getImageUrl(getCurrentImage())}
          width={500}
          height={500}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Product Details */}
      <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Link href={`/product-detail/${productSlug}`}>
              <h3 className="text-foreground hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowVariants(!showVariants)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                {showVariants ? "Ẩn" : "Hiện"} tùy chọn (
                {product.variants.length})
              </button>

              {showVariants && (
                <div className="flex flex-wrap gap-2 animate-slideDown">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${
                        selectedVariant === variant.name
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-gray-50 text-gray-600 hover:bg-rose-50 border border-gray-200"
                      }
                    `}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl text-primary font-semibold">
              {formatPrice(getCurrentPrice())}
            </span>
            {product.variants && (
              <span className="text-xs text-muted-foreground">
                {selectedVariant || "Chọn tùy chọn"}
              </span>
            )}
          </div>
          <button
            ref={addToCartButtonRef}
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            <span className="hidden md:block text-sm">Thêm</span>
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
