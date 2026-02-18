import PropertyCard from "@/components/PropertyCard";
import PropertyFilter from "@/components/PropertyFilter";
import SearchHeader from "@/components/SearchHeader";
import SortBar from "@/components/SortBar";
import { getProperties } from "@/controllers/propertyController";
import Link from "next/link";
import { Plus } from "lucide-react";
import styles from "@/styles/PropertiesPage.module.css";

export default async function PropertiesPage({ searchParams }) {
  const sp = await searchParams;
  // ensure we don't fetch all records by default — set a sensible limit
  const filters = { ...(sp || {}), limit: (sp && sp.limit) || "20" };
  const properties = await getProperties(filters, {
    field: sp?.sortField,
    order: sp?.sortOrder,
  });

  // ✅ اطمینان از آرایه بودن
  const propertiesArray = Array.isArray(properties) ? properties : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>لیست تمام املاک</h1>
          <span className={styles.badge}>{propertiesArray.length} ملک</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/api/properties/export" className={styles.addButton}>
            خروجی اکسل
          </Link>
          <Link href="/properties/new" className={styles.addButton}>
            <Plus size={20} />
            ثبت ملک جدید
          </Link>
        </div>
      </div>

      <SearchHeader placeholder="جستجوی مالک، آدرس یا شماره..." />
      <PropertyFilter />
      <SortBar />

      {propertiesArray.length === 0 ? (
        <div className={styles.emptyState}>
          <p>ملکی یافت نشد</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {propertiesArray.map((item) => (
            <PropertyCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}