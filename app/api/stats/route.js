import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import Customer from "@/models/Customer";
import { getMonthlyIncome } from "@/controllers/transactionController";

export async function GET() {
  try {
    await connectDB();

    const totalProperties = await Property.countDocuments({ deletedAt: null });
    const saleProperties = await Property.countDocuments({
      saleType: "sale",
      deletedAt: null,
    });
    const activeCustomers = await Customer.countDocuments({ deletedAt: null });
    const monthlyIncome = await getMonthlyIncome();

    return NextResponse.json({
      totalProperties,
      saleProperties,
      activeCustomers,
      monthlyIncome,
      incomeChange: "+۱۵٪", // می‌توانید از مقایسه با ماه قبل محاسبه کنید
    });
  } catch (error) {
    console.error("خطا در دریافت آمار:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}