"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "@/styles/PropertyEdit.module.css";

export default function EditProperty({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setImages(data.images || []);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrls = images;
    if (images && images.length > 0 && images[0] instanceof File) {
      const formData = new FormData();
      for (let img of images) formData.append("images", img);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) return toast.error("خطا در آپلود تصاویر");
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.files;
    }

    const payload = { ...form, images: imageUrls };
    const res = await fetch(`/api/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success("ملک با موفقیت ویرایش شد");
      router.push(`/properties/${id}`);
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
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات اولیه</h3>
            <div className={styles.row}>
              {/* عنوان حذف شد - ملک‌ها اسم ندارند */}
              <div className={styles.field}>
                <label className={styles.label}>نوع ملک</label>
                <select name="propertyType" className={styles.select} value={form.propertyType || ""} onChange={handleChange}>
                  <option value="apartment">آپارتمان</option>
                  <option value="villa">ویلایی</option>
                  <option value="commercial">تجاری</option>
                  <option value="garden">باغ</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>متریال کابینت</label>
                <select name="cabinetMaterial" className={styles.select} value={form.cabinetMaterial || ""} onChange={handleChange}>
                  <option value="">انتخاب کنید</option>
                  <option value="mdf">ام‌دی‌اف</option>
                  <option value="highGloss">های‌گلاس</option>
                  <option value="acrylic">اکریلیک</option>
                  <option value="wood">چوب</option>
                  <option value="laminate">لمینت</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>نوع فروش</label>
                <select name="saleType" className={styles.select} value={form.saleType || ""} onChange={handleChange}>
                  <option value="sale">فروش</option>
                  <option value="rent">رهن و اجاره</option>
                </select>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>مشخصات</h3>
            <div className={styles.grid}>
              <input name="area" placeholder="متراژ" className={styles.input} value={form.area || ""} onChange={handleChange} />
              <input name="rooms" placeholder="تعداد خواب" className={styles.input} value={form.rooms || ""} onChange={handleChange} />
              <input name="floor" placeholder="طبقه" className={styles.input} value={form.floor || ""} onChange={handleChange} />
              <input name="unitsCount" placeholder="تعداد واحد" className={styles.input} value={form.unitsCount || ""} onChange={handleChange} />
              <select name="direction" className={styles.select} value={form.direction || ""} onChange={handleChange}>
                <option value="">جهت ساختمان</option>
                <option value="north">شمالی</option>
                <option value="south">جنوبی</option>
                <option value="east">شرقی</option>
                <option value="west">غربی</option>
              </select>
              <select name="deedType" className={styles.select} value={form.deedType || ""} onChange={handleChange}>
                <option value="">نوع سند</option>
                <option value="full">شش دانگ</option>
                <option value="promissory">قولنامه‌ای</option>
              </select>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات مالی</h3>
            {form.saleType === "sale" ? (
              <input name="price" placeholder="قیمت" className={styles.input} value={form.price || ""} onChange={handleChange} />
            ) : (
              <div className={styles.row}>
                <input name="deposit" placeholder="رهن" className={styles.input} value={form.deposit || ""} onChange={handleChange} />
                <input name="rentPrice" placeholder="اجاره ماهانه" className={styles.input} value={form.rentPrice || ""} onChange={handleChange} />
              </div>
            )}
            <label className={styles.checkboxLabel}><input type="checkbox" name="exchange" checked={!!form.exchange} onChange={handleChange} /> معاوضه</label>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>امکانات</h3>
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
                { key: "wardrobe", label: "کمد دیواری" },
                { key: "fireplace", label: "شومینه" },
                { key: "centralAntenna", label: "آنتن مرکزی" },
                { key: "elevator", label: "آسانسور" },
                { key: "storage", label: "انباری" },
                { key: "parking", label: "پارکینگ" },
              ].map((item) => (
                <label key={item.key} className={styles.checkboxLabel}>
                  <input type="checkbox" name={item.key} checked={!!form[item.key]} onChange={handleChange} /> {item.label}
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس و توضیحات</h3>
            <input name="address" placeholder="آدرس" className={styles.input} value={form.address || ""} onChange={handleChange} />
            <textarea name="description" placeholder="توضیحات" className={styles.textarea} value={form.description || ""} onChange={handleChange} rows={4} />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>تصاویر</h3>
            <div className={styles.fileUpload}>
              <input type="file" multiple accept="image/*" onChange={(e)=> setImages(Array.from(e.target.files))} className={styles.fileInput} id="file-upload-edit" />
              <label htmlFor="file-upload-edit" className={styles.fileLabel}>آپلود تصاویر جدید (در صورت نیاز)</label>
            </div>
            <div className={styles.previewWrap}>
              {(images || []).map((img, i) => (
                typeof img === "string" ? (
                  <img key={i} src={img} className={styles.previewImage} />
                ) : (
                  <span key={i} className={styles.previewFile}>{img.name}</span>
                )
              ))}
            </div>
          </section>

          <button type="submit" className={styles.submitButton}>
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  );
}