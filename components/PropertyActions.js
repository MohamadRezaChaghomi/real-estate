"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import styles from "@/styles/PropertyDetail.module.css";

export default function PropertyActions({ id }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ملک حذف شد");
        router.push("/properties");
      } else {
        toast.error("حذف انجام نشد");
      }
    } catch (e) {
      toast.error("خطا در حذف");
    }
  }

  return (
    <div className={styles.actionsBar}>
      <Link href={`/properties/edit/${id}`} className={styles.editButtonInline}>
        <Edit size={16} /> ویرایش
      </Link>
      <button onClick={() => setOpen(true)} className={styles.deleteButtonInline}>
        <Trash2 size={16} /> حذف
      </button>

      <ConfirmModal
        open={open}
        title="حذف ملک"
        description="آیا مطمئن هستید که این ملک حذف شود؟ این عمل قابل بازگشت نیست."
        onCancel={() => setOpen(false)}
        onConfirm={() => { setOpen(false); handleConfirm(); }}
        confirmLabel="حذف"
        cancelLabel="انصراف"
      />
    </div>
  );
}
