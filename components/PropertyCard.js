"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Square, Bed, Car, Edit, Trash2, Eye } from "lucide-react";
import styles from "@/styles/PropertyCard.module.css";

const propertyTypeLabels = {
  apartment: "آپارتمان",
  villa: "ویلایی",
  commercial: "تجاری",
  garden: "باغ",
};

const saleTypeLabels = {
  rent: "رهن و اجاره",
  sale: "فروش",
};

export default function PropertyCard({ item }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("آیا از حذف این ملک اطمینان دارید؟")) return;
    const res = await fetch(`/api/properties/${item._id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className={styles.card}>
      {item.images?.[0] && (
        <div className={styles.imageContainer}>
          <img src={item.images[0]} alt={item.title} className={styles.image} />
          <span className={styles.categoryBadge}>
            {propertyTypeLabels[item.propertyType]}
          </span>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.price}>
            {item.saleType === "sale"
              ? `${item.price?.toLocaleString()} تومان`
              : `${item.deposit?.toLocaleString()} تومان رهن`}
          </div>
        </div>

        <div className={styles.badgeContainer}>
          <span className={styles.badge}>
            {saleTypeLabels[item.saleType]}
          </span>
          {item.exchange && (
            <span className={`${styles.badge} ${styles.exchangeBadge}`}>
              معاوضه
            </span>
          )}
        </div>

        {item.address && (
          <div className={styles.address}>
            <MapPin size={16} className={styles.addressIcon} />
            <span>{item.address}</span>
          </div>
        )}

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <Square size={18} className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>متراژ</span>
              <span className={styles.detailValue}>{item.area} متر</span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Bed size={18} className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>خواب</span>
              <span className={styles.detailValue}>{item.rooms || "-"}</span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Car size={18} className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>پارکینگ</span>
              <span className={styles.detailValue}>
                {item.parking ? "دارد" : "ندارد"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/properties/${item._id}`}
            className={`${styles.actionButton} ${styles.viewButton}`}
          >
            <Eye size={18} /> مشاهده
          </Link>
          <Link
            href={`/properties/edit/${item._id}`}
            className={`${styles.actionButton} ${styles.editButton}`}
          >
            <Edit size={18} /> ویرایش
          </Link>
          <button
            onClick={handleDelete}
            className={`${styles.actionButton} ${styles.deleteButton}`}
          >
            <Trash2 size={18} /> حذف
          </button>
        </div>
      </div>
    </div>
  );
}