"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Home,
} from "lucide-react";
import styles from "@/styles/ReportsPage.module.css";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeCustomers: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactions: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // دریافت آمار
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();

        // دریافت تراکنش‌ها
        const txRes = await fetch("/api/transactions");
        const txData = await txRes.json();
        const transactions = Array.isArray(txData) ? txData : [];

        // محاسبه درآمد و هزینه
        const income = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const expense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        setStats({
          totalProperties: statsData.totalProperties || 0,
          activeCustomers: statsData.activeCustomers || 0,
          totalIncome: income,
          totalExpense: expense,
          transactions: transactions,
        });
      } catch (error) {
        console.error("خطا در بارگذاری اطلاعات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profit = stats.totalIncome - stats.totalExpense;
  const profitPercentage =
    stats.totalIncome > 0
      ? ((profit / stats.totalIncome) * 100).toFixed(1)
      : 0;

  // گروه‌بندی تراکنش‌ها بر اساس ماه
  const monthlyData = stats.transactions.reduce((acc, tx) => {
    const date = new Date(tx.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expense: 0, count: 0 };
    }
    if (tx.type === "income") {
      acc[monthKey].income += tx.amount || 0;
    } else {
      acc[monthKey].expense += tx.amount || 0;
    }
    acc[monthKey].count += 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>درحال بارگذاری گزارشات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* هدر */}
      <div className={styles.header}>
        <h1 className={styles.title}>گزارشات و آمار</h1>
        <p className={styles.subtitle}>خلاصه‌ای جامع از وضعیت سیستم</p>
      </div>

      {/* کارت‌های آماری */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(212, 175, 55, 0.1)" }}>
            <Building size={24} color="var(--accent-gold)" />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>کل املاک</span>
            <strong className={styles.statValue}>
              {stats.totalProperties.toLocaleString("fa-IR")}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <Users size={24} color="#10b981" />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>خریداران فعال</span>
            <strong className={styles.statValue}>
              {stats.activeCustomers.toLocaleString("fa-IR")}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.1)" }}>
            <TrendingUp size={24} color="#22c55e" />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>درآمد کل</span>
            <strong className={styles.statValue}>
              {stats.totalIncome.toLocaleString("fa-IR")}
            </strong>
            <small className={styles.statUnit}>تومان</small>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(239, 68, 68, 0.1)" }}>
            <DollarSign size={24} color="#ef4444" />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>هزینه کل</span>
            <strong className={styles.statValue}>
              {stats.totalExpense.toLocaleString("fa-IR")}
            </strong>
            <small className={styles.statUnit}>تومان</small>
          </div>
        </div>

        <div className={styles.statCard} style={{ gridColumn: "span 2" }}>
          <div
            className={styles.statIcon}
            style={{
              background: profit >= 0 ? "rgba(212, 175, 55, 0.1)" : "rgba(239, 68, 68, 0.1)",
            }}
          >
            <Home size={24} color={profit >= 0 ? "var(--accent-gold)" : "#ef4444"} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>سود خالص</span>
            <strong
              className={styles.statValue}
              style={{ color: profit >= 0 ? "var(--accent-gold)" : "#ef4444" }}
            >
              {profit.toLocaleString("fa-IR")}
            </strong>
            <small className={styles.statUnit}>تومان ({profitPercentage}%)</small>
          </div>
        </div>
      </div>

      {/* آمار ماهانه */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>آمار ماهانه</h2>
        {Object.entries(monthlyData)
          .sort()
          .reverse()
          .slice(0, 6)
          .map(([month, data]) => {
            const monthProfit = data.income - data.expense;
            return (
              <div key={month} className={styles.monthlyItem}>
                <div className={styles.monthHeader}>
                  <div className={styles.monthInfo}>
                    <Calendar size={18} className={styles.monthIcon} />
                    <span className={styles.monthLabel}>ماه {month}</span>
                    <span className={styles.monthCount}>
                      ({data.count} تراکنش)
                    </span>
                  </div>
                  <div className={styles.monthStats}>
                    <div className={styles.incomeBox}>
                      <span className={styles.boxLabel}>درآمد</span>
                      <strong>{data.income.toLocaleString("fa-IR")}</strong>
                    </div>
                    <div className={styles.expenseBox}>
                      <span className={styles.boxLabel}>هزینه</span>
                      <strong>{data.expense.toLocaleString("fa-IR")}</strong>
                    </div>
                    <div className={styles.profitBox}>
                      <span className={styles.boxLabel}>سود</span>
                      <strong style={{ color: monthProfit >= 0 ? "#22c55e" : "#ef4444" }}>
                        {monthProfit.toLocaleString("fa-IR")}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className={styles.monthBars}>
                  <div
                    className={styles.incomeBar}
                    style={{
                      width: stats.totalIncome > 0 ? `${(data.income / stats.totalIncome) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
      </div>

      {/* جدول تراکنش‌های اخیر */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>تراکنش‌های اخیر</h2>
        {stats.transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هیچ تراکنشی ثبت نشده است</p>
          </div>
        ) : (
          <div className={styles.transactionsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>تاریخ</div>
              <div className={styles.headerCell}>نوع</div>
              <div className={styles.headerCell}>توضیح</div>
              <div className={styles.headerCell}>مبلغ</div>
            </div>
            {stats.transactions.slice(0, 10).map((tx, idx) => (
              <div key={idx} className={styles.tableRow}>
                <div className={styles.cell}>
                  {new Date(tx.createdAt).toLocaleDateString("fa-IR")}
                </div>
                <div className={styles.cell}>
                  <span
                    className={`${styles.badge} ${
                      tx.type === "income" ? styles.incomeBadge : styles.expenseBadge
                    }`}
                  >
                    {tx.type === "income" ? "درآمد" : "هزینه"}
                  </span>
                </div>
                <div className={styles.cell}>{tx.description || "-"}</div>
                <div
                  className={styles.cell}
                  style={{
                    color: tx.type === "income" ? "#22c55e" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {(tx.type === "income" ? "+" : "-")}
                  {Math.abs(tx.amount || 0).toLocaleString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}