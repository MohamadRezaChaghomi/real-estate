"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import styles from "@/styles/CustomerFilter.module.css";

export default function CustomerFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const [filters, setFilters] = useState({
    name: params.get("name") || "",
    desiredPropertyType: params.get("desiredPropertyType") || "",
    desiredSaleType: params.get("desiredSaleType") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    minArea: params.get("minArea") || "",
    maxArea: params.get("maxArea") || "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && query.set(k, v));
    router.push(`/customers?${query.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      desiredPropertyType: "",
      desiredSaleType: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
    });
    router.push("/customers");
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>فیلتر پیشرفته</h3>
        {hasFilters && (
          <button onClick={resetFilters} className={styles.resetButton}>
            <X size={16} /> پاک کردن
          </button>
        )}
      </div>

      <div className={styles.filterGrid}>
        <input
          name="name"
          placeholder="نام خریدار"
          className={styles.filterInput}
          value={filters.name}
          onChange={handleChange}
        />

        <select
          name="desiredPropertyType"
          className={styles.filterInput}
          value={filters.desiredPropertyType}
          onChange={handleChange}
        >
          <option value="">همه نوع ملک</option>
          <option value="apartment">آپارتمان</option>
          <option value="villa">ویلایی</option>
          <option value="commercial">تجاری</option>
          <option value="garden">باغ</option>
          <option value="any">هر نوع</option>
        </select>

        <select
          name="desiredSaleType"
          className={styles.filterInput}
          value={filters.desiredSaleType}
          onChange={handleChange}
        >
          <option value="">همه نوع خرید</option>
          <option value="sale">خرید</option>
          <option value="rent">رهن و اجاره</option>
          <option value="both">هر دو</option>
        </select>

        <input
          name="minPrice"
          placeholder="حداقل قیمت"
          type="number"
          className={styles.filterInput}
          value={filters.minPrice}
          onChange={handleChange}
        />

        <input
          name="maxPrice"
          placeholder="حداکثر قیمت"
          type="number"
          className={styles.filterInput}
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <input
          name="minArea"
          placeholder="حداقل متراژ"
          type="number"
          className={styles.filterInput}
          value={filters.minArea}
          onChange={handleChange}
        />

        <input
          name="maxArea"
          placeholder="حداکثر متراژ"
          type="number"
          className={styles.filterInput}
          value={filters.maxArea}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSearch} className={styles.searchButton}>
        جستجو
      </button>
    </div>
  );
}
