"use client";
import { useEffect, useState } from "react";
import { MiniCard, SupplierCard, type SupplierListItem } from "@/components/site/cards";
import { PREVIEW_EVENT, getPreview } from "@/lib/preview";

export function HeroPreview() {
  const [items, setItems] = useState<SupplierListItem[]>([]);
  useEffect(() => {
    fetch("/api/suppliers?take=3").then((r) => r.json()).then((j) => setItems(j.items || [])).catch(() => {});
  }, []);
  if (!items.length) return <div className="preview-card-stack" />;
  return <div className="preview-card-stack">{items.map((d) => <MiniCard key={d.code} d={d} />)}</div>;
}

export function Teaser() {
  const [d, setD] = useState<SupplierListItem | null>(null);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    fetch("/api/suppliers?take=1").then((r) => r.json()).then((j) => setD((j.items || [])[0] || null)).catch(() => {});
    setPreview(getPreview());
    const onPrev = (e: Event) => setPreview(!!(e as CustomEvent).detail);
    window.addEventListener(PREVIEW_EVENT, onPrev);
    return () => window.removeEventListener(PREVIEW_EVENT, onPrev);
  }, []);
  if (!d) return <div style={{ maxWidth: 380 }} />;
  return (
    <div style={{ maxWidth: 380 }}>
      <SupplierCard d={d} faved={false} preview={preview} onFav={() => {}} onDetail={() => {}} />
    </div>
  );
}
