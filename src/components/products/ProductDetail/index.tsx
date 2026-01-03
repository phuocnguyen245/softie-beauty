import { useState, useEffect } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { ProductGallery } from "../ProductGalery";
import { VariantSelector } from "../VariantSelector";
import { AddToCartSection } from "../../Cart/AddToCartSelection";
import { ProductInfo } from "../ProductInfo";
import { RelatedProducts } from "../RelatedProduct";
import { useCartStore } from "@/provider/cart-provider";
import { Product } from "@/types";

interface ProductDetailProps {
  productId?: number;
}

// Sample product data - in a real app, this would come from props or API
const sampleProduct = {
  id: 7,
  name: "Luxe Wispy Lashes",
  tagline: "Soft, natural flutter for everyday elegance",
  price: 24.0,
  rating: 4.8,
  reviewCount: 127,
  images: [
    "https://images.unsplash.com/photo-1583001308922-423daa90fe01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1596704017254-9b121068ec31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1631214524020-7e18db7f60ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  ],
  variants: ["Short Natural", "Short Wispy", "Medium Wispy", "Long Dramatic"],
  description:
    "Indulge in the gentle beauty of our Luxe Wispy Lashes, thoughtfully designed to enhance your natural elegance. Crafted with premium synthetic fibers that feel as soft as silk, these lashes offer a delicate flutter that complements any look. Perfect for those who appreciate subtle sophistication and all-day comfort.",
  benefits: [
    "Ultra-lightweight design for all-day comfort",
    "Criss-cross layering for a naturally voluminous look",
    "Flexible band that molds to your eye shape",
    "Reusable up to 20 times with proper care",
    "Vegan and cruelty-free materials",
    "Suitable for sensitive eyes",
  ],
  howToUse: `Step 1: Gently remove lashes from tray with tweezers
Step 2: Measure against your eye and trim if needed
Step 3: Apply a thin layer of lash glue along the band
Step 4: Wait 30 seconds until glue becomes tacky
Step 5: Apply as close to your natural lash line as possible
Step 6: Press gently to secure

For removal: Gently peel from outer corner. Clean with makeup remover and store in original tray.`,
  ingredients:
    "Premium synthetic fiber, cotton band, hypoallergenic adhesive safe materials. Free from latex and harmful chemicals.",
  suitableFor: "All eye shapes, sensitive eyes, contact lens wearers",
};

const relatedProducts = [
  {
    id: 1,
    name: "Gentle Cleansing Foam",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    description: "pH-balanced daily cleanser",
  },
  {
    id: 2,
    name: "Hydrating Essence Serum",
    price: 48.0,
    image:
      "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    description: "Lightweight hydrating serum",
  },
  {
    id: 3,
    name: "Nourishing Face Cream",
    price: 42.0,
    image:
      "https://images.unsplash.com/photo-1679394042175-717ca34ef0f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    description: "Rich moisturizing cream",
  },
  {
    id: 5,
    name: "Soft Touch Lip Balm",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1535980904816-5741c64232bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    description: "Nourishing lip treatment",
  },
];

export function ProductDetailPage({ productId }: ProductDetailProps) {
  const { addToCart, toggleCart } = useCartStore((state) => state);
  const [selectedVariant, setSelectedVariant] = useState(
    sampleProduct.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isSticky, setIsSticky] = useState(false);

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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    window.location.hash = "cart";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <a
          href="#home"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </a>

        {/* Product Detail Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Product Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery
              images={sampleProduct.images}
              productName={sampleProduct.name}
            />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl text-foreground">
                {sampleProduct.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {sampleProduct.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(sampleProduct.rating)
                          ? "fill-primary text-primary"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {sampleProduct.rating} ({sampleProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Variant Selector */}
            <VariantSelector
              label="Choose Your Style"
              options={sampleProduct.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />

            {/* Add to Cart Section */}
            <AddToCartSection
              price={sampleProduct.price}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={() =>
                handleAddToCart({
                  id: sampleProduct.id,
                  name: sampleProduct.name,
                  price: sampleProduct.price,
                  image: sampleProduct.images[0],
                  description: sampleProduct.description,
                })
              }
              onBuyNow={() =>
                handleBuyNow({
                  id: sampleProduct.id,
                  name: sampleProduct.name,
                  price: sampleProduct.price,
                  image: sampleProduct.images[0],
                  description: sampleProduct.description,
                })
              }
            />
          </div>
        </div>

        {/* Product Information */}
        <ProductInfo
          description={sampleProduct.description}
          benefits={sampleProduct.benefits}
          howToUse={sampleProduct.howToUse}
          ingredients={sampleProduct.ingredients}
          suitableFor={sampleProduct.suitableFor}
        />

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
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-xl text-primary">
              ${sampleProduct.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() =>
              handleAddToCart({
                id: sampleProduct.id,
                name: sampleProduct.name,
                price: sampleProduct.price,
                image: sampleProduct.images[0],
                description: sampleProduct.description,
              })
            }
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
