import { format } from "date-fns";
import { getEmail } from "@/app/lib/getEmail";
import db from "@/mysql/db";

export async function GET(req) {
  const email = await getEmail();
  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [expenses] = await db.execute(
      `SELECT 
         B.ICON AS icon, 
         E.E_ID AS id, 
         E.ENAME AS name, 
         E.AMOUNT AS amount, 
         E.CREATEDAT AS createdAt
       FROM EXPENSES E
       JOIN BUDGETS B ON B.ID = E.B_ID
       WHERE B.CREATEDBY = ?
       ORDER BY E.CREATEDAT DESC;`,
      [email]
    );

    const groupedExpenses = {};

    for (const expense of expenses) {
      const amount = Number(expense.amount) || 0;

      let monthYear;
      let createdAt;

      try {
        createdAt = new Date(expense.createdAt);
        if (isNaN(createdAt.getTime())) throw new Error("Invalid date");
        monthYear = format(createdAt, "MMMM, yyyy");
      } catch {
        monthYear = "Unknown";
        createdAt = null;
      }

      if (!groupedExpenses[monthYear]) {
        groupedExpenses[monthYear] = { total: 0, items: [] };
      }

      groupedExpenses[monthYear].items.push({
        ...expense,
        amount,
        createdAt,
      });

      groupedExpenses[monthYear].total += amount;
    }

    return new Response(JSON.stringify({ success: true, groupedExpenses }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}