import { getCustomers, createCustomer } from "@/controllers/customerController";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      desiredPropertyType: searchParams.get("desiredPropertyType"),
      desiredSaleType: searchParams.get("desiredSaleType"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      limit: searchParams.get("limit"),
    };
    const sort = {
      field: searchParams.get("sortField"),
      order: searchParams.get("sortOrder"),
    };

    const customers = await getCustomers(filters, sort);
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در دریافت خریداران" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const customer = await createCustomer(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در ثبت خریدار" },
      { status: 500 }
    );
  }
}