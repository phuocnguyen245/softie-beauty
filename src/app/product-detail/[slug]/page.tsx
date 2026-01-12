import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/products/ProductDetail";
import { ProductWithDetails, fetchProductBySlug } from "@/lib/products";
import { Metadata } from "next";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";
import { ProductStructuredData } from "@/components/SEO/StructuredData";

// Helper to convert relative URL to absolute URL for SEO
function getAbsoluteImageUrl(imagePath: string, baseUrl: string): string {
  const relativeUrl = getImageUrl(imagePath);
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  return `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Fetch product data server-side
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
      description: "Sản phẩm bạn đang tìm kiếm không tồn tại.",
    };
  }

  // Get product image URL (convert to absolute URL for SEO)
  const imageUrl = getAbsoluteImageUrl(product.image, baseUrl);

  // Get additional images if available
  const images = product.images?.map(img => getAbsoluteImageUrl(img, baseUrl)) || [imageUrl];

  const title = `${product.name} | Softie Beauty`;
  const description = product.description 
    ? `${product.description} - Giá: ${formatPrice(product.price)}. ${product.benefits?.length ? `Lợi ích: ${product.benefits.join(', ')}.` : ''} Mua ngay tại Softie Beauty với giao hàng miễn phí.`
    : `${product.name} - Sản phẩm làm đẹp chất lượng cao từ Softie Beauty. Giá: ${formatPrice(product.price)}. Miễn phí vận chuyển.`;

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.parentCategory.toLowerCase(),
      product.subcategory.toLowerCase(),
      "softie beauty",
      "sản phẩm làm đẹp",
      "mỹ phẩm",
      "chăm sóc da",
      ...(product.benefits || []).map(b => b.toLowerCase()),
    ],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/product-detail/${slug}`,
      siteName: "Softie Beauty",
      locale: "vi_VN",
      type: "website",
      images: images.map((img, index) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: index === 0 ? product.name : `${product.name} - Hình ${index + 1}`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/product-detail/${slug}`,
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "VND",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": "Softie Beauty",
      "product:category": product.parentCategory,
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  
  // Fetch fresh data from API (no cache)
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <>
      <ProductStructuredData product={product} baseUrl={baseUrl} />
      <ProductDetailPage product={product} />
    </>
  );
}
