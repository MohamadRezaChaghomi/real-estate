import {
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/controllers/appointmentController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const appointment = await getAppointment(params.id);
    if (!appointment) {
      return NextResponse.json(
        { error: "قرار ملاقات یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در دریافت قرار ملاقات" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await updateAppointment(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "قرار ملاقات یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در ویرایش قرار ملاقات" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const deleted = await deleteAppointment(params.id, true);
    if (!deleted) {
      return NextResponse.json(
        { error: "قرار ملاقات یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در حذف قرار ملاقات" },
      { status: 500 }
    );
  }
}