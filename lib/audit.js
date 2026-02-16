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
    // suppressed logging for audit to reduce noise; return null on failure
    return null;
  }
}