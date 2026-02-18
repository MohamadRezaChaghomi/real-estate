import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // ... (فیلدها مانند قبل) ...
    propertyType: { type: String, enum: ["apartment", "villa", "commercial", "garden"], required: true },
    saleType: { type: String, enum: ["rent", "sale"], required: true },
    title: { type: String },
    area: { type: Number },
    rooms: { type: Number },
    floor: { type: Number },
    unitsCount: { type: Number },
    direction: { type: String, enum: ["north", "south", "east", "west"] },
    deedType: { type: String, enum: ["full", "promissory"] },
    price: { type: Number },
    pricePerSqm: { type: Number },
    rentPrice: { type: Number },
    deposit: { type: Number },
    water: { type: Boolean, default: false },
    electricity: { type: Boolean, default: false },
    gas: { type: Boolean, default: false },
    telephone: { type: Boolean, default: false },
    cabinet: { type: Boolean, default: false },
    hood: { type: Boolean, default: false },
    heating: { type: Boolean, default: false },
    cooling: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    flooringType: { type: String, enum: ["parquet", "ceramic", "stone", "other"] },
    wallType: { type: String, enum: ["paint", "wallpaper", "other"] },
    wardrobe: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    intercom: { type: String, enum: ["none", "audio", "video"], default: "none" },
    centralAntenna: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    storage: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    cabinetMaterial: { type: String, enum: ["mdf", "highGloss", "acrylic", "wood", "laminate", "other"], default: "" },
    exchange: { type: Boolean, default: false },
    address: { type: String },
    description: { type: String },
    images: [{ type: String }],
    ownerName: { type: String },
    ownerPhone: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// ✅ ایندکس‌های ضروری
propertySchema.index({ deletedAt: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ propertyType: 1, saleType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({ address: "text" });

export default mongoose.models.Property || mongoose.model("Property", propertySchema);