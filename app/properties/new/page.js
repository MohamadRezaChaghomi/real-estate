"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "@/styles/PropertyForm.module.css";

export default function NewPropertyPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    propertyType: "apartment",
    saleType: "sale",
    area: "",
    rooms: "",
    floor: "",
    unitsCount: "",
    direction: "",
    deedType: "",
    price: "",
    rentPrice: "",
    deposit: "",
    water: false,
    electricity: false,
    gas: false,
    telephone: false,
    cabinet: false,
    hood: false,
    heating: false,
    cooling: false,
    balcony: false,
    flooringType: "",
    wallType: "",
    cabinetMaterial: "",
    wardrobe: false,
    fireplace: false,
    intercom: "none",
    centralAntenna: false,
    elevator: false,
    storage: false,
    parking: false,
    exchange: false,
    address: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrls = [];
    if (images.length > 0) {
      const formData = new FormData();
      for (let img of images) formData.append("images", img);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        toast.error("خطا در آپلود عکس");
        return;
      }
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.files;
    }

    const finalData = { ...form, images: imageUrls };
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    if (res.ok) {
      toast.success("ملک با موفقیت ثبت شد");
      router.push("/properties");
    } else {
      toast.error("خطا در ثبت ملک");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ثبت ملک جدید</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* نوع ملک و نوع فروش */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات اولیه</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>نوع ملک</label>
                <select
                  name="propertyType"
                  className={styles.select}
                  value={form.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">آپارتمان</option>
                  <option value="villa">ویلایی</option>
                  <option value="commercial">تجاری</option>
                  <option value="garden">باغ</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>نوع فروش</label>
                <select
                  name="saleType"
                  className={styles.select}
                  value={form.saleType}
                  onChange={handleChange}
                >
                  <option value="sale">فروش</option>
                  <option value="rent">رهن و اجاره</option>
                </select>
              </div>
            </div>
            {/* عنوان حذف شد - ملک‌ها اسم ندارند */}
          </section>

          {/* مشخصات فیزیکی */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>مشخصات فیزیکی</h3>
            <div className={styles.grid}>
              <input
                name="area"
                placeholder="متراژ (متر)"
                className={styles.input}
                value={form.area}
                onChange={handleChange}
              />
              <input
                name="rooms"
                placeholder="تعداد خواب"
                className={styles.input}
                value={form.rooms}
                onChange={handleChange}
              />
              <input
                name="floor"
                placeholder="طبقه"
                className={styles.input}
                value={form.floor}
                onChange={handleChange}
              />
              <input
                name="unitsCount"
                placeholder="تعداد واحد"
                className={styles.input}
                value={form.unitsCount}
                onChange={handleChange}
              />
              <select
                name="direction"
                className={styles.select}
                value={form.direction}
                onChange={handleChange}
              >
                <option value="">جهت ساختمان</option>
                <option value="north">شمالی</option>
                <option value="south">جنوبی</option>
                <option value="east">شرقی</option>
                <option value="west">غربی</option>
              </select>
              <select
                name="deedType"
                className={styles.select}
                value={form.deedType}
                onChange={handleChange}
              >
                <option value="">نوع سند</option>
                <option value="full">شش دانگ</option>
                <option value="promissory">قولنامه‌ای</option>
              </select>
            </div>
          </section>

          {/* اطلاعات مالی */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات مالی</h3>
            {form.saleType === "sale" ? (
              <input
                name="price"
                placeholder="قیمت فروش (تومان)"
                className={styles.input}
                value={form.price}
                onChange={handleChange}
              />
            ) : (
              <div className={styles.row}>
                <input
                  name="deposit"
                  placeholder="رهن (تومان)"
                  className={styles.input}
                  value={form.deposit}
                  onChange={handleChange}
                />
                <input
                  name="rentPrice"
                  placeholder="اجاره ماهانه (تومان)"
                  className={styles.input}
                  value={form.rentPrice}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="exchange"
                  checked={form.exchange}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>معاوضه پذیرفته می‌شود</span>
              </label>
            </div>
          </section>

          {/* امکانات پایه */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>امکانات پایه</h3>
            <div className={styles.checkboxGroup}>
              {[
                { key: "water", label: "آب" },
                { key: "electricity", label: "برق" },
                { key: "gas", label: "گاز" },
                { key: "telephone", label: "تلفن" },
                { key: "cabinet", label: "کابینت" },
                { key: "hood", label: "هود" },
                { key: "heating", label: "گرمایش" },
                { key: "cooling", label: "سرمایش" },
                { key: "balcony", label: "بالکن" },
              ].map((item) => (
                <label key={item.key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={item.key}
                    checked={form[item.key]}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </section>

          {/* متریال */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>متریال</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>متریال کف</label>
                <select
                  name="flooringType"
                  className={styles.select}
                  value={form.flooringType}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="parquet">پارکت</option>
                  <option value="ceramic">سرامیک</option>
                  <option value="stone">سنگ</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>متریال دیوار</label>
                <select
                  name="wallType"
                  className={styles.select}
                  value={form.wallType}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="paint">نقاشی</option>
                  <option value="wallpaper">کاغذ دیواری</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>متریال کابینت</label>
                <select name="cabinetMaterial" className={styles.select} value={form.cabinetMaterial} onChange={handleChange}>
                  <option value="">انتخاب کنید</option>
                  <option value="mdf">ام‌دی‌اف</option>
                  <option value="highGloss">های‌گلاس</option>
                  <option value="acrylic">اکریلیک</option>
                  <option value="wood">چوب</option>
                  <option value="laminate">لمینت</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
          </section>

          {/* امکانات رفاهی */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>امکانات رفاهی</h3>
            <div className={styles.checkboxGroup}>
              {[
                { key: "wardrobe", label: "کمد دیواری" },
                { key: "fireplace", label: "شومینه" },
                { key: "centralAntenna", label: "آنتن مرکزی" },
                { key: "elevator", label: "آسانسور" },
                { key: "storage", label: "انباری" },
                { key: "parking", label: "پارکینگ" },
              ].map((item) => (
                <label key={item.key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={item.key}
                    checked={form[item.key]}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>آیفون</label>
              <select
                name="intercom"
                className={styles.select}
                value={form.intercom}
                onChange={handleChange}
              >
                <option value="none">ندارد</option>
                <option value="audio">صوتی</option>
                <option value="video">تصویری</option>
              </select>
            </div>
          </section>

          {/* آدرس و توضیحات */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس و توضیحات</h3>
            <input
              name="address"
              placeholder="آدرس کامل"
              className={styles.input}
              value={form.address}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="توضیحات"
              className={styles.textarea}
              value={form.description}
              onChange={handleChange}
              rows={5}
            />
          </section>

          {/* تصاویر */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>تصاویر ملک</h3>
            <div className={styles.fileUpload}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                className={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.fileLabel}>
                <span>برای آپلود کلیک کنید یا فایل را بکشید</span>
              </label>
            </div>
          </section>

          {/* اطلاعات مالک */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات مالک</h3>
            <div className={styles.row}>
              <input
                name="ownerName"
                placeholder="نام مالک"
                className={styles.input}
                value={form.ownerName}
                onChange={handleChange}
              />
              <input
                name="ownerPhone"
                placeholder="شماره مالک"
                className={styles.input}
                value={form.ownerPhone}
                onChange={handleChange}
              />
            </div>
          </section>

          <button type="submit" className={styles.submitButton}>
            ثبت ملک
          </button>
        </form>
      </div>
    </div>
  );
}