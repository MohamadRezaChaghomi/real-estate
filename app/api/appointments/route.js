import { getAppointments, createAppointment } from "@/controllers/appointmentController";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get("status"),
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

    const appointments = await getAppointments(filters, sort);
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("خطا در دریافت قرار ملاقات‌ها:", error);
    return NextResponse.json(
      { error: "خطا در دریافت قرار ملاقات‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const appointment = await createAppointment(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("خطا در ثبت قرار ملاقات:", error);
    return NextResponse.json(
      { error: "خطا در ثبت قرار ملاقات" },
      { status: 500 }
    );
  }
}