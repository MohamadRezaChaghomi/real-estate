import { getCustomers } from "@/controllers/customerController";
import CustomerCard from "@/components/CustomerCard";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import styles from "@/styles/CustomersPage.module.css";

export default async function CustomersPage({ searchParams }) {
  const customers = await getCustomers(searchParams, {
    field: searchParams.sortField,
    order: searchParams.sortOrder,
  });

  const customersArray = Array.isArray(customers) ? customers : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>لیست خریداران</h1>
          <span className={styles.badge}>{customersArray.length} خریدار</span>
        </div>
        <Link href="/customers/new" className={styles.addButton}>
          <UserPlus size={20} />
          ثبت خریدار جدید
        </Link>
      </div>

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