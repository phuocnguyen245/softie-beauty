import { fetchAllProducts } from "@/lib/products";

export async function HomeStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let products: any[] = [];
  try {
    const allProducts = await fetchAllProducts();
    products = allProducts.slice(0, 10).map(product => ({
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "VND",
        "price": product.price.toString(),
        "availability": "https://schema.org/InStock"
      }
    }));
  } catch (error) {
    console.error('Error fetching products for structured data:', error);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Softie Beauty",
    "description": "Chăm sóc da dịu nhẹ, hiệu quả với thành phần tối giản. Tôn vinh vẻ đẹp tự nhiên của bạn với các công thức sạch, lấy cảm hứng từ Hàn Quốc.",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.jpg`,
    "image": `${baseUrl}/logo.jpg`,
    "publisher": {
      "@type": "Organization",
      "name": "Softie Beauty",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.jpg`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": product
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
