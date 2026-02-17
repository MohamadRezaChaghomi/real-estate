"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import styles from "@/styles/PropertyDetail.module.css";

export default function PropertyActions({ id, property }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    try {
      setDeleting(true);
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ملک با موفقیت حذف شد");
        router.push("/properties");
      } else {
        toast.error("حذف انجام نشد");
        setDeleting(false);
      }
    } catch (e) {
      toast.error("خطا در حذف");
      setDeleting(false);
    }
  }

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

  const deleteDescription = property ? (
    <div>
      <p className={styles.modalInfoLine}>
        <strong>نوع ملک:</strong> {propertyTypeLabels[property.propertyType] || "-"}
      </p>
      <p className={styles.modalInfoLine}>
        <strong>متراژ:</strong> {property.area || "-"} متر
      </p>
      <p className={styles.modalInfoLine}>
        <strong>نوع فروش:</strong> {saleTypeLabels[property.saleType] || "-"}
      </p>
      {property.saleType === "sale" && property.price && (
        <p className={styles.modalInfoLine}>
          <strong>قیمت:</strong> {property.price.toLocaleString()} تومان
        </p>
      )}
      {property.saleType === "rent" && property.deposit && (
        <p className={styles.modalInfoLine}>
          <strong>رهن:</strong> {property.deposit.toLocaleString()} تومان
        </p>
      )}
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        ⚠️ این عمل قابل بازگشت نیست
      </p>
    </div>
  ) : "در حال بارگذاری...";

  return (
    <div className={styles.actionsBar}>
      <Link href={`/properties/edit/${id}`} className={styles.editButtonInline}>
        <Edit size={16} /> ویرایش
      </Link>
      <button onClick={() => setOpen(true)} className={styles.deleteButtonInline} disabled={deleting}>
        <Trash2 size={16} /> حذف
      </button>

      <ConfirmModal
        open={open}
        title="حذف ملک"
        description={deleteDescription}
        onCancel={() => setOpen(false)}
        onConfirm={() => { setOpen(false); handleConfirm(); }}
        confirmLabel="حذف ملک"
        cancelLabel="انصراف"
        isDanger={true}
      />
    </div>
  );
}
