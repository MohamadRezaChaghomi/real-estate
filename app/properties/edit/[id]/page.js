"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "@/styles/PropertyEdit.module.css";

export default function EditProperty({ params }) {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/properties/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("ملک با موفقیت ویرایش شد");
      router.push(`/properties/${params.id}`);
    } else {
      toast.error("خطا در ویرایش ملک");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ویرایش ملک</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>عنوان ملک</label>
            <input
              name="title"
              className={styles.input}
              value={form.title}
              onChange={handleChange}
              placeholder="عنوان"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>قیمت (تومان)</label>
              <input
                name="price"
                className={styles.input}
                value={form.price}
                onChange={handleChange}
                placeholder="قیمت"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>متراژ (متر)</label>
              <input
                name="area"
                className={styles.input}
                value={form.area}
                onChange={handleChange}
                placeholder="متراژ"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              name="description"
              className={styles.textarea}
              value={form.description}
              onChange={handleChange}
              placeholder="توضیحات"
              rows={5}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  );
}