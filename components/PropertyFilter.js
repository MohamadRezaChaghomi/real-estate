"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import styles from "@/styles/PropertyFilter.module.css";

export default function PropertyFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const [filters, setFilters] = useState({
    propertyType: params.get("propertyType") || "",
    saleType: params.get("saleType") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    minArea: params.get("minArea") || "",
    maxArea: params.get("maxArea") || "",
    rooms: params.get("rooms") || "",
    address: params.get("address") || "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && query.set(k, v));
    router.push(`/properties?${query.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      propertyType: "",
      saleType: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      rooms: "",
      address: "",
    });
    router.push("/properties");
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
        <select
          name="propertyType"
          className={styles.filterInput}
          value={filters.propertyType}
          onChange={handleChange}
        >
          <option value="">همه نوع ملک</option>
          <option value="apartment">آپارتمان</option>
          <option value="villa">ویلایی</option>
          <option value="commercial">تجاری</option>
          <option value="garden">باغ</option>
        </select>

        <select
          name="saleType"
          className={styles.filterInput}
          value={filters.saleType}
          onChange={handleChange}
        >
          <option value="">همه نوع فروش</option>
          <option value="sale">فروش</option>
          <option value="rent">رهن و اجاره</option>
        </select>

        <input
          name="minPrice"
          placeholder="حداقل قیمت"
          className={styles.filterInput}
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          name="maxPrice"
          placeholder="حداکثر قیمت"
          className={styles.filterInput}
          value={filters.maxPrice}
          onChange={handleChange}
        />
        <input
          name="minArea"
          placeholder="حداقل متراژ"
          className={styles.filterInput}
          value={filters.minArea}
          onChange={handleChange}
        />
        <input
          name="maxArea"
          placeholder="حداکثر متراژ"
          className={styles.filterInput}
          value={filters.maxArea}
          onChange={handleChange}
        />
        <input
          name="rooms"
          placeholder="حداقل خواب"
          className={styles.filterInput}
          value={filters.rooms}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="منطقه / آدرس"
          className={styles.filterInput}
          value={filters.address}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSearch} className={styles.searchButton}>
        <Search size={18} /> اعمال فیلتر
      </button>
    </div>
  );
}