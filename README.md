# Asif Book Store

[![CI](https://github.com/Muddasirr/bookstore/actions/workflows/ci.yml/badge.svg)](https://github.com/Muddasirr/bookstore/actions/workflows/ci.yml)

An online storefront for a Karachi school-supply shop: textbooks, uniforms and stationery, with parents able to pick their child's school and class and get the whole book list in one go. Built in Next.js 15 around book-themed motion that stays fast on phones.

**Live:** https://bookstore-rho-topaz-62.vercel.app

> **TODO(Muddasir):** add `docs/hero.png` (the 3D book hero) and a short GIF of the reading-room bookshelf or fly-to-cart.

## Why I built it

The shop supplies textbooks, uniforms, registers and stationery for Karachi schools, packed, covered, labelled and delivered. The book-list page turns a school's list into a one-click cart: pick the school and class, see the exact set, add everything. TODO(Muddasir): one line on what the owner asked for and why.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | Home: 3D hero, departments, reading-room bookshelf, class sets, featured, stationery scroller, how it works, store visit |
| `/shop` | Catalogue with department / class / offer filters, sort, search (`?q=`), saved items (`?saved=1`) |
| `/product/[slug]` | Product detail; textbooks are draggable CSS-3D books with "look inside" |
| `/book-lists` | Pick school + class → shelf fills with that list, tick/untick, add-ons, add all to cart |
| `/cart`, `/checkout` | Full cart and a 3-step checkout (demo — no payment backend) |

## Motion inventory

- **Hero** — three.js (React Three Fiber) stack of books that drop in, float, follow the cursor; the top book's cover hinges open onto a contents page (click to toggle). Rendering pauses when off-screen.
- **Reading room** — wooden bookcase with a cursor-following lamp glow. Tabs knock books off and drop new ones in with springs; hover lifts a book out with a tooltip; click opens a modal where the book swings from spine-on to cover-on and opens.
- **Page transitions** — a navy "page" turns away on its spine (`app/template.tsx`).
- **Fly-to-cart** — book tokens arc from the clicked button into the cart, which bounces.
- **Spine rows** — footer / page headers: spines drop in one by one and bob on hover.
- Masked word reveals, 3D tilt + glare product cards, layout-animated filters and tabs, pinned horizontal stationery scroller, scroll-drawn progress lines, animated totals, Lenis smooth scrolling. Respects `prefers-reduced-motion`.

## Stack

Next.js 15 · React 19 · Tailwind CSS 4 · motion (Framer Motion) · @react-three/fiber + drei · Lenis · zustand (cart persisted to localStorage).

Catalogue data lives in `lib/data.ts`; all product imagery is generated (CSS-3D books + SVG illustrations), so there are no image assets to manage. Swap in real photos by extending `ProductArt`.

## Theme

Navy & mustard: tokens live in `app/globals.css` under `@theme` — `brand` (#13265c navy), `brand-2`, `accent` (#f4c21b mustard), `accent-2`, `cream`, `paper`, `sand`, `line`, `ink`, `muted`. Use them as Tailwind classes (`bg-brand`, `text-accent`, …). The logo is `public/honorlogo.jpeg`.

## Performance: what I had to get right

- Hero WebGL mounts on `requestIdleCallback`, stops rendering when off-screen or the tab is hidden, has no real-time shadow map (contact shadow only), capped DPR (1.25 on phones) and drops resolution automatically via `PerformanceMonitor`.
- Infinite / decorative loops (sparkles, marquee, floating items, every spine shelf) are CSS keyframes on `transform`/`opacity`, triggered by one IntersectionObserver per shelf — no per-frame JS.
- Bookshelf lamp glow moves a pre-painted gradient with `transform` (no repaint), mouse only.
- 3D book "inside pages" only render where a cover can open; product cards stay light.
- Shop paginates (12 at a time, "Load more").
- Card tilt only on mouse devices; Lenis smooth scroll disabled on touch and reduced motion; `MotionConfig reducedMotion="user"` respects OS settings.
- Pinned horizontal stationery scroll on desktop; native snap-scrolling row on phones/tablets.

## Limitations and roadmap

- **The checkout is a demo.** There's no payment provider or order backend yet. Next step: an order API plus a Pakistani payment gateway or cash on delivery.
- **The catalogue is static** (`lib/data.ts`). The shop owner needs an admin panel or CMS to update prices, stock and book lists each term.
- There are no automated tests yet. CI checks that the site builds.

## License

TODO(Muddasir): this was built for Asif Book Store. Agree with the owner how the code may be reused before adding a license.
