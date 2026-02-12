import PropertyCard from "@/components/PropertyCard";
import PropertyFilter from "@/components/PropertyFilter";
import SortBar from "@/components/SortBar";
import { getProperties } from "@/controllers/propertyController";
import Link from "next/link";
import { Plus } from "lucide-react";
import styles from "@/styles/PropertiesPage.module.css";

export default async function PropertiesPage({ searchParams }) {
  const properties = await getProperties(searchParams, {
    field: searchParams.sortField,
    order: searchParams.sortOrder,
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
        <Link href="/properties/new" className={styles.addButton}>
          <Plus size={20} />
          ثبت ملک جدید
        </Link>
      </div>

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