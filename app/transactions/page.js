"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, TrendingUp, TrendingDown, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import styles from "@/styles/TransactionsPage.module.css";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    let filtered = transactions;
    
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }
    
    if (monthFilter) {
      filtered = filtered.filter((t) => 
        new Date(t.date).toISOString().slice(0, 7) === monthFilter
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, typeFilter, monthFilter]);

  const calculateStats = (data) => {
    const income = data.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = data.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  };

  const stats = calculateStats(filteredTransactions);

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>تراکنش‌های مالی</h1>
            <p className={styles.subtitle}>مدیریت تمام درآمد و هزینه‌های ملکی</p>
          </div>
          <Link href="/transactions/new" className={styles.addButton}>
            <Plus size={20} /> ثبت تراکنش جدید
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard + " " + styles.incomeCard}>
          <div className={styles.statIcon}>
            <ArrowDownLeft size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>درآمد‌های ثبت شده</span>
            <span className={styles.statValue}>{stats.income.toLocaleString("fa-IR")} ت</span>
          </div>
        </div>

        <div className={styles.statCard + " " + styles.expenseCard}>
          <div className={styles.statIcon}>
            <ArrowUpRight size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>هزینه‌های ثبت شده</span>
            <span className={styles.statValue}>{stats.expense.toLocaleString("fa-IR")} ت</span>
          </div>
        </div>

        <div className={styles.statCard + " " + styles.profitCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>سود خالص</span>
            <span className={styles.statValue}>{stats.profit.toLocaleString("fa-IR")} ت</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>نوع تراکنش</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={styles.select}>
            <option value="all">همه تراکنش‌ها</option>
            <option value="income">درآمد</option>
            <option value="expense">هزینه</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>ماه</label>
          <input 
            type="month" 
            value={monthFilter} 
            onChange={(e) => setMonthFilter(e.target.value)}
            className={styles.select}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className={styles.transactionsList}>
        {filteredTransactions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هیچ تراکنشی یافت نشد</p>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <div key={t._id} className={styles.transactionCard}>
              <div className={styles.transactionIcon}>
                {t.type === "income" ? 
                  <ArrowDownLeft size={20} style={{color: '#10b981'}} /> :
                  <ArrowUpRight size={20} style={{color: '#ef4444'}} />
                }
              </div>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionHeader}>
                  <h3 className={styles.transactionTitle}>{t.category}</h3>
                  <span className={`${styles.transactionType} ${styles[t.type]}`}>
                    {t.type === "income" ? "درآمد" : "هزینه"}
                  </span>
                </div>
                <p className={styles.transactionDetail}>
                  {t.propertyId?.title || t.customerId?.name || t.description || "—"}
                </p>
                <span className={styles.transactionDate}>
                  {new Date(t.date).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className={styles.transactionAmount}>
                <span className={`${styles.amount} ${styles[t.type]}`}>
                  {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString("fa-IR")} ت
                </span>
                <Link href={`/transactions/${t._id}`} className={styles.viewIcon}>
                  <Eye size={18} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
