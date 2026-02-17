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
  title: "خانه ی پدری | سامانه مدیریت املاک",
  description: "سامانه مدیریت و معاملات املاک خانه ی پدری - بهترین راه حل برای مدیریت ملک",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23d4af37' width='100' height='100' rx='20'/><path fill='%231a1a1a' d='M50 20L70 35v35H30V35Z'/><rect fill='%231a1a1a' x='35' y='40' width='12' height='12'/><rect fill='%231a1a1a' x='53' y='40' width='12' height='12'/><polygon fill='%231a1a1a' points='50,25 55,32 45,32'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className={styles.body}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          <Navbar />
          <main className={styles.main}>{children}</main>
          <Toaster position="top-left" />
          <footer className={styles.footer}>
            © {new Date().getFullYear()} خانه ی پدری - سامانه مدیریت املاک
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}