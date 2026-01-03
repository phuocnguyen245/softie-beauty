"use client";
import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/layouts/Header";
import { Hero } from "@/components/layouts/Hero";
import { FeaturedProducts } from "@/components/products";
import "../styles/global.css";
import { CartStoreProvider } from "@/provider/cart-provider";
import { useEffect, useState } from "react";
import { ProductDetailPage } from "@/components/products/ProductDetail";
import { WhySoftie } from "@/components/layouts/WhySoftie";
import { Testimonials } from "@/components/layouts/Comment";
import { Newsletter } from "@/components/layouts/Letter";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { CartPage } from "@/components/Cart";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // Simple routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <CartStoreProvider>
      <div className="min-h-screen">
        {currentPage === "cart" ? (
          <>
            <Header />
            <CartPage />
            <Footer />
          </>
        ) : currentPage === "product" ? (
          <>
            <Header />
            <ProductDetailPage />
            <Footer />
          </>
        ) : (
          <>
            <Header />
            <main>
              <Hero />
              <FeaturedProducts />
              <WhySoftie />
              <Testimonials />
              <Newsletter />
            </main>
            <Footer />
          </>
        )}
        <CartDrawer />
      </div>
    </CartStoreProvider>
  );
}
