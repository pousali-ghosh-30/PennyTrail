// /app/api/budget/current/route.js
import db from '@/mysql/db';
import { getEmail } from '@/app/lib/getEmail';

export async function GET() {
  try {
    const email = await getEmail();

    const [rows] = await db.execute(
      `SELECT ID, BNAME
       FROM BUDGETS
       WHERE CREATEDBY = ?
       AND MONTH(CREATEDAT) = MONTH(CURRENT_DATE())
       AND YEAR(CREATEDAT) = YEAR(CURRENT_DATE())`,
      [email]
    );

    return new Response(JSON.stringify({ budgets: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching budget:', err);
    return new Response(JSON.stringify({ budgets: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
