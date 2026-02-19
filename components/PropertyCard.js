"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Trash2, Eye, MapPin, Box, Car, Home, DollarSign } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import styles from "@/styles/PropertyCard.module.css";

// نگاشت‌های فارسی
const propertyTypeMap = {
  apartment: "آپارتمان",
  villa: "ویلا",
  commercial: "تجاری",
  garden: "باغ",
};

const saleTypeMap = {
  rent: "اجاره",
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
      {/* نمایش نوع ملک و نوع فروش */}
      <div className={styles.categoryBadge}>
        {propertyTypeMap[item.propertyType] || "نامشخص"} • {saleTypeMap[item.saleType] || ""}
      </div>

      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className={styles.imageWrap}>
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.ownerName || "ملک"} className={styles.cardImage} />
            ) : (
              <div className={styles.avatar}>{(item.ownerName && item.ownerName.charAt(0)) || "م"}</div>
            )}
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>{item.ownerName || "بدون نام مالک"}</h3>
            <p className={styles.ownerPhone} dir="ltr">{item.ownerPhone || "-"}</p>
          </div>
        </div>
      </div>

      <div className={styles.price}>
        {item.saleType === "sale"
          ? `${item.price?.toLocaleString()} تومان`
          : item.saleType === "rent"
          ? `${item.rentPrice?.toLocaleString()} تومان /ماه`  // اصلاح rent به rentPrice مطابق اسکیما
          : `${item.deposit?.toLocaleString()} تومان رهن`}
        {item.pricePerSqm ? (
          <div className={styles.pricePerSqm}>
            <DollarSign size={14} /> {`${item.pricePerSqm?.toLocaleString()} تومان/متر`}
          </div>
        ) : null}
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
          <span className={styles.detailLabel}>طبقه</span>
          <span className={styles.detailValue}>{item.floor || "-"}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>خواب</span>
          <span className={styles.detailValue}>{item.rooms || "-"}</span>
        </div>
        {/* فیلد yearBuilt در اسکیما وجود ندارد – در صورت نیاز می‌توانید حذف کنید */}
        {/* <div className={styles.detailRow}>
          <span className={styles.detailLabel}>ساخت</span>
          <span className={styles.detailValue}>{item.yearBuilt || "-"}</span>
        </div> */}
        {item.parking || item.elevator || item.storage ? (
          <>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}><Car size={14} className={styles.icon} /> پارکینگ</span>
              <span className={styles.detailValue}>{item.parking ? "✓" : "-"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}><Home size={14} className={styles.icon} /> آسانسور</span>
              <span className={styles.detailValue}>{item.elevator ? "✓" : "-"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}><Box size={14} className={styles.icon} /> انباری</span>
              <span className={styles.detailValue}>{item.storage ? "✓" : "-"}</span>
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.date}>
        تاریخ ثبت: {new Date(item.createdAt || new Date()).toLocaleDateString("fa-IR")}
      </div>

      <div className={styles.actions}>
        <Link
          href={`/properties/${item._id}`}
          className={`${styles.actionButton} ${styles.viewButton}`}
        >
          <Eye size={16} /> مشاهده
        </Link>
        <Link
          href={`/properties/edit/${item._id}`}
          className={`${styles.actionButton} ${styles.editButton}`}
        >
          <Edit size={16} /> ویرایش
        </Link>
        <button onClick={() => setShowConfirm(true)} className={`${styles.actionButton} ${styles.deleteButton}`}>
          <Trash2 size={16} /> حذف
        </button>
        <ConfirmModal 
          open={showConfirm} 
          title="حذف ملک" 
          description="آیا از حذف این ملک اطمینان دارید؟" 
          onCancel={() => setShowConfirm(false)} 
          onConfirm={handleDeleteConfirm} 
          confirmLabel="حذف" 
          cancelLabel="انصراف" 
          isDanger={true} 
        />
      </div>
    </div>
  );
}