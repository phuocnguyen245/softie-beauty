import { Testimonials } from "@/components/layouts/Comment";
import { Hero } from "@/components/layouts/Hero";
import { Newsletter } from "@/components/layouts/Letter";
import { WhySoftie } from "@/components/layouts/WhySoftie";
import { FeaturedProducts } from "@/components/products";
import { Metadata } from "next";
import { fetchAllProducts } from "@/lib/products";
import { HomeStructuredData } from "@/components/SEO/HomeStructuredData";
import { getBaseUrl } from "@/lib/utils";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();

  // Fetch products for structured data
  let productsCount = 0;
  try {
    const products = await fetchAllProducts();
    productsCount = products.length;
  } catch (error) {
    console.error('Error fetching products for metadata:', error);
  }

  return {
    title: "Trang chủ - Softie Beauty | Sản phẩm làm đẹp dịu nhẹ, hiệu quả",
    description: `Khám phá bộ sưu tập ${productsCount > 0 ? `${productsCount}+ ` : ''}sản phẩm làm đẹp dịu nhẹ và hiệu quả từ Softie Beauty. Chăm sóc da với thành phần tối giản, công thức sạch lấy cảm hứng từ Hàn Quốc. Miễn phí vận chuyển cho đơn hàng trên 500.000₫.`,
    keywords: [
      "softie beauty",
      "sản phẩm làm đẹp",
      "chăm sóc da",
      "mỹ phẩm",
      "skincare",
      "beauty products",
      "mỹ phẩm Hàn Quốc",
      "sản phẩm làm đẹp tự nhiên",
      "chăm sóc da dịu nhẹ",
      "mỹ phẩm sạch"
    ],
    openGraph: {
      title: "Softie Beauty - Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày",
      description: `Khám phá bộ sưu tập ${productsCount > 0 ? `${productsCount}+ ` : ''}sản phẩm làm đẹp dịu nhẹ và hiệu quả. Chăm sóc da với thành phần tối giản, công thức sạch lấy cảm hứng từ Hàn Quốc.`,
      url: `${baseUrl}/`,
      siteName: "Softie Beauty",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: `${baseUrl}/logo.jpg`,
          width: 1200,
          height: 630,
          alt: "Softie Beauty - Sản phẩm làm đẹp dịu nhẹ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Softie Beauty - Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày",
      description: `Khám phá bộ sưu tập ${productsCount > 0 ? `${productsCount}+ ` : ''}sản phẩm làm đẹp dịu nhẹ và hiệu quả.`,
      images: [`${baseUrl}/logo.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/`,
    },
  };
}

export default async function Home() {
  return (
    <div className="min-h-screen">
      <HomeStructuredData />
      <main>
        <Hero />
        <FeaturedProducts />

      </main>
    </div>
  );
}
