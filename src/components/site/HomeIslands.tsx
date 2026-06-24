"use client";
import { useEffect, useState } from "react";
import { MiniCard, SupplierCard, type SupplierListItem } from "@/components/site/cards";

export function HeroPreview() {
  const [items, setItems] = useState<SupplierListItem[]>([]);
  useEffect(() => {
    fetch("/api/suppliers?take=3", { cache: "no-store" }).then((r) => r.json()).then((j) => setItems(j.items || [])).catch(() => {});
  }, []);
  if (!items.length) return <div className="preview-card-stack" />;
  return <div className="preview-card-stack">{items.map((d) => <MiniCard key={d.code} d={d} />)}</div>;
}

export function Teaser() {
  const [d, setD] = useState<SupplierListItem | null>(null);
  useEffect(() => {
    fetch("/api/suppliers?take=1", { cache: "no-store" }).then((r) => r.json()).then((j) => setD((j.items || [])[0] || null)).catch(() => {});
  }, []);
  if (!d) return <div style={{ maxWidth: 380 }} />;
  // Home teaser is shown to visitors → render the free/locked state.
  return (
    <div style={{ maxWidth: 380 }}>
      <SupplierCard d={d} faved={false} isPaid={false} onFav={() => {}} onDetail={() => {}} onUnlock={() => {}} />
    </div>
  );
}
