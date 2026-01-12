import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/provider/cart-provider";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export function RelatedProducts({
  products,
  title = "Bạn có thể thích",
}: RelatedProductsProps) {
  const { addToCart } = useCartStore((state) => state);

  return (
    <section className="py-12 sm:py-16">
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl text-foreground text-center">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-secondary/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base text-foreground line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
