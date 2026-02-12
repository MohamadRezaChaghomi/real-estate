import { getTransactions, createTransaction } from "@/controllers/transactionController";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get("type"),
      category: searchParams.get("category"),
      propertyId: searchParams.get("propertyId"),
      customerId: searchParams.get("customerId"),
      fromDate: searchParams.get("fromDate"),
      toDate: searchParams.get("toDate"),
      limit: searchParams.get("limit"),
    };
    const sort = {
      field: searchParams.get("sortField"),
      order: searchParams.get("sortOrder"),
    };

    const transactions = await getTransactions(filters, sort);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در دریافت تراکنش‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const transaction = await createTransaction(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در ثبت تراکنش" },
      { status: 500 }
    );
  }
}