import { getProperties, createProperty } from "@/controllers/propertyController";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      propertyType: searchParams.get("propertyType"),
      saleType: searchParams.get("saleType"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minArea: searchParams.get("minArea"),
      maxArea: searchParams.get("maxArea"),
      rooms: searchParams.get("rooms"),
      address: searchParams.get("address"),
      direction: searchParams.get("direction"),
      deedType: searchParams.get("deedType"),
      exchange: searchParams.get("exchange"),
      limit: searchParams.get("limit"),
    };
    const sort = {
      field: searchParams.get("sortField"),
      order: searchParams.get("sortOrder"),
    };

    const properties = await getProperties(filters, sort);
    return NextResponse.json(properties);
  } catch (error) {
    console.error("خطا در دریافت املاک:", error);
    return NextResponse.json(
      { error: "خطا در دریافت املاک" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const property = await createProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("خطا در ثبت ملک:", error);
    return NextResponse.json(
      { error: "خطا در ثبت ملک" },
      { status: 500 }
    );
  }
}