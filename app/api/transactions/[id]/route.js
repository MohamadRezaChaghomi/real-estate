import {
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/controllers/transactionController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const transaction = await getTransaction(id);
    if (!transaction) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("خطا در دریافت تراکنش:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات تراکنش" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const updated = await updateTransaction(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("خطا در ویرایش تراکنش:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش تراکنش" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteTransaction(id, true); // soft delete
    if (!deleted) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطا در حذف تراکنش:", error);
    return NextResponse.json(
      { error: "خطا در حذف تراکنش" },
      { status: 500 }
    );
  }
}