"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import styles from "@/styles/ImageSlider.module.css";

export default function ImageSlider({ images = [], alt = "تصویر ملک" }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.slider}>
      <div className={styles.view}>
        <button className={styles.nav} onClick={prev} aria-label="قبلی" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <ChevronLeft size={20} />
        </button>

        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className={styles.image}
          onClick={() => setOpen(true)}
          role="button"
        />

        <button className={styles.nav} onClick={next} aria-label="بعدی" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <ChevronRight size={20} />
        </button>

        <button
          className={styles.fullscreenButton}
          onClick={() => setOpen(true)}
          aria-label="نمایش کامل"
          title="نمایش کامل"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === index ? styles.active : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`نمایش ${i + 1}`}
            >
              <img src={src} alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className={styles.modal} onClick={() => setOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.fullscreenButton}
              onClick={() => setOpen(false)}
              aria-label="بستن"
              title="بستن"
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              <X size={16} />
            </button>
            <img src={images[index]} alt={`${alt} full`} className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
}
