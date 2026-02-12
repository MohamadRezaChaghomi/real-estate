import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    collection: {
      type: String,
      enum: ["Property", "Customer"],
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      description: "Changes made to the document (before/after)",
    },
    performedBy: {
      type: String,
      default: "system",
      description: "User ID or identifier who performed the action",
    },
  },
  {
    timestamps: true, // خودکار createdAt و updatedAt را اضافه می‌کند
  }
);

// ایندکس برای جستجوی سریع‌تر
logSchema.index({ collection: 1, documentId: 1 });
logSchema.index({ createdAt: -1 });

export default mongoose.models.Log || mongoose.model("Log", logSchema);
