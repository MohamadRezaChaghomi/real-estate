import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find({ deletedAt: null });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Properties");

    ws.columns = [
      { header: "عنوان", key: "title" },
      { header: "نوع ملک", key: "propertyType" },
      { header: "نوع فروش", key: "saleType" },
      { header: "قیمت", key: "price" },
      { header: "متراژ", key: "area" },
      { header: "خواب", key: "rooms" },
      { header: "آدرس", key: "address" },
      { header: "مالک", key: "ownerName" },
      { header: "تلفن", key: "ownerPhone" },
    ];

    properties.forEach((item) => {
      ws.addRow({
        title: item.title,
        propertyType: item.propertyType,
        saleType: item.saleType,
        price: item.price,
        area: item.area,
        rooms: item.rooms,
        address: item.address,
        ownerName: item.ownerName,
        ownerPhone: item.ownerPhone,
      });
    });

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