"use client";
import { SessionProvider } from "next-auth/react";

// Keeps the session in React context so it persists across client-side
// navigation (no per-page refetch, no logged-out flicker).
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
