"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "@/styles/CustomerForm.module.css";

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    desiredPropertyType: "",
    desiredSaleType: "",
    desiredPrice: "",
    desiredArea: "",
    desiredBuildYear: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("خریدار با موفقیت ثبت شد");
      router.push("/customers");
    } else {
      toast.error("خطا در ثبت خریدار");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ثبت خریدار جدید</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* اطلاعات شخصی */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات شخصی</h3>
            <div className={styles.field}>
              <label className={styles.label}>نام خریدار</label>
              <input
                name="name"
                type="text"
                placeholder="نام خریدار"
                className={styles.input}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* مشخصات درخواستی */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>مشخصات درخواستی</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>نوع ملک مورد نظر</label>
                <select
                  name="desiredPropertyType"
                  className={styles.select}
                  value={form.desiredPropertyType}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="apartment">آپارتمان</option>
                  <option value="villa">ویلایی</option>
                  <option value="commercial">تجاری</option>
                  <option value="garden">باغ</option>
                  <option value="any">هر نوع</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>نوع خرید</label>
                <select
                  name="desiredSaleType"
                  className={styles.select}
                  value={form.desiredSaleType}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="sale">خرید</option>
                  <option value="rent">رهن و اجاره</option>
                  <option value="both">هر دو</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>قیمت مورد نظر (تومان)</label>
                <input
                  name="desiredPrice"
                  placeholder="مثلاً ۲٬۰۰۰٬۰۰۰٬۰۰۰"
                  className={styles.input}
                  value={form.desiredPrice}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>متراژ مورد نظر</label>
                <input
                  name="desiredArea"
                  placeholder="متراژ (متر)"
                  className={styles.input}
                  value={form.desiredArea}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>سال ساخت مورد نظر</label>
                <input
                  name="desiredBuildYear"
                  placeholder="مثلاً ۱۴۰۰"
                  className={styles.input}
                  value={form.desiredBuildYear}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* توضیحات */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>توضیحات</h3>
            <div className={styles.field}>
              <textarea
                name="description"
                placeholder="توضیحات اضافی (اولویت‌ها، محدوده، …)"
                className={styles.textarea}
                value={form.description}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </section>

          <button type="submit" className={styles.submitButton}>
            ثبت خریدار
          </button>
        </form>
      </div>
    </div>
  );
}