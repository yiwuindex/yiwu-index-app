"use client";
// Client-only "premium preview" toggle. This is a purely cosmetic demo affordance:
// it NEVER fetches or reveals real contact data. Real contacts are returned only by
// the server (/api/suppliers/[code]) to authenticated premium users.
export const PREVIEW_EVENT = "yiwu:preview";
const KEY = "yiwu_preview";

export function getPreview(): boolean {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}
export function setPreview(v: boolean): void {
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  try { window.dispatchEvent(new CustomEvent(PREVIEW_EVENT, { detail: v })); } catch {}
}
