"use client";

import { ShoppingCart, Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { useCartStore } from "@/provider/cart-provider";
import Link from "next/link";

export function Header() {
  const { cart, toggleCart } = useCartStore((state) => state);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.cartQuantity ?? 0), 0);
  }, [cart]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-primary tracking-tight">Softie Beauty</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#products"
              className="text-foreground hover:text-primary transition-colors"
            >
              Products
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
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
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-border">
            <a
              href="#home"
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#products"
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Products
            </a>
            <a
              href="#about"
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
