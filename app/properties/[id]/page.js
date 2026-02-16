import { getProperty } from "@/controllers/propertyController";
import PropertyMap from "@/components/PropertyMap";
import styles from "@/styles/PropertyDetail.module.css";
import PropertyActions from "@/components/PropertyActions";

const propertyTypeLabels = {
  apartment: "آپارتمان",
  villa: "ویلایی",
  commercial: "تجاری",
  garden: "باغ",
};

const saleTypeLabels = {
  rent: "رهن و اجاره",
  sale: "فروش",
};

const directionLabels = {
  north: "شمالی",
  south: "جنوبی",
  east: "شرقی",
  west: "غربی",
};

const deedTypeLabels = {
  full: "شش دانگ",
  promissory: "قولنامه‌ای",
};

const flooringLabels = {
  parquet: "پارکت",
  ceramic: "سرامیک",
  stone: "سنگ",
  other: "سایر",
};

const wallLabels = {
  paint: "نقاشی",
  wallpaper: "کاغذ دیواری",
  other: "سایر",
};

const intercomLabels = {
  none: "ندارد",
  audio: "صوتی",
  video: "تصویری",
};

export default async function PropertyDetail({ params }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className={styles.notFound}>
        <p>ملک مورد نظر یافت نشد</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.actionsBar}>
        <PropertyActions id={property._id} />
      </div>
      {/* گالری تصاویر */}
      {property.images?.length > 0 && (
        <div className={styles.gallery}>
          {property.images.map((img, i) => (
            <img key={i} src={img} alt="" className={styles.galleryImage} />
          ))}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{property.ownerName || "بدون نام مالک"}</h1>
            {property.ownerPhone && <div className={styles.ownerPhone} dir="ltr">{property.ownerPhone}</div>}
            <div className={styles.badgeGroup}>
              <span className={styles.badge}>
                {propertyTypeLabels[property.propertyType]}
              </span>
              <span className={styles.badge}>
                {saleTypeLabels[property.saleType]}
              </span>
              {property.exchange && (
                <span className={`${styles.badge} ${styles.badgeExchange}`}>
                  معاوضه
                </span>
              )}
            </div>
          </div>
          <div className={styles.priceBox}>
            <div className={styles.mainPrice}>
              {property.saleType === "sale"
                ? `${property.price?.toLocaleString()} تومان`
                : `${property.deposit?.toLocaleString()} تومان رهن`}
            </div>
            {property.saleType === "rent" && property.rentPrice && (
              <div className={styles.rentPrice}>
                اجاره ماهانه: {property.rentPrice.toLocaleString()} تومان
              </div>
            )}
          </div>
        </div>

        {/* مشخصات اصلی */}
        <div className={styles.specsGrid}>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>متراژ</span>
            <span className={styles.specValue}>{property.area} متر</span>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>تعداد خواب</span>
            <span className={styles.specValue}>{property.rooms || "-"}</span>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>طبقه</span>
            <span className={styles.specValue}>{property.floor || "-"}</span>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>تعداد واحد</span>
            <span className={styles.specValue}>{property.unitsCount || "-"}</span>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>جهت ساختمان</span>
            <span className={styles.specValue}>
              {directionLabels[property.direction] || "-"}
            </span>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>نوع سند</span>
            <span className={styles.specValue}>
              {deedTypeLabels[property.deedType] || "-"}
            </span>
          </div>
        </div>

        {/* امکانات پایه */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>امکانات پایه</h3>
          <div className={styles.badgeGroup}>
            {property.water && <span className={styles.badge}>آب</span>}
            {property.electricity && <span className={styles.badge}>برق</span>}
            {property.gas && <span className={styles.badge}>گاز</span>}
            {property.telephone && <span className={styles.badge}>تلفن</span>}
            {property.cabinet && <span className={styles.badge}>کابینت</span>}
            {property.hood && <span className={styles.badge}>هود</span>}
            {property.heating && <span className={styles.badge}>گرمایش</span>}
            {property.cooling && <span className={styles.badge}>سرمایش</span>}
            {property.balcony && <span className={styles.badge}>بالکن</span>}
          </div>
        </div>

        {/* متریال */}
        <div className={styles.row}>
          <div className={styles.materialItem}>
            <h4 className={styles.materialTitle}>متریال کف</h4>
            <span className={styles.badge}>
              {flooringLabels[property.flooringType] || "-"}
            </span>
          </div>
          <div className={styles.materialItem}>
            <h4 className={styles.materialTitle}>متریال دیوار</h4>
            <span className={styles.badge}>
              {wallLabels[property.wallType] || "-"}
            </span>
          </div>
          <div className={styles.materialItem}>
            <h4 className={styles.materialTitle}>متریال کابینت</h4>
            <span className={styles.badge}>
              {property.cabinetMaterial === "mdf"
                ? "ام‌دی‌اف"
                : property.cabinetMaterial === "highGloss"
                ? "های‌گلاس"
                : property.cabinetMaterial === "acrylic"
                ? "اکریلیک"
                : property.cabinetMaterial === "wood"
                ? "چوب"
                : property.cabinetMaterial === "laminate"
                ? "لمینت"
                : property.cabinetMaterial === "other"
                ? "سایر"
                : "-"}
            </span>
          </div>
        </div>

        {/* امکانات رفاهی */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>امکانات رفاهی</h3>
          <div className={styles.badgeGroup}>
            {property.wardrobe && <span className={styles.badge}>کمد دیواری</span>}
            {property.fireplace && <span className={styles.badge}>شومینه</span>}
            {property.intercom !== "none" && (
              <span className={styles.badge}>
                آیفون {intercomLabels[property.intercom]}
              </span>
            )}
            {property.centralAntenna && (
              <span className={styles.badge}>آنتن مرکزی</span>
            )}
            {property.elevator && <span className={styles.badge}>آسانسور</span>}
            {property.storage && <span className={styles.badge}>انباری</span>}
            {property.parking && <span className={styles.badge}>پارکینگ</span>}
          </div>
        </div>

        {/* آدرس */}
        {property.address && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>آدرس</h3>
            <p className={styles.address}>{property.address}</p>
          </div>
        )}

        {/* نقشه */}
        {property.latitude && property.longitude && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>موقعیت روی نقشه</h3>
            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              address={property.address}
            />
          </div>
        )}

        {/* توضیحات */}
        {property.description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>توضیحات</h3>
            <p className={styles.description}>{property.description}</p>
          </div>
        )}

        {/* اطلاعات مالک */}
        <div className={styles.ownerSection}>
          <h3 className={styles.sectionTitle}>اطلاعات مالک</h3>
          <div className={styles.ownerInfo}>
            <div>
              <span className={styles.ownerLabel}>نام مالک:</span>
              <span className={styles.ownerValue}>{property.ownerName}</span>
            </div>
            <div>
              <span className={styles.ownerLabel}>شماره تماس:</span>
              <span className={styles.ownerValue} dir="ltr">
                {property.ownerPhone}
              </span>
            </div>
          </div>
        </div>

        {/* تاریخ ثبت و آخرین ویرایش */}
        <div className={styles.footer}>
          <div>تاریخ ثبت: {new Date(property.createdAt).toLocaleDateString("fa-IR")}</div>
          <div>آخرین ویرایش: {new Date(property.updatedAt).toLocaleDateString("fa-IR")}</div>
        </div>
      </div>
    </div>
  );
}