import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer, FlyLayer } from "@/components/CartDrawer";
import { MotionProvider, SmoothScroll } from "@/components/motion";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"], axes: ["opsz"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = { themeColor: "#1d3a32" };

export const metadata: Metadata = {
  title: "Honorable Books & Uniforms — Everything on your school list",
  description: "Textbooks, uniforms, registers and stationery for Karachi schools. Packed, covered, labelled and delivered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <MotionProvider>
          <SmoothScroll />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <FlyLayer />
        </MotionProvider>
      </body>
    </html>
  );
}
