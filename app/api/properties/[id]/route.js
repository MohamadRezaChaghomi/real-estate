import { getProperty, updateProperty, deleteProperty } from "@/controllers/propertyController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    // suppressed logging for performance
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات ملک" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const updated = await updateProperty(id, body);
    if (!updated) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    // suppressed logging for performance
    return NextResponse.json(
      { error: "خطا در ویرایش ملک" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteProperty(id, true); // soft delete
    if (!deleted) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    // suppressed logging for performance
    return NextResponse.json(
      { error: "خطا در حذف ملک" },
      { status: 500 }
    );
  }
}