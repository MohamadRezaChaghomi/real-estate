"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, TrendingUp, TrendingDown } from "lucide-react";
import styles from "@/styles/TransactionsPage.module.css";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>تراکنش‌های مالی</h1>
        <Link href="/transactions/new" className={styles.addButton}>
          <Plus size={20} /> ثبت تراکنش جدید
        </Link>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <TrendingUp size={24} className={styles.incomeIcon} />
          <span>درآمد کل</span>
          <strong>{totalIncome.toLocaleString("fa-IR")} تومان</strong>
        </div>
        <div className={styles.summaryCard}>
          <TrendingDown size={24} className={styles.expenseIcon} />
          <span>هزینه کل</span>
          <strong>{totalExpense.toLocaleString("fa-IR")} تومان</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>سود خالص</span>
          <strong>{(totalIncome - totalExpense).toLocaleString("fa-IR")} تومان</strong>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>تاریخ</th>
              <th>نوع</th>
              <th>دسته‌بندی</th>
              <th>مبلغ</th>
              <th>ملک/مشتری</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString("fa-IR")}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      t.type === "income" ? styles.income : styles.expense
                    }`}
                  >
                    {t.type === "income" ? "درآمد" : "هزینه"}
                  </span>
                </td>
                <td>{t.category}</td>
                <td className={styles.amount}>
                  {t.amount.toLocaleString("fa-IR")} تومان
                </td>
                <td>
                  {t.propertyId?.title || t.customerId?.name || "—"}
                </td>
                <td>
                  <Link
                    href={`/transactions/${t._id}`}
                    className={styles.viewButton}
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}