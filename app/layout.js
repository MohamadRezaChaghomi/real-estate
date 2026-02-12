import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import styles from "@/styles/Layout.module.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

export const metadata = {
  title: "سامانه مدیریت املاک | حرفه‌ای",
  description: "سیستم مدیریت املاک با قابلیت‌های پیشرفته",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className={styles.body}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <Toaster position="top-left" />
          <footer className={styles.footer}>
            © {new Date().getFullYear()} سامانه مدیریت املاک
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}