"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import styles from "@/styles/SortBar.module.css";

export default function SortBar() {
  const router = useRouter();
  const params = useSearchParams();
  const currentSort = params.get("sortField") || "createdAt";
  const currentOrder = params.get("sortOrder") || "desc";

  const handleSort = (field) => {
    const order =
      currentSort === field && currentOrder === "asc" ? "desc" : "asc";
    const query = new URLSearchParams(params.toString());
    query.set("sortField", field);
    query.set("sortOrder", order);
    router.push(`/properties?${query.toString()}`);
  };

  const sortOptions = [
    { field: "price", label: "قیمت" },
    { field: "area", label: "متراژ" },
    { field: "rooms", label: "تعداد خواب" },
    { field: "createdAt", label: "تاریخ ثبت" },
  ];

  return (
    <div className={styles.sortBar}>
      <span className={styles.label}>مرتب‌سازی بر اساس:</span>
      {sortOptions.map((option) => (
        <button
          key={option.field}
          onClick={() => handleSort(option.field)}
          className={`${styles.sortButton} ${
            currentSort === option.field ? styles.active : ""
          }`}
        >
          {option.label}
          {currentSort === option.field && (
            <ArrowUpDown
              size={16}
              className={`${styles.sortIcon} ${
                currentOrder === "asc" ? styles.asc : styles.desc
              }`}
            />
          )}
        </button>
      ))}
    </div>
  );
}