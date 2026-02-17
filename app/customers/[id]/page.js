import { getCustomer } from "@/controllers/customerController";
import styles from "@/styles/CustomerDetail.module.css";
import CustomerActions from "@/components/CustomerActions";

const propertyTypeLabels = {
  apartment: "آپارتمان",
  villa: "ویلایی",
  commercial: "تجاری",
  garden: "باغ",
  any: "هر نوع",
};

const saleTypeLabels = {
  rent: "رهن و اجاره",
  sale: "خرید",
  both: "هر دو",
};

export default async function CustomerDetail({ params }) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    return (
      <div className={styles.notFound}>
        <p>خریدار مورد نظر یافت نشد</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.actionsBar}>
        <CustomerActions id={customer._id} customer={customer} />
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatarLarge}>
            {customer.name?.charAt(0) || "?"}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{customer.name}</h1>
            <p className={styles.customerNumber}>{customer.customerNumber}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>اطلاعات درخواستی</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>نوع ملک:</span>
              <span className={styles.infoValue}>
                {propertyTypeLabels[customer.desiredPropertyType] || "-"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>نوع خرید:</span>
              <span className={styles.infoValue}>
                {saleTypeLabels[customer.desiredSaleType] || "-"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>قیمت مورد نظر:</span>
              <span className={styles.infoValue}>
                {customer.desiredPrice?.toLocaleString() || "-"} تومان
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>متراژ:</span>
              <span className={styles.infoValue}>
                {customer.desiredArea || "-"} متر
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>سال ساخت:</span>
              <span className={styles.infoValue}>
                {customer.desiredBuildYear || "-"}
              </span>
            </div>
          </div>
        </div>

        {customer.description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>توضیحات</h3>
            <p className={styles.description}>{customer.description}</p>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>تاریخچه</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineDate}>
                {new Date(customer.registeredAt).toLocaleDateString("fa-IR")}
              </span>
              <span className={styles.timelineLabel}>تاریخ ثبت</span>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineDate}>
                {new Date(customer.updatedAt).toLocaleDateString("fa-IR")}
              </span>
              <span className={styles.timelineLabel}>آخرین ویرایش</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}