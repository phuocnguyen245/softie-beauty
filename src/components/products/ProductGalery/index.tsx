import { useState } from "react";
import { getImageUrl } from "@/lib/image-utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/20 shadow-lg">
        <img
          src={getImageUrl(images[selectedImage])}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-2xl overflow-hidden transition-all ${
                selectedImage === index
                  ? "ring-2 ring-primary shadow-md scale-105"
                  : "ring-1 ring-border hover:ring-primary/50 hover:shadow-sm"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
