import { getCustomer, updateCustomer, deleteCustomer } from "@/controllers/customerController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const customer = await getCustomer(params.id);
    if (!customer) {
      return NextResponse.json({ error: "خریدار یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    console.error("خطا در دریافت خریدار:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات خریدار" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await updateCustomer(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "خریدار یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("خطا در ویرایش خریدار:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش خریدار" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const deleted = await deleteCustomer(params.id, true); // soft delete
    if (!deleted) {
      return NextResponse.json({ error: "خریدار یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطا در حذف خریدار:", error);
    return NextResponse.json(
      { error: "خطا در حذف خریدار" },
      { status: 500 }
    );
  }
}