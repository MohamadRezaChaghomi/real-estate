"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";
import styles from "@/styles/SearchBox.module.css";
export default function SearchHeader({ paramName = "q", placeholder }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearch(val) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (val && val.length) params.set(paramName, val);
    else params.delete(paramName);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const value = searchParams?.get(paramName) || "";
  return <div style={{ marginBottom: "1.5rem" }}><SearchBox value={value} onSearch={handleSearch} placeholder={placeholder} /></div>;
}
