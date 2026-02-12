import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerNumber: { type: String, unique: true },
    name: { type: String, required: true },
    desiredPropertyType: { type: String, enum: ["apartment", "villa", "commercial", "garden", "any"] },
    desiredSaleType: { type: String, enum: ["rent", "sale", "both"] },
    desiredPrice: { type: Number },
    desiredArea: { type: Number },
    desiredBuildYear: { type: Number },
    description: { type: String },
    registeredAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// ✅ ایندکس‌ها
customerSchema.index({ deletedAt: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ customerNumber: 1 });
customerSchema.index({ desiredPropertyType: 1, desiredSaleType: 1 });

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);