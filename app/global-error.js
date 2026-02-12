"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import styles from "@/styles/Error.module.css";

export default function GlobalError({ error, reset }) {
  // اگر reset تابع نبود، یک تابع بی‌اثر جایگزین کن
  const handleReset = typeof reset === "function" ? reset : () => {};

  return (
    <html>
      <body>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <AlertCircle size={64} className={styles.icon} />
            </div>
            <h1 className={styles.title}>خطای داخلی</h1>
            <p className={styles.description}>
              متأسفانه مشکلی در سرور رخ داده است. لطفاً دقایقی دیگر مجدداً تلاش
              کنید.
            </p>
            <div className={styles.actions}>
              <button onClick={handleReset} className={styles.retryButton}>
                تلاش مجدد
              </button>
              <Link href="/" className={styles.homeButton}>
                <Home size={20} />
                بازگشت به داشبورد
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}