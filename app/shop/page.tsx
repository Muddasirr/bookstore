import { Suspense } from "react";
import { ShopView } from "./ShopView";

export const metadata = { title: "Shop — Honorable Books & Uniforms" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <ShopView />
    </Suspense>
  );
}
