import { Suspense } from "react";
import { BookListView } from "./BookListView";

export const metadata = { title: "School book lists — Asif Book Store" };

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <BookListView />
    </Suspense>
  );
}
