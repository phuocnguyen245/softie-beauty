import { ProductWithDetails } from "@/lib/products";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";

interface StructuredDataProps {
  product: ProductWithDetails;
  baseUrl: string;
}

export function ProductStructuredData({ product, baseUrl }: StructuredDataProps) {
  const imageUrl = getImageUrl(product.image);
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

  const images = product.images?.map(img => {
    const imgUrl = getImageUrl(img);
    return imgUrl.startsWith('http') 
      ? imgUrl 
      : `${baseUrl}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  }) || [absoluteImageUrl];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": images,
    "brand": {
      "@type": "Brand",
      "name": "Softie Beauty"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product-detail/${product.slug}`,
      "priceCurrency": "VND",
      "price": product.price.toString(),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "category": product.parentCategory,
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": (product.reviewCount || 0).toString()
    } : undefined,
    ...(product.benefits && product.benefits.length > 0 && {
      "additionalProperty": product.benefits.map(benefit => ({
        "@type": "PropertyValue",
        "name": "Lợi ích",
        "value": benefit
      }))
    })
  };

  // Remove undefined fields
  if (!structuredData.aggregateRating) {
    delete structuredData.aggregateRating;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
