"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Forces the JWT session to refresh (re-runs the jwt callback → re-reads the
// role from the DB) so a just-upgraded user sees Premium without re-logging in.
export function SessionRefresh() {
  const { update } = useSession();
  useEffect(() => {
    update().catch(() => {});
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
