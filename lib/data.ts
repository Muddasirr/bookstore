export type Category = "textbooks" | "stationery" | "uniforms" | "bags";

export type ArtKind =
  | "book"
  | "notebook"
  | "register"
  | "pencils"
  | "crayons"
  | "pens"
  | "geometry"
  | "calculator"
  | "backpack"
  | "trolley"
  | "bottle"
  | "lunchbox"
  | "shirt"
  | "sweater"
  | "trousers"
  | "pouch"
  | "eraser"
  | "glue";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  kind: ArtKind;
  price: number;
  compareAt?: number;
  color: string;
  accent?: string;
  cls?: string;
  subject?: string;
  badge?: "New" | "Bestseller" | "Sale";
  desc: string;
  rating: number;
  reviews: number;
};

export const CLASSES = ["PG", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;
export type ClassKey = (typeof CLASSES)[number];

export const classLabel = (c: string) => (/^\d+$/.test(c) ? `Class ${c}` : c === "PG" ? "Playgroup" : c);

export const SUBJECT_COLORS: Record<string, string> = {
  "English Reader": "#1e4fd6",
  Urdu: "#1f7a4d",
  Mathematics: "#d6452b",
  "General Science": "#118a8a",
  "Social Studies": "#c98a12",
  Islamiat: "#2f6b2f",
  "Computer Studies": "#5b3fc4",
  "Colour & Draw": "#e2b100",
  Physics: "#243c8f",
  Chemistry: "#b8236a",
  Biology: "#3d8b3d",
  "Pakistan Studies": "#0f6b52",
};

function subjectsFor(c: string): string[] {
  if (c === "PG" || c === "Nursery" || c === "KG") return ["English Reader", "Urdu", "Mathematics", "Colour & Draw"];
  const n = Number(c);
  if (n <= 5) return ["English Reader", "Urdu", "Mathematics", "General Science", "Social Studies", "Islamiat", "Computer Studies"];
  if (n <= 8) return ["English Reader", "Urdu", "Mathematics", "General Science", "Social Studies", "Islamiat", "Computer Studies"];
  return ["English Reader", "Urdu", "Mathematics", "Physics", "Chemistry", "Biology", "Pakistan Studies", "Computer Studies"];
}

function priceFor(c: string, subject: string) {
  const base = c === "PG" ? 380 : c === "Nursery" ? 400 : c === "KG" ? 420 : 480 + Number(c) * 45;
  const bump = subject === "Colour & Draw" ? -100 : subject === "Computer Studies" ? 120 : 0;
  return Math.round((base + bump) / 10) * 10;
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const textbooks: Product[] = CLASSES.flatMap((c) =>
  subjectsFor(c).map((subject, i) => {
    const name = `${subject === "Urdu" && ["PG", "Nursery", "KG"].includes(c) ? "Urdu Qaida" : subject} ${classLabel(c).replace("Class ", "")}`;
    const price = priceFor(c, subject);
    const onSale = (i + c.length) % 7 === 0;
    return {
      id: `tb-${slugify(c)}-${slugify(subject)}`,
      slug: `${slugify(subject)}-${slugify(classLabel(c))}`,
      name,
      category: "textbooks" as const,
      kind: "book" as const,
      price,
      compareAt: onSale ? price + 120 : undefined,
      color: SUBJECT_COLORS[subject] ?? "#1d3a32",
      cls: c,
      subject,
      badge: onSale ? ("Sale" as const) : i === 2 && Number(c) % 3 === 0 ? ("New" as const) : undefined,
      desc: `The current-session ${subject} textbook for ${classLabel(c)}. Latest edition, checked against the prescribed list before packing. Covered and name-labelled on request.`,
      rating: 4.5 + ((i * 7 + c.length) % 5) / 10,
      reviews: 12 + ((i * 37 + CLASSES.indexOf(c) * 53) % 90),
    };
  })
);

const mk = (p: Omit<Product, "id" | "slug" | "rating" | "reviews"> & { rating?: number; reviews?: number }): Product => ({
  id: `${p.category.slice(0, 2)}-${slugify(p.name)}`,
  slug: slugify(p.name),
  rating: p.rating ?? 4.7,
  reviews: p.reviews ?? 40,
  ...p,
});

const others: Product[] = [
  // stationery
  mk({ name: "Single-line register, 80 pages", category: "stationery", kind: "register", price: 120, color: "#2a66d9", desc: "Sturdy 80-page single-line register with a laminated cover. School-approved ruling.", badge: "Bestseller" }),
  mk({ name: "Single-line register, 200 pages", category: "stationery", kind: "register", price: 240, color: "#1d3a32", desc: "Thick 200-page register for the whole term, stitched spine that lays flat." }),
  mk({ name: "Four-line English copy, 80 pages", category: "stationery", kind: "notebook", price: 110, color: "#1f7a4d", desc: "Four-line copy for early writers. Wide ruling, bright cover." }),
  mk({ name: "Drawing book, A4, 40 sheets", category: "stationery", kind: "notebook", price: 260, color: "#e2b100", desc: "Heavy cartridge paper that handles crayons, pencils and poster paint." }),
  mk({ name: "Colour pencils, 24 shades", category: "stationery", kind: "pencils", price: 690, color: "#1f7a4d", desc: "Smooth, break-resistant leads in 24 rich shades, in a stand-up box.", badge: "Bestseller" }),
  mk({ name: "Wax crayons, 16 colours", category: "stationery", kind: "crayons", price: 320, color: "#d6452b", desc: "Jumbo wax crayons for small hands. Non-toxic." }),
  mk({ name: "HB pencils, pack of 12", category: "stationery", kind: "pens", price: 280, color: "#f2945a", desc: "Classic HB graphite pencils with erasers, pre-sharpened." }),
  mk({ name: "Gel pens, blue, pack of 5", category: "stationery", kind: "pens", price: 350, color: "#1e4fd6", desc: "Quick-dry gel ink that doesn't smudge on registers." }),
  mk({ name: "Geometry box, 9 pieces", category: "stationery", kind: "geometry", price: 650, color: "#1d3a32", accent: "#f2945a", desc: "Compass, divider, protractor, set squares, ruler, pencil, eraser and sharpener in a metal tin." }),
  mk({ name: "Scientific calculator", category: "stationery", kind: "calculator", price: 3200, compareAt: 3600, color: "#2b2f3a", desc: "Board-exam approved scientific calculator with 240 functions.", badge: "Sale" }),
  mk({ name: "Zip pencil pouch", category: "stationery", kind: "pouch", price: 450, color: "#2a8fe0", desc: "Wipe-clean pouch with a chunky zip and a name window.", badge: "New" }),
  mk({ name: "Eraser and sharpener set", category: "stationery", kind: "eraser", price: 120, color: "#e85d75", desc: "Dust-free eraser and a twin-hole sharpener." }),
  mk({ name: "Glue stick and scissors", category: "stationery", kind: "glue", price: 260, color: "#7a3fd6", desc: "Child-safe round-tip scissors and a 21g glue stick." }),
  // uniforms
  mk({ name: "School shirt, half sleeve", category: "uniforms", kind: "shirt", price: 1250, color: "#ffffff", accent: "#1d3a32", desc: "Breathable poly-cotton shirt, stitched to school pattern. Sizes 20 to 40." }),
  mk({ name: "School shirt, full sleeve", category: "uniforms", kind: "shirt", price: 1450, color: "#eaf2ff", accent: "#1d3a32", desc: "Winter full-sleeve shirt with reinforced cuffs." }),
  mk({ name: "V-neck sweater", category: "uniforms", kind: "sweater", price: 2400, color: "#1d3a32", accent: "#f2945a", desc: "Soft acrylic-wool sweater with school-colour trim.", badge: "New" }),
  mk({ name: "Grey school trousers", category: "uniforms", kind: "trousers", price: 1650, color: "#6b7280", desc: "Adjustable-waist trousers that grow with your child." }),
  mk({ name: "Green PE kit shirt", category: "uniforms", kind: "shirt", price: 1100, color: "#1f7a4d", accent: "#f2945a", desc: "Moisture-wicking PE shirt in house colours." }),
  // bags
  mk({ name: "Senior backpack with laptop sleeve", category: "bags", kind: "backpack", price: 4800, compareAt: 5400, color: "#2b3045", accent: "#f2945a", desc: "Padded back, laptop sleeve, bottle pockets and a reflective strip.", badge: "Sale" }),
  mk({ name: "Junior school backpack", category: "bags", kind: "backpack", price: 2950, color: "#2a8fe0", accent: "#ffffff", desc: "Lightweight backpack sized for little shoulders." }),
  mk({ name: "Trolley school bag", category: "bags", kind: "trolley", price: 6500, color: "#e2584a", accent: "#ffd27a", desc: "Detachable trolley with silent wheels for heavy book days.", badge: "New" }),
  mk({ name: "Steel water bottle, 600ml", category: "bags", kind: "bottle", price: 1450, color: "#1f7a4d", desc: "Double-wall insulated steel bottle. Cold for 12 hours." }),
  mk({ name: "Sport bottle, 750ml", category: "bags", kind: "bottle", price: 950, color: "#f08a24", desc: "BPA-free flip-top sport bottle." }),
  mk({ name: "Two-tier lunch box", category: "bags", kind: "lunchbox", price: 1200, color: "#f2945a", accent: "#2a66d9", desc: "Leak-proof two-tier lunch box with a spoon." }),
];

export const PRODUCTS: Product[] = [...others, ...textbooks];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const byCategory = (c: Category | "all") => (c === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === c));

export const DEPARTMENTS: { key: Category; title: string; blurb: string; tint: string }[] = [
  { key: "textbooks", title: "Textbooks", blurb: "Every subject from Playgroup to Class 10, current session editions only.", tint: "#efe6dc" },
  { key: "uniforms", title: "Uniforms", blurb: "Shirts, sweaters, trousers and PE kits, stitched to pattern.", tint: "#e3ebe6" },
  { key: "stationery", title: "Stationery", blurb: "Registers, geometry, colours and every little desk essential.", tint: "#e2efe1" },
  { key: "bags", title: "Bags & bottles", blurb: "Backpacks, trolleys, lunch boxes and bottles.", tint: "#f6e4dc" },
];

export const SCHOOLS = [
  { id: "cgs", name: "Crescent Grammar School", short: "CGS", area: "Block 13-D", color: "#7a1f3a" },
  { id: "nms", name: "Northfield Model School", short: "NMS", area: "Block 6", color: "#1d3a32" },
  { id: "ana", name: "Al-Noor Academy", short: "ANA", area: "Block 2", color: "#1f7a4d" },
  { id: "bfs", name: "Bright Future School", short: "BFS", area: "Block 10-A", color: "#c2410c" },
  { id: "lps", name: "Lakeside Public School", short: "LPS", area: "Block 7", color: "#5b3fc4" },
];

export type ListItem = { product: Product; qty: number; group: "Textbooks" | "Registers & copies" | "Stationery" };

export function buildList(schoolId: string, cls: string): ListItem[] {
  const books = textbooks.filter((t) => t.cls === cls);
  const seed = schoolId.charCodeAt(0) + schoolId.charCodeAt(1);
  const pick = (name: string) => others.find((o) => o.name === name)!;
  const small = ["PG", "Nursery", "KG"].includes(cls);
  const copies: ListItem[] = small
    ? [
        { product: pick("Four-line English copy, 80 pages"), qty: 4, group: "Registers & copies" },
        { product: pick("Drawing book, A4, 40 sheets"), qty: 2, group: "Registers & copies" },
      ]
    : [
        { product: pick("Single-line register, 80 pages"), qty: 6 + (seed % 3), group: "Registers & copies" },
        { product: pick("Single-line register, 200 pages"), qty: 2, group: "Registers & copies" },
      ];
  const stat: ListItem[] = small
    ? [
        { product: pick("Wax crayons, 16 colours"), qty: 1, group: "Stationery" },
        { product: pick("HB pencils, pack of 12"), qty: 1, group: "Stationery" },
        { product: pick("Eraser and sharpener set"), qty: 1, group: "Stationery" },
        { product: pick("Glue stick and scissors"), qty: 1, group: "Stationery" },
      ]
    : [
        { product: pick("Geometry box, 9 pieces"), qty: 1, group: "Stationery" },
        { product: pick("Gel pens, blue, pack of 5"), qty: 1, group: "Stationery" },
        { product: pick("HB pencils, pack of 12"), qty: 1, group: "Stationery" },
        { product: pick("Colour pencils, 24 shades"), qty: 1, group: "Stationery" },
      ];
  return [...books.map((b) => ({ product: b, qty: 1, group: "Textbooks" as const })), ...copies, ...stat];
}

export const SHELF_GROUPS: { key: string; label: string; classes: string[] }[] = [
  { key: "early", label: "Early years", classes: ["PG", "Nursery", "KG", "1"] },
  { key: "primary", label: "Primary", classes: ["2", "3", "4", "5"] },
  { key: "middle", label: "Middle", classes: ["6", "7", "8"] },
  { key: "matric", label: "Matric", classes: ["9", "10"] },
];

export const FREE_DELIVERY = 5000;

export const formatRs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
