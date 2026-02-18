"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/ImageSlider.module.css";

export default function ImageSlider({ images = [], alt = "تصویر ملک" }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className={styles.slider}>
      <div className={styles.view}>
        <button className={styles.nav} onClick={prev} aria-label="قبلی">
          <ChevronLeft size={20} />
        </button>
        <img src={images[index]} alt={`${alt} ${index + 1}`} className={styles.image} />
        <button className={styles.nav} onClick={next} aria-label="بعدی">
          <ChevronRight size={20} />
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
    </div>
  );
}
