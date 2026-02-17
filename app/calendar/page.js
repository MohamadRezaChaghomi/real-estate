"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import styles from "@/styles/CalendarPage.module.css";
import toast from "react-hot-toast";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month");
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    customerId: "",
    propertyId: "",
    notes: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchAppointments();
    fetchCustomers();
    fetchProperties();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers?limit=100");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties?limit=100");
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date).toDateString();
      return eventDate === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
      toast.error("لطفاً عنوان و تاریخ را وارد کنید");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("ملاقات با موفقیت اضافه شد");
        setShowAddModal(false);
        setFormData({
          title: "",
          date: new Date().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "11:00",
          customerId: "",
          propertyId: "",
          notes: "",
          status: "scheduled",
        });
        fetchAppointments();
      } else {
        toast.error("خطا در اضافه کردن ملاقات");
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("خطا در اتصال به سرور");
    }
  };

  const calendarDays = renderCalendarDays();
  const dateEventsMap = new Map();

  events.forEach((event) => {
    const dateKey = new Date(event.date).toDateString();
    if (!dateEventsMap.has(dateKey)) {
      dateEventsMap.set(dateKey, []);
    }
    dateEventsMap.get(dateKey).push(event);
  });

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const monthName = currentDate.toLocaleDateString("fa-IR", { month: "long", year: "numeric" });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>تقویم ملاقات‌ها</h1>
          <p className={styles.subtitle}>برنامه‌ریزی و مدیریت ملاقات‌های ملکی</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "var(--accent-gold)",
            color: "#1a1a1a",
            border: "none",
            borderRadius: "50px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={20} /> اضافه کردن ملاقات
        </button>
      </div>

      <div className={styles.mainContent}>
        {/* Calendar */}
        <div className={styles.calendarSection}>
          {/* Month / Year Header */}
          <div className={styles.monthHeader}>
            <button onClick={handlePrevMonth} className={styles.navButton}>
              <ChevronRight size={20} />
            </button>
            <h2 className={styles.monthTitle}>{monthName}</h2>
            <button onClick={handleNextMonth} className={styles.navButton}>
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div className={styles.weekdaysRow}>
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day) => (
              <div key={day} className={styles.weekdayCell}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className={styles.daysGrid}>
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className={styles.emptyCell}></div>;
              }

              const dateStr = date.toDateString();
              const dayEvents = dateEventsMap.get(dateStr) || [];
              const isSelected = selectedDate?.toDateString() === dateStr;
              const isToday = new Date().toDateString() === dateStr;

              return (
                <div
                  key={date.toISOString()}
                  className={`${styles.dateCell} ${isSelected ? styles.selected : ""} ${isToday ? styles.today : ""}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={styles.dateNumber}>{date.getDate()}</div>
                  {dayEvents.length > 0 && (
                    <div className={styles.eventDots}>
                      {dayEvents.slice(0, 2).map((_, i) => (
                        <div key={i} className={styles.dot}></div>
                      ))}
                      {dayEvents.length > 2 && <span className={styles.moreCount}>+{dayEvents.length - 2}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Details */}
        <div className={styles.eventsSection}>
          <div className={styles.eventsCard}>
            <h3 className={styles.eventsTitle}>
              {selectedDate
                ? selectedDate.toLocaleDateString("fa-IR")
                : "انتخاب یک تاریخ برای مشاهده ملاقات‌ها"}
            </h3>

            {selectedDate && selectedDateEvents.length === 0 ? (
              <div className={styles.noEvents}>
                <Calendar size={32} />
                <p>هیچ ملاقاتی برای این تاریخ ثبت نشده</p>
              </div>
            ) : (
              <div className={styles.eventsList}>
                {selectedDateEvents.map((event) => (
                  <div key={event._id} className={styles.eventItem}>
                    <div className={styles.eventIndicator}></div>
                    <div className={styles.eventDetails}>
                      <h4 className={styles.eventName}>{event.title}</h4>
                      <div className={styles.eventMeta}>
                        <span className={styles.metaItem}>
                          <Clock size={14} /> {event.startTime} - {event.endTime}
                        </span>
                        {event.customerId && (
                          <span className={styles.metaItem}>
                            <User size={14} /> {event.customerId.name}
                          </span>
                        )}
                        {event.propertyId && (
                          <span className={styles.metaItem}>
                            <MapPin size={14} /> {event.propertyId.title}
                          </span>
                        )}
                      </div>
                      {event.notes && <p className={styles.eventNotes}>{event.notes}</p>}
                    </div>
                    <div className={`${styles.eventStatus} ${styles[event.status || "scheduled"]}`}>
                      {event.status === "completed" ? "انجام شد" : "برنامه‌ریزی شده"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className={styles.upcomingSection}>
            <h3 className={styles.upcomingTitle}>نزدیک‌ترین ملاقات‌ها</h3>
            <div className={styles.upcomingList}>
              {events
                .filter((e) => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event) => (
                  <div key={event._id} className={styles.upcomingItem}>
                    <div className={styles.upcomingDate}>
                      {new Date(event.date).toLocaleDateString("fa-IR", { month: "short", day: "numeric" })}
                    </div>
                    <div className={styles.upcomingInfo}>
                      <p className={styles.upcomingTitle}>{event.title}</p>
                      <span className={styles.upcomingTime}>{event.startTime}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ color: "var(--text-primary)" }}>اضافه کردن ملاقات جدید</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  عنوان ملاقات *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: ملاقات با خریدار"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  تاریخ *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                    ساعت شروع
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                    ساعت پایان
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  خریدار
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">انتخاب نکنید</option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  ملک
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">انتخاب نکنید</option>
                  {properties.map((prop) => (
                    <option key={prop._id} value={prop._id}>
                      {prop.ownerName} - {prop.address}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  یادداشت‌ها
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="توضیحات اضافی..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    minHeight: "80px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--accent-gold)",
                    color: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ثبت ملاقات
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
