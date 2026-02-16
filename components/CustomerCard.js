"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Edit, Trash2, Eye } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import styles from "@/styles/CustomerCard.module.css";

const propertyTypeLabels = {
  apartment: "آپارتمان",
  villa: "ویلایی",
  commercial: "تجاری",
  garden: "باغ",
  any: "هر نوع",
};

const saleTypeLabels = {
  rent: "رهن و اجاره",
  sale: "خرید",
  both: "هر دو",
};

export default function CustomerCard({ customer }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDeleteConfirm() {
    const res = await fetch(`/api/customers/${customer._id}`, { method: "DELETE" });
    setShowConfirm(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{customer.name?.charAt(0) || "?"}</div>
        <div className={styles.info}>
          <h3 className={styles.name}>{customer.name}</h3>
          <p className={styles.customerNumber}>{customer.customerNumber}</p>
          {customer.desiredPrice ? (
            <p className={styles.customerPrice}>{customer.desiredPrice.toLocaleString()} تومان</p>
          ) : null}
          {customer.phone && <p className={styles.customerPhone} dir="ltr">{customer.phone}</p>}
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>نوع ملک:</span>
          <span className={styles.detailValue}>
            {propertyTypeLabels[customer.desiredPropertyType]}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>نوع خرید:</span>
          <span className={styles.detailValue}>
            {saleTypeLabels[customer.desiredSaleType]}
          </span>
        </div>
        {customer.desiredPrice && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>قیمت مورد نظر:</span>
            <span className={styles.detailValue}>
              {customer.desiredPrice.toLocaleString()} تومان
            </span>
          </div>
        )}
        {customer.desiredArea && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>متراژ:</span>
            <span className={styles.detailValue}>
              {customer.desiredArea} متر
            </span>
          </div>
        )}
      </div>

      <div className={styles.date}>
        تاریخ ثبت: {new Date(customer.registeredAt).toLocaleDateString("fa-IR")}
      </div>

        <div className={styles.actions}>
        <Link
          href={`/customers/${customer._id}`}
          className={`${styles.actionButton} ${styles.viewButton}`}
        >
          <Eye size={18} /> مشاهده
        </Link>
        <Link
          href={`/customers/edit/${customer._id}`}
          className={`${styles.actionButton} ${styles.editButton}`}
        >
          <Edit size={18} /> ویرایش
        </Link>
        <button onClick={() => setShowConfirm(true)} className={`${styles.actionButton} ${styles.deleteButton}`}>
          <Trash2 size={18} /> حذف
        </button>
        <ConfirmModal open={showConfirm} title="حذف خریدار" description="آیا از حذف این خریدار اطمینان دارید؟" onCancel={() => setShowConfirm(false)} onConfirm={handleDeleteConfirm} confirmLabel="حذف" cancelLabel="انصراف" isDanger={true} />
      </div>
    </div>
  );
}