import { getProperty, updateProperty, deleteProperty } from "@/controllers/propertyController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const property = await getProperty(params.id);
    if (!property) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error("خطا در دریافت ملک:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات ملک" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await updateProperty(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("خطا در ویرایش ملک:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش ملک" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const deleted = await deleteProperty(params.id, true); // soft delete
    if (!deleted) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطا در حذف ملک:", error);
    return NextResponse.json(
      { error: "خطا در حذف ملک" },
      { status: 500 }
    );
  }
}