"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import styles from "@/styles/CustomerDetail.module.css";

export default function CustomerActions({ id }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("خریدار حذف شد");
        router.push("/customers");
      } else {
        toast.error("حذف انجام نشد");
      }
    } catch (e) {
      toast.error("خطا در حذف");
    }
  }

  return (
    <div className={styles.actionsBar}>
      <Link href={`/customers/edit/${id}`} className={styles.editButtonInline}><Edit size={16} /> ویرایش</Link>
      <button onClick={() => setOpen(true)} className={styles.deleteButtonInline}><Trash2 size={16} /> حذف</button>
      <ConfirmModal open={open} title="حذف خریدار" description="آیا مطمئن به حذف این خریدار هستید؟" onCancel={() => setOpen(false)} onConfirm={() => { setOpen(false); handleConfirm(); }} confirmLabel="حذف" cancelLabel="انصراف" />
    </div>
  );
}
