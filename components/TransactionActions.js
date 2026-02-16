"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import styles from "@/styles/TransactionDetail.module.css";

export default function TransactionActions({ id }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تراکنش حذف شد");
        router.push("/transactions");
      } else {
        toast.error("حذف انجام نشد");
      }
    } catch (e) {
      toast.error("خطا در حذف");
    }
  }

  return (
    <div className={styles.actionsBar}>
      <Link href={`/transactions/edit/${id}`} className={styles.editButtonInline}><Edit size={16} /> ویرایش</Link>
      <button onClick={() => setOpen(true)} className={styles.deleteButtonInline}><Trash2 size={16} /> حذف</button>
      <ConfirmModal open={open} title="حذف تراکنش" description="آیا مطمئن به حذف این تراکنش هستید؟" onCancel={() => setOpen(false)} onConfirm={() => { setOpen(false); handleConfirm(); }} confirmLabel="حذف" cancelLabel="انصراف" />
    </div>
  );
}
