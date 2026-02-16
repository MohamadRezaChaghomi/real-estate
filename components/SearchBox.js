"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import styles from "@/styles/SearchBox.module.css";

export default function SearchBox({ value = "", onSearch, placeholder = "جستجو..." }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(text);
    }, 450);
    return () => clearTimeout(t);
  }, [text, onSearch]);

  return (
    <div className={styles.searchWrap}>
      <Search size={16} className={styles.icon} />
      <input
        type="text"
        value={text}
        placeholder={placeholder}
        className={styles.input}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}