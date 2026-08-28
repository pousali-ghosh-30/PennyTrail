
import { getEmail } from "@/app/lib/getEmail";
import { NextResponse } from "next/server";
import db from "@/mysql/db";

const MONTHS = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const year = parseInt(searchParams.get("year")) || new Date().getFullYear();
    const monthParam = searchParams.get("month");
    const email = await getEmail();
    if (!email) {
          return new Response('Unauthorized', { status: 401 });
        }
    if (type === "monthly-comparison") {
      if (!monthParam || monthParam === "All") {
        const [result] = await db.execute(`
          WITH months AS (
            SELECT 1 AS month_num, 'Jan' AS month_name UNION ALL
            SELECT 2, 'Feb' UNION ALL
            SELECT 3, 'Mar' UNION ALL
            SELECT 4, 'Apr' UNION ALL
            SELECT 5, 'May' UNION ALL
            SELECT 6, 'Jun' UNION ALL
            SELECT 7, 'Jul' UNION ALL
            SELECT 8, 'Aug' UNION ALL
            SELECT 9, 'Sep' UNION ALL
            SELECT 10, 'Oct' UNION ALL
            SELECT 11, 'Nov' UNION ALL
            SELECT 12, 'Dec'
          ),
          combined AS (
            SELECT CREATEDAT, amount, 'budget' AS source FROM BUDGETS
            WHERE YEAR(CREATEDAT) = ? AND CREATEDBY = ?
            UNION ALL
            SELECT E.CREATEDAT, E.amount, 'expense' AS source
            FROM EXPENSES E
            JOIN BUDGETS B ON E.B_ID = B.ID
            WHERE YEAR(E.CREATEDAT) = ? AND B.CREATEDBY = ?
          ),
          summarized AS (
            SELECT
              MONTH(CREATEDAT) AS month_num,
              SUM(CASE WHEN source = 'budget' THEN amount ELSE 0 END) AS totalBudget,
              SUM(CASE WHEN source = 'expense' THEN amount ELSE 0 END) AS totalSpent
            FROM combined
            GROUP BY MONTH(CREATEDAT)
          )
          SELECT
            m.month_name AS month,
            COALESCE(s.totalBudget, 0) AS totalBudget,
            COALESCE(s.totalSpent, 0) AS totalSpent
          FROM months m
          LEFT JOIN summarized s ON m.month_num = s.month_num
          ORDER BY m.month_num
        `, [year, email, year,email]);
        return NextResponse.json(result);
      }
      const normalizedMonth = getMonthNumber(monthParam);
      if (!normalizedMonth) {
        return NextResponse.json({ error: "Invalid month parameter" }, { status: 400 });
      }
     }

    if (type === "yearly-budget-summary") {
      const [result] = await db.execute(
        `
        SELECT B.BNAME AS category, SUM(E.AMOUNT) AS amount
        FROM EXPENSES E
        JOIN BUDGETS B ON E.B_ID = B.ID
        WHERE YEAR(E.CREATEDAT) = ? AND B.CREATEDBY = ?
        GROUP BY B.BNAME
        `,
        [year,email]
      );
      return NextResponse.json(result);
    }

    //  Return budgets and expenses per category for selected month
    if (type === "monthly-budget-summary") {
      const normalizedMonth = getMonthNumber(monthParam);
      if (!normalizedMonth) {
        return NextResponse.json({ error: "Invalid month parameter" }, { status: 400 });
      }

      const [result] = await db.execute(
        `
        WITH
        budget_summary AS (
          SELECT B.BNAME AS category, SUM(B.AMOUNT) AS totalBudget
          FROM BUDGETS B
          WHERE YEAR(B.CREATEDAT) = ? AND MONTH(B.CREATEDAT) = ? AND B.CREATEDBY = ?
          GROUP BY B.BNAME
        ),
        expense_summary AS (
         SELECT B.BNAME AS category, SUM(E.AMOUNT) AS totalExpense
          FROM EXPENSES E
          JOIN BUDGETS B ON E.B_ID = B.ID
          WHERE YEAR(E.CREATEDAT) = ? AND MONTH(E.CREATEDAT) = ? AND B.CREATEDBY = ?
          GROUP BY B.BNAME
        ),
        combined_categories AS (
    SELECT category FROM budget_summary
    UNION
    SELECT category FROM expense_summary
  )
  SELECT
    c.category,
    COALESCE(b.totalBudget, 0) AS budget,
    COALESCE(e.totalExpense, 0) AS expense
  FROM combined_categories c
  LEFT JOIN budget_summary b ON c.category = b.category
  LEFT JOIN expense_summary e ON c.category = e.category
        `,
        [year, normalizedMonth, email, year, normalizedMonth, email]
      );

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Invalid or missing type parameter" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Statistics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Helper function to convert month name to number
function getMonthNumber(monthParam) {
  if (!monthParam) return null;
  const m = monthParam.trim().substring(0, 3).toLowerCase();
  for (const [key, val] of Object.entries(MONTHS)) {
    if (key.toLowerCase() === m) return val;
  }
  return null;
}