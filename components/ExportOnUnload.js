"use client";

import { useEffect } from "react";

export default function ExportOnUnload() {
  useEffect(() => {
    const handleUnload = async () => {
      try {
        // Save both exports in parallel when user leaves site
        await Promise.all([
          fetch("/api/properties/export/save", { method: "POST" }).catch(() => {}),
          fetch("/api/customers/export/save", { method: "POST" }).catch(() => {}),
        ]);
      } catch (error) {
        // Silent fail on unload to not interrupt browser
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}
