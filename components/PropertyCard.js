"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Square, Bed, Car, Edit, Trash2, Eye } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
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
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDeleteConfirm() {
    const res = await fetch(`/api/properties/${item._id}`, { method: "DELETE" });
    setShowConfirm(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className={styles.card}>
      {item.images?.[0] && (
        <div className={styles.imageContainer}>
          <img src={item.images[0]} alt={item.ownerName || "ملک"} className={styles.image} />
          <span className={styles.categoryBadge}>{propertyTypeLabels[item.propertyType]}</span>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.avatar}>{(item.ownerName && item.ownerName.charAt(0)) || "م"}</div>
          <div className={styles.info}>
            <h3 className={styles.title}>{item.ownerName || "بدون نام مالک"}</h3>
            {item.ownerPhone && <div className={styles.ownerPhone} dir="ltr">{item.ownerPhone}</div>}
          </div>
          <div className={styles.price}>
            {item.saleType === "sale"
              ? `${item.price?.toLocaleString()} تومان`
              : `${item.deposit?.toLocaleString()} تومان رهن`}
            <div className={styles.yearBuilt}>
              {item.yearBuilt || (item.createdAt ? new Date(item.createdAt).getFullYear() : "-")}
            </div>
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

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>متراژ</span>
            <span className={styles.detailValue}>{item.area ? `${item.area} متر` : "-"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>تعداد خواب</span>
            <span className={styles.detailValue}>{item.rooms || "-"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>طبقه</span>
            <span className={styles.detailValue}>{item.floor || "-"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>پارکینگ</span>
            <span className={styles.detailValue}>{item.parking ? "دارد" : "ندارد"}</span>
          </div>
          {item.cabinetMaterial && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>کابینت</span>
              <span className={styles.detailValue}>
                {item.cabinetMaterial === "mdf"
                  ? "ام‌دی‌اف"
                  : item.cabinetMaterial === "highGloss"
                  ? "های‌گلاس"
                  : item.cabinetMaterial === "acrylic"
                  ? "اکریلیک"
                  : item.cabinetMaterial === "wood"
                  ? "چوب"
                  : item.cabinetMaterial === "laminate"
                  ? "لمینت"
                  : "سایر"}
              </span>
            </div>
          )}
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
          <button onClick={() => setShowConfirm(true)} className={`${styles.actionButton} ${styles.deleteButton}`}>
            <Trash2 size={18} /> حذف
          </button>
          <ConfirmModal open={showConfirm} title="حذف ملک" description="آیا از حذف این ملک اطمینان دارید؟" onCancel={() => setShowConfirm(false)} onConfirm={handleDeleteConfirm} confirmLabel="حذف" cancelLabel="انصراف" isDanger={true} />
        </div>
      </div>
    </div>
  );
}