import { getCustomers } from "@/controllers/customerController";
import CustomerCard from "@/components/CustomerCard";
import CustomerFilter from "@/components/CustomerFilter";
import SearchHeader from "@/components/SearchHeader";
import CustomerSortBar from "@/components/CustomerSortBar";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import styles from "@/styles/CustomersPage.module.css";

export default async function CustomersPage({ searchParams }) {
  const sp = await searchParams;
  const filters = { ...(sp || {}), limit: (sp && sp.limit) || "20" };
  const customers = await getCustomers(filters, {
    field: sp?.sortField,
    order: sp?.sortOrder,
  });

  const customersArray = Array.isArray(customers) ? customers : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>لیست خریداران</h1>
          <span className={styles.badge}>{customersArray.length} خریدار</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/api/customers/export" className={styles.exportButton}>
            خروجی اکسل
          </Link>
          <Link href="/customers/new" className={styles.addButton}>
            <UserPlus size={20} />
            ثبت خریدار جدید
          </Link>
        </div>
      </div>

      <SearchHeader placeholder="جستجوی نام یا شماره خریدار..." />
      <CustomerFilter />
      <CustomerSortBar />

      {customersArray.length === 0 ? (
        <div className={styles.emptyState}>
          <p>خریداری یافت نشد</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {customersArray.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}