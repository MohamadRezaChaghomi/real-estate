"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-jalaali";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "@/styles/CalendarPage.module.css";

moment.loadPersian({ dialect: "persian-modern" });
const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((apt) => ({
          id: apt._id,
          title: apt.title,
          start: new Date(`${apt.date.split("T")[0]}T${apt.startTime}`),
          end: new Date(`${apt.date.split("T")[0]}T${apt.endTime}`),
          resource: apt,
        }));
        setEvents(formatted);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>تقویم ملاقات‌ها</h1>
      <div className={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="fa"
          messages={{
            next: "بعدی",
            previous: "قبلی",
            today: "امروز",
            month: "ماه",
            week: "هفته",
            day: "روز",
            agenda: "لیست",
          }}
        />
      </div>
    </div>
  );
}