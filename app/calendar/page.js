"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/CalendarPage.module.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month");

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));
  }, []);

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
    </div>
  );
}
