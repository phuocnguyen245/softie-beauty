import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimationProvider } from "@/context/AnimationContext";
import { CartStoreProvider } from "@/provider/cart-provider";
import { ConditionalHeader } from "@/components/layouts/ConditionalHeader";
import { Footer } from "@/components/layouts/Footer";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import "../styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "Softie Beauty - Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày",
    template: "%s | Softie Beauty"
  },
  description: "Softie Beauty - Chăm sóc da dịu nhẹ, hiệu quả với thành phần tối giản. Tôn vinh vẻ đẹp tự nhiên của bạn với các công thức sạch, lấy cảm hứng từ Hàn Quốc.",
  keywords: ["làm đẹp", "chăm sóc da", "mỹ phẩm", "skincare", "beauty", "softie beauty", "sản phẩm làm đẹp", "mỹ phẩm Hàn Quốc"],
  authors: [{ name: "Softie Beauty" }],
  creator: "Softie Beauty",
  publisher: "Softie Beauty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Softie Beauty",
    title: "Softie Beauty - Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày",
    description: "Chăm sóc da dịu nhẹ, hiệu quả với thành phần tối giản. Tôn vinh vẻ đẹp tự nhiên của bạn với các công thức sạch, lấy cảm hứng từ Hàn Quốc.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Softie Beauty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Softie Beauty - Vẻ đẹp tự nhiên cho sự tự tin mỗi ngày",
    description: "Chăm sóc da dịu nhẹ, hiệu quả với thành phần tối giản.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes if needed
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartStoreProvider>
          <AnimationProvider>
            <ConditionalHeader />
            {children}
            <Footer />
            <CartDrawer />
          </AnimationProvider>
        </CartStoreProvider>
      </body>
    </html>
  );
}
