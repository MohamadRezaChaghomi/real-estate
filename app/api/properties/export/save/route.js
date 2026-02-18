import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  try {
    await connectDB();
    const properties = await Property.find({ deletedAt: null }).lean();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Properties");

    ws.columns = [
      { header: "_id", key: "_id", width: 24 },
      { header: "نوع ملک", key: "propertyType", width: 16 },
      { header: "نوع فروش", key: "saleType", width: 12 },
      { header: "قیمت", key: "price", width: 16 },
      { header: "قیمت هر متر", key: "pricePerSqm", width: 14 },
      { header: "ودیعه", key: "deposit", width: 14 },
      { header: "اجاره", key: "rentPrice", width: 14 },
      { header: "متراژ", key: "area", width: 10 },
      { header: "خواب", key: "rooms", width: 8 },
      { header: "طبقه", key: "floor", width: 8 },
      { header: "تعداد واحد", key: "unitsCount", width: 10 },
      { header: "جهت", key: "direction", width: 10 },
      { header: "نوع سند", key: "deedType", width: 12 },
      { header: "بالکن", key: "balcony", width: 8 },
      { header: "کمد دیواری", key: "wardrobe", width: 10 },
      { header: "شومینه", key: "fireplace", width: 10 },
      { header: "آسانسور", key: "elevator", width: 8 },
      { header: "انباری", key: "storage", width: 8 },
      { header: "پارکینگ", key: "parking", width: 8 },
      { header: "آدرس", key: "address", width: 40 },
      { header: "توضیحات", key: "description", width: 60 },
      { header: "تصاویر (آدرس‌ها)", key: "images", width: 60 },
      { header: "مالک", key: "ownerName", width: 20 },
      { header: "تلفن مالک", key: "ownerPhone", width: 16 },
      { header: "عرض جغرافیایی", key: "latitude", width: 12 },
      { header: "طول جغرافیایی", key: "longitude", width: 12 },
      { header: "تاریخ ثبت", key: "createdAt", width: 18 },
      { header: "آخرین ویرایش", key: "updatedAt", width: 18 },
    ];

    const yesNo = (v) => (v ? "بله" : "خیر");
    const fmtDate = (d) => (d ? new Date(d).toLocaleString("fa-IR") : "");

    properties.forEach((item) => {
      ws.addRow({
        _id: item._id?.toString(),
        propertyType: item.propertyType || "",
        saleType: item.saleType || "",
        price: item.price ?? "",
        pricePerSqm: item.pricePerSqm ?? "",
        deposit: item.deposit ?? "",
        rentPrice: item.rentPrice ?? "",
        area: item.area ?? "",
        rooms: item.rooms ?? "",
        floor: item.floor ?? "",
        unitsCount: item.unitsCount ?? "",
        direction: item.direction || "",
        deedType: item.deedType || "",
        balcony: yesNo(item.balcony),
        wardrobe: yesNo(item.wardrobe),
        fireplace: yesNo(item.fireplace),
        elevator: yesNo(item.elevator),
        storage: yesNo(item.storage),
        parking: yesNo(item.parking),
        address: item.address || "",
        description: item.description || "",
        images: Array.isArray(item.images) ? item.images.join(", ") : "",
        ownerName: item.ownerName || "",
        ownerPhone: item.ownerPhone || "",
        latitude: item.latitude ?? "",
        longitude: item.longitude ?? "",
        createdAt: fmtDate(item.createdAt),
        updatedAt: fmtDate(item.updatedAt),
      });
    });

    ws.getRow(1).font = { bold: true };

    const buffer = await wb.xlsx.writeBuffer();

    const dir = path.join(process.cwd(), "public", "exports");
    await fs.mkdir(dir, { recursive: true });
    const filepath = path.join(dir, "properties.xlsx");
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ ok: true, path: "/exports/properties.xlsx" });
  } catch (error) {
    return NextResponse.json({ error: "save error" }, { status: 500 });
  }
}
