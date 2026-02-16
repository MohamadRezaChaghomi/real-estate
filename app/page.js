"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  DollarSign,
  Users,
  TrendingUp,
  Download,
  Plus,
  Calendar,
  Home,
  Eye,
  MapPin,
  Square,
  Bed,
} from "lucide-react";
import styles from "@/styles/Home.module.css";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. دریافت آمار
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();
        setStats([
          {
            label: "کل املاک",
            value: statsData.totalProperties?.toLocaleString("fa-IR") || "۰",
            icon: <Building />,
            color: "bg-blue-500",
            change: "+۱۲٪",
          },
          {
            label: "مشتریان فعال",
            value: statsData.activeCustomers?.toLocaleString("fa-IR") || "۰",
            icon: <Users />,
            color: "bg-purple-500",
            change: "+۱۸٪",
          },
          {
            label: "ملک‌های فروش",
            value: statsData.saleProperties?.toLocaleString("fa-IR") || "۰",
            icon: <Home />,
            color: "bg-green-500",
            change: "+۸٪",
          },
          {
            label: "درآمد ماه",
            value: statsData.monthlyIncome?.toLocaleString("fa-IR") + " تومان" || "۰ تومان",
            icon: <TrendingUp />,
            color: "bg-amber-500",
            change: statsData.incomeChange || "+۰٪",
          },
        ]);

        // 2. دریافت ۳ ملک آخر
        const propertiesRes = await fetch(
          "/api/properties?limit=3&sortField=createdAt&sortOrder=desc&fields=ownerName,images,area,rooms,price,address"
        );
        const propertiesData = await propertiesRes.json();
        // اطمینان از آرایه بودن
        setRecentProperties(Array.isArray(propertiesData) ? propertiesData : []);

        // 3. دریافت ۳ خریدار آخر
        const customersRes = await fetch(
          "/api/customers?limit=3&sortField=createdAt&sortOrder=desc&fields=name,customerNumber,desiredPropertyType,createdAt"
        );
        const customersData = await customersRes.json();
        setRecentCustomers(Array.isArray(customersData) ? customersData : []);

        // 4. دریافت قرار ملاقات‌های پیش‌رو
        const appointmentsRes = await fetch(
          "/api/appointments?limit=3&status=scheduled&sortField=date&sortOrder=asc"
        );
        const appointmentsData = await appointmentsRes.json();
        setUpcomingAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (error) {
        // suppressed dashboard logging for performance; show empty states
        setRecentProperties([]);
        setRecentCustomers([]);
        setUpcomingAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* هدر */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>پنل مدیریت املاک</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString("fa-IR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/api/properties/export" className={styles.btnExport}>
            <Download size={20} /> خروجی اکسل
          </Link>
          <Link href="/properties/new" className={styles.btnPrimary}>
            <Plus size={20} /> ثبت ملک جدید
          </Link>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statContent}>
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <div className={styles.statChange}>
                  <span>{stat.change}</span>
                  <TrendingUp size={14} />
                </div>
              </div>
              <div className={`${stat.color} ${styles.statIcon}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* گرید اصلی – دو ستونه */}
      <div className={styles.mainGrid}>
        {/* املاک اخیر */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>املاک اخیر</h2>
            <Link href="/properties" className={styles.viewAllLink}>
              مشاهده همه <Eye size={16} />
            </Link>
          </div>
          <div className={styles.propertyList}>
              {recentProperties.length === 0 ? (
              <p className={styles.emptyMessage}>هیچ ملکی یافت نشد</p>
            ) : (
              recentProperties.map((property) => (
                <div key={property._id} className={styles.propertyItem}>
                  <div className={styles.propertyImage}>
                    <img
                      src={property.images?.[0] || "/images/placeholder.jpg"}
                      alt={property.ownerName || "ملک"}
                    />
                  </div>
                  <div className={styles.propertyInfo}>
                    <h4 className={styles.propertyTitle}>{property.ownerName || "بدون نام مالک"}</h4>
                    <div className={styles.propertyMeta}>
                      <span>
                        <Square size={14} /> {property.area} متر
                      </span>
                      {property.rooms && (
                        <span>
                          <Bed size={14} /> {property.rooms} خواب
                        </span>
                      )}
                    </div>
                    <div className={styles.propertyAddress}>
                      <MapPin size={14} /> {property.address || "آدرس ثبت نشده"}
                    </div>
                    <div className={styles.propertyPrice}>
                      {property.price?.toLocaleString("fa-IR")} تومان
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* خریداران اخیر */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>خریداران اخیر</h2>
            <Link href="/customers" className={styles.viewAllLink}>
              مشاهده همه <Eye size={16} />
            </Link>
          </div>
          <div className={styles.customerList}>
            {recentCustomers.length === 0 ? (
              <p className={styles.emptyMessage}>هیچ خریداری یافت نشد</p>
            ) : (
              recentCustomers.map((customer) => (
                <div key={customer._id} className={styles.customerItem}>
                  <div className={styles.customerAvatar}>
                    {customer.name?.charAt(0) || "?"}
                  </div>
                  <div className={styles.customerInfo}>
                    <h4 className={styles.customerName}>{customer.name}</h4>
                    <div className={styles.customerRequest}>
                      {customer.desiredPropertyType
                        ? `متقاضی ${customer.desiredPropertyType}`
                        : "بدون درخواست"}
                    </div>
                    <div className={styles.customerMeta}>
                      <span className={styles.customerPhone}>
                        {customer.ownerPhone || "۰۹۱۲۳۴۵۶۷۸۹"}
                      </span>
                      <span className={styles.customerDate}>
                        {new Date(customer.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* قرار ملاقات‌های پیش‌رو */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <Calendar size={20} /> قرار ملاقات‌های پیش‌رو
          </h2>
          <Link href="/calendar" className={styles.viewAllLink}>
            مشاهده همه <Eye size={16} />
          </Link>
        </div>
        <div className={styles.appointmentList}>
          {upcomingAppointments.length === 0 ? (
            <p className={styles.emptyMessage}>هیچ قرار ملاقاتی یافت نشد</p>
          ) : (
            upcomingAppointments.map((apt) => (
              <div key={apt._id} className={styles.appointmentItem}>
                <div className={styles.appointmentInfo}>
                  <h4 className={styles.appointmentTitle}>{apt.title}</h4>
                  <div className={styles.appointmentCustomer}>
                    {apt.customer?.name || "مشتری"}
                  </div>
                  <div className={styles.appointmentTime}>
                    {new Date(apt.date).toLocaleDateString("fa-IR")} - {apt.startTime}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}