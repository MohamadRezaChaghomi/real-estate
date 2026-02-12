"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import styles from "@/styles/AdvancedPropertyFilter.module.css";

const propertyTypeOptions = [
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلایی" },
  { value: "commercial", label: "تجاری" },
  { value: "garden", label: "باغ" },
];

const saleTypeOptions = [
  { value: "sale", label: "فروش" },
  { value: "rent", label: "رهن و اجاره" },
];

const directionOptions = [
  { value: "north", label: "شمالی" },
  { value: "south", label: "جنوبی" },
  { value: "east", label: "شرقی" },
  { value: "west", label: "غربی" },
];

const deedTypeOptions = [
  { value: "full", label: "شش دانگ" },
  { value: "promissory", label: "قولنامه‌ای" },
];

const amenityOptions = [
  { key: "parking", label: "پارکینگ" },
  { key: "elevator", label: "آسانسور" },
  { key: "storage", label: "انباری" },
  { key: "balcony", label: "بالکن" },
  { key: "furnished", label: "مبله" },
  { key: "fireplace", label: "شومینه" },
  { key: "centralAntenna", label: "آنتن مرکزی" },
  { key: "cabinet", label: "کابینت" },
  { key: "hood", label: "هود" },
];

export default function AdvancedPropertyFilter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    saleType: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    floor: "",
    direction: "",
    deedType: "",
    exchange: "",
    parking: "",
    elevator: "",
    // ... سایر فیلترها
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (name) => {
    setFilters({
      ...filters,
      [name]: filters[name] === "true" ? "" : "true",
    });
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== "") query.set(k, v);
    });
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
      floor: "",
      direction: "",
      deedType: "",
      exchange: "",
      parking: "",
      elevator: "",
    });
    router.push("/properties");
  };

  const hasFilters = Object.values(filters).some((v) => v !== "" && v !== undefined);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
          <span>فیلتر پیشرفته</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {hasFilters && (
          <button onClick={resetFilters} className={styles.resetButton}>
            <X size={16} /> پاک کردن فیلترها
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>نوع ملک</h4>
            <div className={styles.radioGroup}>
              {propertyTypeOptions.map((opt) => (
                <label key={opt.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="propertyType"
                    value={opt.value}
                    checked={filters.propertyType === opt.value}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>نوع فروش</h4>
            <div className={styles.radioGroup}>
              {saleTypeOptions.map((opt) => (
                <label key={opt.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="saleType"
                    value={opt.value}
                    checked={filters.saleType === opt.value}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>محدوده قیمت</h4>
            <div className={styles.priceRange}>
              <input
                name="minPrice"
                placeholder="حداقل"
                className={styles.filterInput}
                value={filters.minPrice}
                onChange={handleChange}
              />
              <span>تا</span>
              <input
                name="maxPrice"
                placeholder="حداکثر"
                className={styles.filterInput}
                value={filters.maxPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>متراژ</h4>
            <div className={styles.priceRange}>
              <input
                name="minArea"
                placeholder="حداقل"
                className={styles.filterInput}
                value={filters.minArea}
                onChange={handleChange}
              />
              <span>تا</span>
              <input
                name="maxArea"
                placeholder="حداکثر"
                className={styles.filterInput}
                value={filters.maxArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>مشخصات</h4>
            <div className={styles.grid2}>
              <input
                name="rooms"
                placeholder="حداقل خواب"
                className={styles.filterInput}
                value={filters.rooms}
                onChange={handleChange}
              />
              <input
                name="floor"
                placeholder="طبقه"
                className={styles.filterInput}
                value={filters.floor}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>جهت ساختمان</h4>
            <select
              name="direction"
              className={styles.filterInput}
              value={filters.direction}
              onChange={handleChange}
            >
              <option value="">همه</option>
              {directionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>نوع سند</h4>
            <select
              name="deedType"
              className={styles.filterInput}
              value={filters.deedType}
              onChange={handleChange}
            >
              <option value="">همه</option>
              {deedTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>امکانات</h4>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.exchange === "true"}
                  onChange={() => handleCheckboxChange("exchange")}
                  className={styles.checkbox}
                />
                معاوضه
              </label>
              {amenityOptions.map((opt) => (
                <label key={opt.key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters[opt.key] === "true"}
                    onChange={() => handleCheckboxChange(opt.key)}
                    className={styles.checkbox}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleSearch} className={styles.searchButton}>
              <Search size={18} /> اعمال فیلتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}