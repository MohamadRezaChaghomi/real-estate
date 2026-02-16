"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import styles from "@/styles/SortBar.module.css";

export default function CustomerSortBar() {
  const router = useRouter();
  const params = useSearchParams();
  const currentSort = params.get("sortField") || "registeredAt";
  const currentOrder = params.get("sortOrder") || "desc";

  const handleSort = (field) => {
    const order =
      currentSort === field && currentOrder === "asc" ? "desc" : "asc";
    const query = new URLSearchParams(params.toString());
    query.set("sortField", field);
    query.set("sortOrder", order);
    router.push(`/customers?${query.toString()}`);
  };

  const sortOptions = [
    { field: "name", label: "نام" },
    { field: "desiredPrice", label: "قیمت مورد نظر" },
    { field: "desiredArea", label: "متراژ مورد نظر" },
    { field: "registeredAt", label: "تاریخ ثبت" },
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
