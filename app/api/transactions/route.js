import db from '@/mysql/db';
import { getEmail } from '@/app/lib/getEmail';

export async function GET() {
  try {
    const email = await getEmail();

const [rows] = await db.execute(
  `SELECT O_ID, AMOUNT, TRANSACTION_ID, CREATEDAT
   FROM ONLINE_TRANSACTION
   WHERE EMAIL = ? AND O_ID NOT IN (
     SELECT O_ID FROM EXPENSES WHERE O_ID IS NOT NULL
   )
   ORDER BY CREATEDAT DESC`,
  [email]
);

    rows.forEach((row) => {
      console.log(`Fetched O_ID: ${row.O_ID}, TRANSACTION_ID: ${row.TRANSACTION_ID}`);
    });

    return new Response(JSON.stringify({ transactions: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Transaction fetch error:', err);
    return new Response(JSON.stringify({ transactions: [] }), {
      status: 500,
    });
  }
}
