"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Home,
  User,
  CreditCard,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "@/styles/TransactionDetail.module.css";

export default function TransactionDetail({ params }) {
  const router = useRouter();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/transactions/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("تراکنش یافت نشد");
        return res.json();
      })
      .then((data) => {
        setTransaction(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        router.push("/transactions");
      });
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm("آیا از حذف این تراکنش اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/transactions/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تراکنش با موفقیت حذف شد");
        router.push("/transactions");
      } else {
        toast.error("خطا در حذف تراکنش");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!transaction) return null;

  const typeLabel = transaction.type === "income" ? "درآمد" : "هزینه";
  const typeClass = transaction.type === "income" ? styles.income : styles.expense;

  const categoryLabels = {
    commission: "کمیسیون",
    rent: "اجاره",
    sale: "فروش",
    maintenance: "تعمیرات",
    other: "سایر",
  };

  const paymentMethodLabels = {
    cash: "نقدی",
    card: "کارت خوان",
    check: "چک",
    bank: "انتقال بانکی",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/transactions" className={styles.backLink}>
          <ArrowLeft size={20} />
          بازگشت به لیست تراکنش‌ها
        </Link>
        <div className={styles.actions}>
          <Link
            href={`/transactions/edit/${transaction._id}`}
            className={styles.editButton}
          >
            <Edit size={18} /> ویرایش
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            <Trash2 size={18} /> حذف
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>جزئیات تراکنش</h1>
            <span className={`${styles.badge} ${typeClass}`}>{typeLabel}</span>
          </div>
        </div>

        <div className={styles.content}>
          {/* ردیف مبلغ */}
          <div className={styles.row}>
            <div className={styles.label}>
              <DollarSign size={18} />
              <span>مبلغ</span>
            </div>
            <div className={`${styles.value} ${styles.amount}`}>
              {transaction.amount?.toLocaleString("fa-IR")} تومان
            </div>
          </div>

          {/* ردیف دسته‌بندی */}
          <div className={styles.row}>
            <div className={styles.label}>
              <FileText size={18} />
              <span>دسته‌بندی</span>
            </div>
            <div className={styles.value}>
              {categoryLabels[transaction.category] || transaction.category}
            </div>
          </div>

          {/* ردیف تاریخ */}
          <div className={styles.row}>
            <div className={styles.label}>
              <Calendar size={18} />
              <span>تاریخ</span>
            </div>
            <div className={styles.value}>
              {new Date(transaction.date).toLocaleDateString("fa-IR")}
            </div>
          </div>

          {/* ردیف روش پرداخت */}
          {transaction.paymentMethod && (
            <div className={styles.row}>
              <div className={styles.label}>
                <CreditCard size={18} />
                <span>روش پرداخت</span>
              </div>
              <div className={styles.value}>
                {paymentMethodLabels[transaction.paymentMethod] ||
                  transaction.paymentMethod}
                {transaction.reference && (
                  <span className={styles.reference}>
                    (مرجع: {transaction.reference})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ردیف ملک */}
          {transaction.propertyId && (
            <div className={styles.row}>
              <div className={styles.label}>
                <Home size={18} />
                <span>ملک</span>
              </div>
              <div className={styles.value}>
                <Link
                  href={`/properties/${transaction.propertyId._id}`}
                  className={styles.link}
                >
                  {transaction.propertyId.title || "مشاهده ملک"}
                </Link>
              </div>
            </div>
          )}

          {/* ردیف مشتری */}
          {transaction.customerId && (
            <div className={styles.row}>
              <div className={styles.label}>
                <User size={18} />
                <span>مشتری</span>
              </div>
              <div className={styles.value}>
                <Link
                  href={`/customers/${transaction.customerId._id}`}
                  className={styles.link}
                >
                  {transaction.customerId.name || "مشاهده خریدار"}
                </Link>
              </div>
            </div>
          )}

          {/* توضیحات */}
          {transaction.description && (
            <div className={styles.row}>
              <div className={styles.label}>
                <FileText size={18} />
                <span>توضیحات</span>
              </div>
              <div className={styles.value}>{transaction.description}</div>
            </div>
          )}

          {/* تاریخچه */}
          <div className={styles.footer}>
            <div className={styles.meta}>
              تاریخ ثبت:{" "}
              {new Date(transaction.createdAt).toLocaleDateString("fa-IR")}
            </div>
            {transaction.updatedAt !== transaction.createdAt && (
              <div className={styles.meta}>
                آخرین ویرایش:{" "}
                {new Date(transaction.updatedAt).toLocaleDateString("fa-IR")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}