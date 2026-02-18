import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  try {
    await connectDB();
    const customers = await Customer.find({ deletedAt: null }).lean();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Customers");

    ws.columns = [
      { header: "_id", key: "_id", width: 24 },
      { header: "شماره مشتری", key: "customerNumber", width: 20 },
      { header: "نام", key: "name", width: 32 },
      { header: "نوع ملک مورد نظر", key: "desiredPropertyType", width: 16 },
      { header: "نوع فروش مورد نظر", key: "desiredSaleType", width: 12 },
      { header: "قیمت مدنظر", key: "desiredPrice", width: 14 },
      { header: "متراژ مدنظر", key: "desiredArea", width: 12 },
      { header: "سال ساخت مدنظر", key: "desiredBuildYear", width: 12 },
      { header: "توضیحات", key: "description", width: 60 },
      { header: "ایجاد شده در", key: "createdAt", width: 18 },
      { header: "بروزرسانی", key: "updatedAt", width: 18 },
    ];

    const fmtDate = (d) => (d ? new Date(d).toLocaleString("fa-IR") : "");

    customers.forEach((c) => {
      ws.addRow({
        _id: c._id?.toString(),
        customerNumber: c.customerNumber || "",
        name: c.name || "",
        desiredPropertyType: c.desiredPropertyType || "",
        desiredSaleType: c.desiredSaleType || "",
        desiredPrice: c.desiredPrice ?? "",
        desiredArea: c.desiredArea ?? "",
        desiredBuildYear: c.desiredBuildYear ?? "",
        description: c.description || "",
        createdAt: fmtDate(c.createdAt),
        updatedAt: fmtDate(c.updatedAt),
      });
    });

    ws.getRow(1).font = { bold: true };

    const buffer = await wb.xlsx.writeBuffer();

    const dir = path.join(process.cwd(), "public", "exports");
    await fs.mkdir(dir, { recursive: true });
    const filepath = path.join(dir, "customers.xlsx");
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ ok: true, path: "/exports/customers.xlsx" });
  } catch (error) {
    return NextResponse.json({ error: "save error" }, { status: 500 });
  }
}
