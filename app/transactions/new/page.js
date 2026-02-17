"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "@/styles/PropertyForm.module.css";

export default function NewTransactionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    category: "sale",
    description: "",
    date: new Date().toISOString().split("T")[0],
    propertyId: "",
    customerId: "",
  });

  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load properties and customers on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [propsRes, custRes] = await Promise.all([
          fetch("/api/properties?limit=100"),
          fetch("/api/customers?limit=100"),
        ]);
        if (propsRes.ok) {
          const propsData = await propsRes.json();
          setProperties(Array.isArray(propsData) ? propsData : []);
        }
        if (custRes.ok) {
          const custData = await custRes.json();
          setCustomers(Array.isArray(custData) ? custData : []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.category) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
      }),
    });

    if (res.ok) {
      toast.success("تراکنش با موفقیت ثبت شد");
      router.push("/transactions");
    } else {
      toast.error("خطا در ثبت تراکنش");
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/transactions" className={styles.backButton} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
          <ArrowLeft size={20} /> بازگشت
        </Link>
      </div>

      <h1 className={styles.title}>ثبت تراکنش جدید</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* نوع تراکنش */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات تراکنش</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>نوع تراکنش</label>
                <select
                  name="type"
                  className={styles.select}
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="income">درآمد</option>
                  <option value="expense">هزینه</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>دسته‌بندی</label>
                <select
                  name="category"
                  className={styles.select}
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="sale">فروش</option>
                  <option value="rent">اجاره</option>
                  <option value="deposit">رهن</option>
                  <option value="commission">کمیسیون</option>
                  <option value="repair">تعمیر و نگهداری</option>
                  <option value="tax">مالیات</option>
                  <option value="insurance">بیمه</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
          </section>

          {/* مبلغ و تاریخ */}
          <section className={styles.section}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>مبلغ (تومان)</label>
                <input
                  name="amount"
                  type="number"
                  placeholder="مبلغ تراکنش"
                  className={styles.input}
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>تاریخ</label>
                <input
                  name="date"
                  type="date"
                  className={styles.input}
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* انتخاب ملک و خریدار */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>ارتباط با ملک و خریدار</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>ملک (اختیاری)</label>
                <select
                  name="propertyId"
                  className={styles.select}
                  value={form.propertyId}
                  onChange={handleChange}
                >
                  <option value="">انتخاب نکنید</option>
                  {properties.map((prop) => (
                    <option key={prop._id} value={prop._id}>
                      {prop.ownerName} - {prop.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>خریدار (اختیاری)</label>
                <select
                  name="customerId"
                  className={styles.select}
                  value={form.customerId}
                  onChange={handleChange}
                >
                  <option value="">انتخاب نکنید</option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.name} - {cust.customerNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* توضیحات */}
          <section className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label}>توضیحات (اختیاری)</label>
              <textarea
                name="description"
                placeholder="توضیحات بیشتر درباره این تراکنش"
                className={styles.textarea}
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </section>

          {/* دکمه‌های اکشن */}
          <div
            className={styles.formActions}
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button
              type="submit"
              className={styles.submitButton}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                background: "var(--accent-gold)",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              ثبت تراکنش
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
