"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { DeliveryMeter, QtyStepper, useCartLines } from "@/components/CartDrawer";
import { PageHead } from "@/components/PageHead";
import { ProductArt } from "@/components/ProductArt";
import { FREE_DELIVERY, formatRs } from "@/lib/data";
import { useCart, useHydrated } from "@/lib/store";

export default function CartPage() {
  const { items, subtotal } = useCartLines();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const h = useHydrated();
  const delivery = subtotal >= FREE_DELIVERY || subtotal === 0 ? 0 : 200;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHead crumbs={[["Home", "/"], ["Cart", "/cart"]]} title="Your cart" />
      {h && items.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-paper p-16 text-center ring-1 ring-line">
          <p className="font-display text-2xl">Nothing here yet</p>
          <Link href="/shop" className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm text-white">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl bg-paper p-2 ring-1 ring-line">
            <AnimatePresence initial={false}>
              {h &&
                items.map((l) => (
                  <motion.div
                    layout
                    key={l.id}
                    exit={{ opacity: 0, x: -80, height: 0 }}
                    className="group flex flex-wrap items-center gap-3 border-b border-line/70 p-3 last:border-0 sm:flex-nowrap sm:gap-4 sm:p-4"
                  >
                    <Link href={`/product/${l.p.slug}`} className="h-24 w-20 shrink-0 rounded-xl bg-cream">
                      <ProductArt p={l.p} size={0.5} />
                    </Link>
                    <div className="min-w-0 flex-1 basis-[calc(100%-6.5rem)] sm:basis-auto">
                      <p className="font-medium">{l.p.name}</p>
                      <p className="text-[13px] text-muted">{formatRs(l.p.price)} each</p>
                      <button onClick={() => remove(l.id)} className="mt-2 text-[12px] text-muted hover:text-berry">
                        Remove
                      </button>
                    </div>
                    <QtyStepper qty={l.qty} onChange={(n) => setQty(l.id, n)} />
                    <p className="ml-auto w-24 text-right font-semibold">{formatRs(l.p.price * l.qty)}</p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <aside className="rounded-3xl bg-paper p-6 ring-1 ring-line lg:sticky lg:top-36">
            <DeliveryMeter subtotal={subtotal} />
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatRs(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span>{delivery ? formatRs(delivery) : "Free"}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 font-display text-xl font-semibold">
                <span>Total</span>
                <span>{formatRs(subtotal + delivery)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 flex h-12 items-center justify-center rounded-full bg-accent font-semibold transition hover:brightness-95">
              Checkout →
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
