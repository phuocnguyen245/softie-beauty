import { Testimonials } from "@/components/layouts/Comment";
import { Hero } from "@/components/layouts/Hero";
import { Newsletter } from "@/components/layouts/Letter";
import { WhySoftie } from "@/components/layouts/WhySoftie";
import { FeaturedProducts } from "@/components/products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <FeaturedProducts />
        <WhySoftie />
        <Testimonials />
        <Newsletter />
      </main>
    </div>
  );
}
