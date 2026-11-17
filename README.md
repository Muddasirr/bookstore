# Honorable — Books & Uniforms

A Next.js 15 (App Router) e-commerce storefront for school textbooks, uniforms and stationery, built around book-themed motion.

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
