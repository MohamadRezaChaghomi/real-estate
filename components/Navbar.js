"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Home,
  Building,
  Users,
  BarChart3,
  Calendar,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import styles from "@/styles/Navbar.module.css";

const navigation = [
  { name: "داشبورد", href: "/", icon: Home },
  { name: "املاک", href: "/properties", icon: Building },
  { name: "خریداران", href: "/customers", icon: Users },
  { name: "گزارشات", href: "/reports", icon: BarChart3 },
  { name: "تقویم", href: "/calendar", icon: Calendar },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* لوگو و دکمه همبرگری */}
        <div className={styles.navbarBrand}>
          <Link href="/" className={styles.logo}>
            <Building size={24} />
            <span>مدیریت املاک</span>
          </Link>
          <button
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="منو"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* لینک‌های ناوبری */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* بخش سمت راست – تم و پروفایل */}
        <div className={styles.navActions}>
          {mounted && (
            <button
              className={styles.themeToggle}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="تغییر تم"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <div className={styles.profileDropdown}>
            <button className={styles.profileButton}>
              <div className={styles.avatar}>مد</div>
              <span className={styles.profileName}>مدیر سیستم</span>
            </button>
            <div className={styles.dropdownMenu}>
              <Link href="/profile" className={styles.dropdownItem}>
                <User size={16} /> پروفایل
              </Link>
              <button className={styles.dropdownItem}>
                <LogOut size={16} /> خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}