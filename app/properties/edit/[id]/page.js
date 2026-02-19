"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "@/styles/PropertyEdit.module.css";
import dynamic from "next/dynamic";

const MapSelector = dynamic(() => import("@/components/MapSelector"), { ssr: false });

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
    const val = type === "checkbox" ? checked : value;
    const updated = { ...form, [name]: val };

    // همگام‌سازی قیمت و قیمت هر متر
    if (name === "pricePerSqm") {
      const areaNum = parseFloat(updated.area) || 0;
      const pps = parseFloat(value) || 0;
      if (areaNum > 0) updated.price = Math.round(pps * areaNum);
    } else if (name === "price") {
      const areaNum = parseFloat(updated.area) || 0;
      const priceNum = parseFloat(value) || 0;
      if (areaNum > 0) updated.pricePerSqm = Math.round(priceNum / areaNum);
    } else if (name === "area") {
      const areaNum = parseFloat(value) || 0;
      const priceNum = parseFloat(updated.price) || 0;
      const ppsNum = parseFloat(updated.pricePerSqm) || 0;
      if (priceNum > 0 && areaNum > 0) {
        updated.pricePerSqm = Math.round(priceNum / areaNum);
      } else if (ppsNum > 0 && areaNum > 0) {
        updated.price = Math.round(ppsNum * areaNum);
      }
    }

    setForm(updated);
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
          {/* ---------- اطلاعات اولیه ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات اولیه</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>نوع ملک</label>
                <select
                  name="propertyType"
                  className={styles.select}
                  value={form.propertyType || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
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
                  value={form.saleType || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="sale">فروش</option>
                  <option value="rent">رهن و اجاره</option>
                </select>
              </div>
            </div>
          </section>

          {/* ---------- مشخصات فیزیکی ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>مشخصات فیزیکی</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>متراژ (متر مربع)</label>
                <input
                  name="area"
                  type="number"
                  placeholder="مثلاً ۸۰"
                  className={styles.input}
                  value={form.area || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>تعداد خواب</label>
                <input
                  name="rooms"
                  type="number"
                  placeholder="مثلاً ۲"
                  className={styles.input}
                  value={form.rooms || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>طبقه</label>
                <input
                  name="floor"
                  type="number"
                  placeholder="مثلاً ۳"
                  className={styles.input}
                  value={form.floor || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>تعداد واحد</label>
                <input
                  name="unitsCount"
                  type="number"
                  placeholder="مثلاً ۱۲"
                  className={styles.input}
                  value={form.unitsCount || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>جهت ساختمان</label>
                <select
                  name="direction"
                  className={styles.select}
                  value={form.direction || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="north">شمالی</option>
                  <option value="south">جنوبی</option>
                  <option value="east">شرقی</option>
                  <option value="west">غربی</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>نوع سند</label>
                <select
                  name="deedType"
                  className={styles.select}
                  value={form.deedType || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="full">شش دانگ</option>
                  <option value="promissory">قولنامه‌ای</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>سال ساخت</label>
                <input
                  name="yearBuilt"
                  type="number"
                  placeholder="مثلاً ۱۳۹۵"
                  className={styles.input}
                  value={form.yearBuilt || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* ---------- اطلاعات مالی ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات مالی</h3>
            {form.saleType === "sale" ? (
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>قیمت فروش (تومان)</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="قیمت کل"
                    className={styles.input}
                    value={form.price || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>قیمت هر متر (تومان)</label>
                  <input
                    name="pricePerSqm"
                    type="number"
                    placeholder="قیمت هر متر"
                    className={styles.input}
                    value={form.pricePerSqm || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>رهن (تومان)</label>
                  <input
                    name="deposit"
                    type="number"
                    placeholder="مبلغ رهن"
                    className={styles.input}
                    value={form.deposit || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>اجاره ماهانه (تومان)</label>
                  <input
                    name="rentPrice"
                    type="number"
                    placeholder="اجاره ماهانه"
                    className={styles.input}
                    value={form.rentPrice || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="exchange"
                  checked={!!form.exchange}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                قابل معاوضه
              </label>
            </div>
          </section>

          {/* ---------- امکانات پایه ---------- */}
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
                    checked={!!form[item.key]}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {/* انتخاب نوع گرمایش و سرمایش */}
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>نوع گرمایش</label>
                <select
                  name="heatingType"
                  className={styles.select}
                  value={form.heatingType || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="central">گرمایش مرکزی</option>
                  <option value="package">پکیج</option>
                  <option value="waterHeater">آب‌گرمکن</option>
                  <option value="fireplace">شومینه</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>نوع سرمایش</label>
                <select
                  name="coolingType"
                  className={styles.select}
                  value={form.coolingType || ""}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="waterCooler">کولر آبی</option>
                  <option value="airConditioner">کولر گازی</option>
                  <option value="fan">پنکه</option>
                  <option value="central">سرمایش مرکزی</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
          </section>

          {/* ---------- متریال ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>متریال</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>متریال کف</label>
                <select
                  name="flooringType"
                  className={styles.select}
                  value={form.flooringType || ""}
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
                  value={form.wallType || ""}
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
                <select
                  name="cabinetMaterial"
                  className={styles.select}
                  value={form.cabinetMaterial || ""}
                  onChange={handleChange}
                >
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

          {/* ---------- امکانات رفاهی ---------- */}
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
                    checked={!!form[item.key]}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <div className={styles.field} style={{ marginTop: "1rem" }}>
              <label className={styles.label}>آیفون</label>
              <select
                name="intercom"
                className={styles.select}
                value={form.intercom || "none"}
                onChange={handleChange}
              >
                <option value="none">ندارد</option>
                <option value="audio">صوتی</option>
                <option value="video">تصویری</option>
              </select>
            </div>
          </section>

          {/* ---------- آدرس و توضیحات ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس و توضیحات</h3>
            <div className={styles.field}>
              <label className={styles.label}>آدرس</label>
              <MapSelector
                latitude={form.latitude}
                longitude={form.longitude}
                address={form.address}
                onChange={({ address, latitude, longitude }) =>
                  setForm({ ...form, address, latitude, longitude })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>توضیحات اضافی</label>
              <textarea
                name="description"
                placeholder="توضیحات در مورد ملک"
                className={styles.textarea}
                value={form.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </section>

          {/* ---------- تصاویر ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>تصاویر</h3>
            <div className={styles.fileUpload}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className={styles.fileInput}
                id="file-upload-edit"
              />
              <label htmlFor="file-upload-edit" className={styles.fileLabel}>
                + آپلود تصاویر جدید
              </label>
            </div>
            {(images || []).length > 0 && (
              <div className={styles.previewWrap}>
                {(images || []).map((img, i) =>
                  typeof img === "string" ? (
                    <div key={i} className={styles.previewContainer}>
                      <img src={img} className={styles.previewImage} alt={`preview-${i}`} />
                    </div>
                  ) : (
                    <div key={i} className={styles.previewFile}>{img.name}</div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ---------- اطلاعات مالک ---------- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>اطلاعات مالک</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>نام مالک</label>
                <input
                  name="ownerName"
                  placeholder="نام و نام خانوادگی"
                  className={styles.input}
                  value={form.ownerName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>شماره مالک</label>
                <input
                  name="ownerPhone"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className={styles.input}
                  value={form.ownerPhone || ""}
                  onChange={handleChange}
                />
              </div>
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