"use client";

// Demo premium preview has been disabled for production.
// Real contact access is controlled only by the authenticated server API.
export const PREVIEW_EVENT = "yiwu:preview";

export function getPreview(): boolean {
  return false;
}

export function setPreview(_v: boolean): void {
  try { window.dispatchEvent(new CustomEvent(PREVIEW_EVENT, { detail: false })); } catch {}
}
