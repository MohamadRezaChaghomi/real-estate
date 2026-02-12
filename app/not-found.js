import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";
import styles from "@/styles/NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={64} className={styles.icon} />
        </div>
        <h1 className={styles.title}>۴۰۴</h1>
        <h2 className={styles.subtitle}>صفحه مورد نظر یافت نشد</h2>
        <p className={styles.description}>
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
        <Link href="/" className={styles.homeButton}>
          <Home size={20} />
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
}