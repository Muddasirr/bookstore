"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartLines } from "@/components/CartDrawer";
import { PageHead } from "@/components/PageHead";
import { FREE_DELIVERY, formatRs } from "@/lib/data";
import { useCart, useHydrated } from "@/lib/store";
import { Book3D } from "@/components/Book3D";

const STEPS = ["Contact", "Delivery", "Payment"];

export default function Checkout() {
  const { items, subtotal } = useCartLines();
  const clear = useCart((s) => s.clear);
  const h = useHydrated();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [pay, setPay] = useState("Cash on delivery");
  const delivery = mode === "pickup" || subtotal >= FREE_DELIVERY ? 0 : 200;

  if (done)
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
        <div className="[perspective:900px]">
          <motion.div initial={{ rotateY: -90, y: -60 }} animate={{ rotateY: -20, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 12 }} style={{ transformStyle: "preserve-3d" }}>
            <Book3D color="#13265c" title="Order confirmed" label={done} num="✓" w={150} h={200} d={28} />
          </motion.div>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10 font-display text-4xl">
          Thank you! We&apos;re packing it now.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-3 text-muted">
          Order <b className="text-ink">{done}</b>. You&apos;ll get a WhatsApp message when it&apos;s on the way.
        </motion.p>
        <Link href="/" className="mt-8 rounded-full bg-navy px-6 py-3 text-sm text-white">
          Back to the shop
        </Link>
      </div>
    );

  const input = "mt-1 h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm outline-none transition focus:border-navy focus:bg-paper";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHead crumbs={[["Home", "/"], ["Cart", "/cart"], ["Checkout", "/checkout"]]} title="Checkout" />
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-8">
          <div className="relative flex justify-between">
            <div className="absolute left-4 right-4 top-4 h-[2px] bg-line">
              <motion.div className="h-full origin-left bg-mustard" animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
            </div>
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => i < step && setStep(i)} className="relative flex flex-col items-center gap-2 text-[12px]">
                <motion.span animate={{ backgroundColor: i <= step ? "#13265c" : "#ece5d8", color: i <= step ? "#fff" : "#0e1a3d", scale: i === step ? 1.15 : 1 }} className="grid h-8 w-8 place-items-center rounded-full font-semibold">
                  {i < step ? "✓" : i + 1}
                </motion.span>
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) setStep(step + 1);
              else {
                setDone(`HB-${Math.floor(10000 + Math.random() * 89999)}`);
                clear();
              }
            }}
            className="mt-10"
          >
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="grid gap-4 sm:grid-cols-2">
                {step === 0 && (
                  <>
                    <label className="text-[12px] text-muted">
                      Parent&apos;s name
                      <input required className={input} placeholder="Full name" />
                    </label>
                    <label className="text-[12px] text-muted">
                      Mobile (WhatsApp)
                      <input required className={input} placeholder="03xx xxxxxxx" />
                    </label>
                    <label className="text-[12px] text-muted sm:col-span-2">
                      Child&apos;s name for labels (optional)
                      <input className={input} />
                    </label>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="flex gap-2 sm:col-span-2">
                      {(["delivery", "pickup"] as const).map((m) => (
                        <button type="button" key={m} onClick={() => setMode(m)} className="relative flex-1 rounded-xl border border-line p-4 text-left text-sm">
                          {mode === m && <motion.span layoutId="mode" className="absolute inset-0 rounded-xl border-2 border-navy" />}
                          <b className="block">{m === "delivery" ? "Home delivery" : "Store pickup"}</b>
                          <span className="text-[12px] text-muted">{m === "delivery" ? "1–2 days across Karachi" : "Same evening, Gulshan store"}</span>
                        </button>
                      ))}
                    </div>
                    {mode === "delivery" && (
                      <>
                        <label className="text-[12px] text-muted sm:col-span-2">
                          Address
                          <input required className={input} placeholder="House, street, block" />
                        </label>
                        <label className="text-[12px] text-muted">
                          Area
                          <input required className={input} placeholder="Gulshan-e-Iqbal" />
                        </label>
                        <label className="text-[12px] text-muted">
                          City
                          <input className={input} defaultValue="Karachi" />
                        </label>
                      </>
                    )}
                  </>
                )}
                {step === 2 && (
                  <div className="grid gap-2 sm:col-span-2">
                    {["Cash on delivery", "JazzCash", "Easypaisa", "Bank transfer"].map((m) => (
                      <button type="button" key={m} onClick={() => setPay(m)} className="relative flex items-center gap-3 rounded-xl border border-line p-4 text-left text-sm">
                        {pay === m && <motion.span layoutId="pay" className="absolute inset-0 rounded-xl border-2 border-navy bg-navy/5" />}
                        <span className={`relative grid h-4 w-4 place-items-center rounded-full border ${pay === m ? "border-navy" : "border-ink/30"}`}>{pay === m && <span className="h-2 w-2 rounded-full bg-navy" />}</span>
                        <span className="relative">{m}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-muted hover:text-ink">
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button disabled={h && items.length === 0} className="h-12 rounded-full bg-navy px-8 text-sm font-semibold text-white transition hover:bg-mustard hover:text-ink disabled:opacity-40">
                {step < 2 ? "Continue" : `Place order · ${formatRs(subtotal + delivery)}`}
              </button>
            </div>
          </form>
        </div>
        <aside className="rounded-3xl bg-paper p-6 ring-1 ring-line lg:sticky lg:top-36">
          <p className="font-display text-lg">Summary</p>
          <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1 text-[13px]" data-lenis-prevent>
            {h &&
              items.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span className="truncate text-muted">
                    {l.qty} × {l.p.name}
                  </span>
                  <span>{formatRs(l.qty * l.p.price)}</span>
                </li>
              ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span>{delivery ? formatRs(delivery) : "Free"}</span>
            </div>
            <div className="flex justify-between font-display text-xl font-semibold">
              <span>Total</span>
              <span>{formatRs(subtotal + delivery)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
