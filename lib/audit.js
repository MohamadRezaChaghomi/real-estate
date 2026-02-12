import Log from "@/models/Log";
import { connectDB } from "./mongodb";

export async function createAuditLog({
  action,
  collection,
  documentId,
  changes,
  performedBy = "system",
}) {
  try {
    await connectDB();
    return await Log.create({
      action,
      collection,
      documentId,
      changes,
      performedBy,
    });
  } catch (error) {
    console.error("خطا در ثبت لاگ:", error);
    // عدم پرتاب خطا برای جلوگیری از اختلال در عملیات اصلی
    return null;
  }
}