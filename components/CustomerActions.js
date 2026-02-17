"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import styles from "@/styles/CustomerDetail.module.css";

export default function CustomerActions({ id, customer }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    try {
      setDeleting(true);
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("خریدار با موفقیت حذف شد");
        router.push("/customers");
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
    any: "هر نوع",
  };

  const saleTypeLabels = {
    rent: "رهن و اجاره",
    sale: "خرید",
    both: "هر دو",
  };

  const deleteDescription = customer ? (
    <div>
      <p className={styles.modalInfoLine}>
        <strong>نام خریدار:</strong> {customer.name || "-"}
      </p>
      <p className={styles.modalInfoLine}>
        <strong>شماره خریدار:</strong> {customer.customerNumber || "-"}
      </p>
      <p className={styles.modalInfoLine}>
        <strong>نوع ملک درخواستی:</strong> {propertyTypeLabels[customer.desiredPropertyType] || "-"}
      </p>
      <p className={styles.modalInfoLine}>
        <strong>نوع خرید:</strong> {saleTypeLabels[customer.desiredSaleType] || "-"}
      </p>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        ⚠️ این عمل قابل بازگشت نیست
      </p>
    </div>
  ) : "در حال بارگذاری...";

  return (
    <div className={styles.actionsBar}>
      <Link href={`/customers/edit/${id}`} className={styles.editButtonInline}><Edit size={16} /> ویرایش</Link>
      <button onClick={() => setOpen(true)} className={styles.deleteButtonInline} disabled={deleting}><Trash2 size={16} /> حذف</button>
      <ConfirmModal
        open={open}
        title="حذف خریدار"
        description={deleteDescription}
        onCancel={() => setOpen(false)}
        onConfirm={() => { setOpen(false); handleConfirm(); }}
        confirmLabel="حذف خریدار"
        cancelLabel="انصراف"
        isDanger={true}
      />
    </div>
  );
}
