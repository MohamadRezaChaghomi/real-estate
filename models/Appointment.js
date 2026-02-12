import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // فرمت HH:mm
    endTime: { type: String, required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    ownerName: { type: String },
    ownerPhone: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    createdBy: { type: String, default: "system" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// ✅ ایندکس‌ها برای افزایش سرعت جستجو
appointmentSchema.index({ date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ propertyId: 1 });
appointmentSchema.index({ customerId: 1 });

// ✅ export default – بسیار مهم
export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);