"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/ReportsPage.module.css";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        const txList = Array.isArray(data) ? data : [];
        setTransactions(txList);
        const income = txList
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const expense = txList
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        setTotalIncome(income);
        setTotalExpense(expense);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>گزارشات مالی</h1>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>درآمد کل</span>
          <strong>{totalIncome.toLocaleString("fa-IR")} تومان</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>هزینه کل</span>
          <strong>{totalExpense.toLocaleString("fa-IR")} تومان</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>سود خالص</span>
          <strong>{(totalIncome - totalExpense).toLocaleString("fa-IR")} تومان</strong>
        </div>
      </div>
    </div>
  );
}