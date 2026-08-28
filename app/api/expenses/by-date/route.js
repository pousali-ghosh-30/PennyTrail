import { NextResponse } from "next/server";
import db from "@/mysql/db";
import { getEmail } from '@/app/lib/getEmail';
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const email = await getEmail();
    if (!email) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }
    const [result] = await db.execute(
      `
      SELECT ENAME as name, AMOUNT as amount
      FROM EXPENSES
      WHERE DATE(CREATEDAT) = ? AND B_ID IN (SELECT ID FROM BUDGETS WHERE CREATEDBY=?);
      `,
      [date,email]
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Date expenses error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}