import { Suspense } from "react";
import { ShopView } from "./ShopView";

export const metadata = { title: "Shop — Asif Book Store" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <ShopView />
    </Suspense>
  );
}
