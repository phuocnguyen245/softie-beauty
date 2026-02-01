"use client";

import { Product, ProductVariant } from "@/types/index.d";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { formatPrice } from "@/lib/utils";

interface VariantSelectionModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedVariant: string) => void;
}

export function VariantSelectionModal({
    product,
    isOpen,
    onClose,
    onConfirm,
}: VariantSelectionModalProps) {
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedVariant(null);
            setShowError(false);
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedVariant) {
            setShowError(true);
            return;
        }
        onConfirm(selectedVariant);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleVariantSelect = (variantName: string) => {
        setSelectedVariant(variantName);
        setShowError(false);
    };

    // Get current variant details
    const getCurrentVariant = () => {
        if (!selectedVariant || !product.variants) return null;
        return product.variants.find((v) => v.name === selectedVariant);
    };

    const currentVariant = getCurrentVariant();
    const displayImage = currentVariant?.image || product.image;
    // Display first variant's price if no variant is selected, otherwise show selected variant's price
    const displayPrice = currentVariant?.price || product.variants?.[0]?.price || product.price;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-1 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-xl font-semibold text-foreground">

                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex w-full flex-col md:flex-row">
                    <div className="p-4 flex flex-col w-full md:w-1/2">
                        {/* Product Image - Full Width */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
                            <Image
                                src={getImageUrl(displayImage)}
                                width={500}
                                height={500}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="mt-2 w-min-content">
                            <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>

                            <p className="text-normal md:text-xl font-semibold text-primary">
                                {formatPrice(displayPrice)}
                            </p>
                        </div>

                        {/* Variant Selection */}

                    </div>

                    <div className="pt-0 md pt:4 p-4 pb-6 w-full md:w-1/2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Chọn tùy chọn <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {product.variants?.map((variant: ProductVariant, index: number) => (
                                <button
                                    key={`${variant.name}-${index}`}
                                    onClick={() => handleVariantSelect(variant.name)}
                                    className={`
                    p-2 px-3 rounded-xl border-2 transition-all text-left min-w-[80px]
                    ${selectedVariant === variant.name
                                            ? "border-primary bg-primary/5 shadow-md"
                                            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                                        }
                  `}
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm text-foreground">
                                            {variant.name}
                                        </p>

                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Error Message */}
                        {showError && (
                            <p className="text-sm text-rose-600 animate-shake">
                                Vui lòng chọn một tùy chọn trước khi thêm vào giỏ hàng
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-3xl">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
