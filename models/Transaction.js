import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    category: {
      type: String,
      enum: ["commission", "rent", "sale", "maintenance", "other"],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "check", "bank"],
    },
    reference: { type: String }, // شماره چک، پیگیری
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// ایندکس‌ها
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ propertyId: 1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);