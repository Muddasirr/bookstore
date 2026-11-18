import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/data";
import { ProductView } from "./ProductView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} — Asif Book Store` : "Not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return <ProductView slug={p.slug} />;
}
