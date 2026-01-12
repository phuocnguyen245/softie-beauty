"use client";
import { useCartStore } from "@/provider/cart-provider";
import { Menu, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const HeaderCart = () => {
  const [cartCount, setCartCount] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cart } = useCartStore((state) => state);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  return (
    <>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors">
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden py-4 space-y-3 border-t border-border">
          <a
            href="#home"
            className="block py-2 text-foreground hover:text-primary transition-colors"
          >
            Trang chủ
          </a>
          <a
            href="#products"
            className="block py-2 text-foreground hover:text-primary transition-colors"
          >
            Sản phẩm
          </a>
          <a
            href="#about"
            className="block py-2 text-foreground hover:text-primary transition-colors"
          >
            Giới thiệu
          </a>
          <a
            href="#contact"
            className="block py-2 text-foreground hover:text-primary transition-colors"
          >
            Liên hệ
          </a>
        </nav>
      )}
    </>
  );
};

export default HeaderCart;
