"use client";
import { useState, useEffect, useRef, RefObject } from "react";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "../ProductGalery";
import { VariantSelector } from "../VariantSelector";
import { AddToCartSection } from "../../Cart/AddToCartSelection";
import { ProductInfo } from "../ProductInfo";
import { RelatedProducts } from "../RelatedProduct";
import { useCartStore } from "@/provider/cart-provider";
import { Product, ProductVariant } from "@/types";
import { ProductWithDetails, getRelatedProducts, fetchRelatedProducts } from "@/lib/products";
import { useAddToCartAnimation } from "@/context/AnimationContext";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";

interface ProductDetailProps {
  product: ProductWithDetails;
}

export function ProductDetailPage({ product }: ProductDetailProps) {
  const { addToCart } = useCartStore((state) => state);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const mobileAddToCartButtonRef = useRef<HTMLButtonElement>(null);
  const { triggerAnimation } = useAddToCartAnimation();

  // Default values for optional fields
  const tagline = product.tagline || product.description;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;
  const rawImages = product.images || [product.image];
  // Convert all images to proper URL format
  const images = rawImages.map(img => getImageUrl(img));
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Initialize selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isSticky, setIsSticky] = useState(false);

  // Get related products - fetch fresh data
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>([]);
  
  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const related = await fetchRelatedProducts(product);
        setRelatedProducts(related);
      } catch (error) {
        // Fallback to static data
        setRelatedProducts(getRelatedProducts(product));
      }
    };
    loadRelatedProducts();
  }, [product]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle sticky add-to-cart on mobile
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current price from selected variant or product price
  const currentPrice = selectedVariant?.price || product.price;

  // Get current images from selected variant or fallback to product images
  const currentImages = selectedVariant?.images || images;

  // Handle variant change
  const handleVariantChange = (variantName: string) => {
    const variant = variants.find((v) => v.name === variantName);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = (productToAdd: Product, buttonRef?: React.RefObject<HTMLButtonElement>) => {
    // Trigger animation
    const buttonElement = buttonRef?.current || addToCartButtonRef.current;
    if (buttonElement) {
      triggerAnimation(buttonElement);
    }
    
    // Add to cart
    addToCart(productToAdd);
  };

  const handleBuyNow = (productToAdd: Product) => {
    handleAddToCart(productToAdd);
    window.location.href = "/cart";
  };

  // Create product object with selected variant data
  const createProductWithVariant = (): Product => {
    const productImage =
      currentImages && currentImages.length > 0
        ? currentImages[0]
        : product.image;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      image: productImage,
      description: product.description || "",
      selectedVariant: selectedVariant?.name,
      parentCategory: product.parentCategory,
      subcategory: product.subcategory,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Detail Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Product Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={currentImages} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">{tagline}</p>

              {/* Rating */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {rating} ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Variant Selector */}
            {hasVariants && (
              <VariantSelector
                label="Choose Your Style"
                options={variants.map((v) => v.name)}
                selected={selectedVariant?.name || ""}
                onSelect={handleVariantChange}
              />
            )}

            {/* Add to Cart Section */}
            <AddToCartSection
              price={currentPrice}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={() => handleAddToCart(createProductWithVariant(), addToCartButtonRef as unknown as RefObject<HTMLButtonElement>)}
              onBuyNow={() => handleBuyNow(createProductWithVariant())}
              buttonRef={addToCartButtonRef as unknown as RefObject<HTMLButtonElement>}
            />
          </div>
        </div>

        {/* Product Information */}
        {(product.description ||
          product.benefits ||
          product.howToUse ||
          product.ingredients ||
          product.suitableFor) && (
          <ProductInfo
            description={product.description || ""}
            benefits={product.benefits || []}
            howToUse={product.howToUse || ""}
            ingredients={product.ingredients || ""}
            suitableFor={product.suitableFor || ""}
          />
        )}

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg transition-transform duration-300 z-30 ${
          isSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {selectedVariant && (
              <p className="text-sm text-muted-foreground">
                {selectedVariant.name}
              </p>
            )}
            <p className="text-xl text-primary">{formatPrice(currentPrice)}</p>
          </div>
          <button
            ref={mobileAddToCartButtonRef}
            onClick={() => handleAddToCart(createProductWithVariant(), mobileAddToCartButtonRef as unknown as RefObject<HTMLButtonElement>)}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
