"use client";

import React from "react";
import styles from "@/styles/ConfirmModal.module.css";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ open, title = "تأیید", description = "آیا مطمئن هستید؟", onCancel, onConfirm, confirmLabel = "حذف", cancelLabel = "انصراف", isDanger = true }) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header} />
        <div className={isDanger ? styles.iconDanger : styles.iconInfo}>
          {isDanger ? <AlertTriangle size={24} /> : null}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.footer}>
          <button onClick={onCancel} className={styles.cancelButton}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={isDanger ? styles.confirmDangerButton : styles.confirmButton}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
