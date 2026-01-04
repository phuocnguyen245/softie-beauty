import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/products/ProductDetail";
import { getProductBySlug } from "@/lib/products";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
