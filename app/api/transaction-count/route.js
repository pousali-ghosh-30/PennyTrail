// /app/api/transaction-count/route.js
import db from '@/mysql/db';
import { getEmail } from '@/app/lib/getEmail';

export async function GET() {
  try {
    const email = await getEmail();
    //console.log('Email from getEmail():', email);
    if (!email) {
      return new Response(JSON.stringify({ count: 0 }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [rows] = await db.execute(
      'SELECT COUNT(O_ID) AS count FROM ONLINE_TRANSACTION WHERE email = ? AND O_ID NOT IN(SELECT O_ID FROM EXPENSES WHERE O_ID IS NOT NULL);',
      [email]
    );
    //console.log(rows[0].count);
    return new Response(JSON.stringify({ count: rows[0].count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
