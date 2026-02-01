"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/index.d";
import { useState, useRef } from "react";
import Image from "next/image";
import { useAddToCartAnimation } from "@/context/AnimationContext";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";
import { VariantSelectionModal } from "../VariantSelectionModal";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedVariant?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [showVariants, setShowVariants] = useState(false);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const { triggerAnimation } = useAddToCartAnimation();

  const handleAddToCart = () => {
    // If product has variants, open modal for selection
    if (product.variants && product.variants.length > 0) {
      setIsModalOpen(true);
      return;
    }

    // For products without variants, add directly to cart
    const productToAdd = {
      ...product,
      price: product.price,
      selectedVariant: undefined,
    };

    // Trigger animation
    if (addToCartButtonRef.current) {
      triggerAnimation(addToCartButtonRef.current);
    }

    // Add to cart
    onAddToCart(productToAdd);
  };

  const handleModalConfirm = (selectedVariant: string) => {
    // Get the selected variant details
    const variant = product.variants?.find((v) => v.name === selectedVariant);

    const productToAdd = {
      ...product,
      price: variant?.price || product.price,
      selectedVariant: selectedVariant,
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
    <>
      <div className="flex flex-col group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <Link
          href={`/product-detail/${productSlug}`}
          className="block aspect-square overflow-hidden bg-secondary/20"
        >
          <Image
            src={getImageUrl(product.image)}
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

            {/* Variant indicator */}
            {product.variants && product.variants.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium hover:bg-rose-100 transition-colors cursor-pointer"
              >
                {product.variants.length} tùy chọn
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Show price - use first variant's price if product has variants */}
            <div className="flex flex-col">
              <span className="text-xl text-primary font-semibold">
                {formatPrice(product.variants?.[0]?.price || product.price)}
              </span>
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

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
