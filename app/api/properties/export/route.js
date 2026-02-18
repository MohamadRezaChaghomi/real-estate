import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find({ deletedAt: null }).lean();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Properties");

    // define columns with headers and keys
    ws.columns = [
      { header: "_id", key: "_id", width: 24 },
      { header: "عنوان", key: "title", width: 32 },
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
      { header: "متریال کف", key: "flooringType", width: 14 },
      { header: "متریال دیوار", key: "wallType", width: 14 },
      { header: "آیفون", key: "intercom", width: 12 },
      { header: "متریال کابینت", key: "cabinetMaterial", width: 14 },
      { header: "بالکن", key: "balcony", width: 8 },
      { header: "کمد دیواری", key: "wardrobe", width: 10 },
      { header: "شومینه", key: "fireplace", width: 10 },
      { header: "آنتن مرکزی", key: "centralAntenna", width: 12 },
      { header: "آسانسور", key: "elevator", width: 8 },
      { header: "انباری", key: "storage", width: 8 },
      { header: "پارکینگ", key: "parking", width: 8 },
      { header: "معاوضه", key: "exchange", width: 8 },
      { header: "آدرس", key: "address", width: 40 },
      { header: "توضیحات", key: "description", width: 60 },
      { header: "تصاویر (فقط آدرس‌ها)", key: "images", width: 60 },
      { header: "مالک", key: "ownerName", width: 20 },
      { header: "تلفن مالک", key: "ownerPhone", width: 16 },
      { header: "عرض جغرافیایی", key: "latitude", width: 12 },
      { header: "طول جغرافیایی", key: "longitude", width: 12 },
      { header: "تاریخ ثبت", key: "createdAt", width: 18 },
      { header: "آخرین ویرایش", key: "updatedAt", width: 18 },
      { header: "حذف شده؟", key: "deletedAt", width: 18 },
    ];

    const yesNo = (v) => (v ? "بله" : "خیر");
    const fmtDate = (d) => (d ? new Date(d).toLocaleString("fa-IR") : "");

    properties.forEach((item) => {
      ws.addRow({
        _id: item._id?.toString(),
        title: item.title || "",
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
        flooringType: item.flooringType || "",
        wallType: item.wallType || "",
        intercom: item.intercom || "",
        cabinetMaterial: item.cabinetMaterial || "",
        balcony: yesNo(item.balcony),
        wardrobe: yesNo(item.wardrobe),
        fireplace: yesNo(item.fireplace),
        centralAntenna: yesNo(item.centralAntenna),
        elevator: yesNo(item.elevator),
        storage: yesNo(item.storage),
        parking: yesNo(item.parking),
        exchange: yesNo(item.exchange),
        address: item.address || "",
        description: item.description || "",
        images: Array.isArray(item.images) ? item.images.join(", ") : "",
        ownerName: item.ownerName || "",
        ownerPhone: item.ownerPhone || "",
        latitude: item.latitude ?? "",
        longitude: item.longitude ?? "",
        createdAt: fmtDate(item.createdAt),
        updatedAt: fmtDate(item.updatedAt),
        deletedAt: fmtDate(item.deletedAt),
      });
    });

    // style header row
    ws.getRow(1).font = { bold: true };

    const buffer = await wb.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=properties.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در خروجی اکسل" },
      { status: 500 }
    );
  }
}