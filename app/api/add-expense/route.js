import db from '@/mysql/db';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(' Incoming request:', body);

const { budgetId, transactionId, expenseName, oId } = body;

    if (!budgetId || !transactionId || !expenseName || oId === undefined || oId === null) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Fetch amount from online_transaction table by TRANSACTION_ID
    const [rows] = await db.execute(
      `SELECT AMOUNT FROM online_transaction WHERE TRANSACTION_ID = ?`,
      [transactionId]
    );

    if (!rows || rows.length === 0) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Transaction not found' }),
        { status: 404 }
      );
    }

    const amount = rows[0].AMOUNT;

    // Optional: Validate that the budget ID exists
    const [budgetCheck] = await db.execute(
      `SELECT ID FROM BUDGETS WHERE ID = ?`,
      [budgetId]
    );

    if (budgetCheck.length === 0) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid budget ID' }),
        { status: 400 }
      );
    }

    // Insert into expenses table
    await db.execute(
      `INSERT INTO EXPENSES (ENAME, AMOUNT, B_ID, CREATEDAT, O_ID)
       VALUES (?, ?, ?, NOW(), ?)`,
      [expenseName, amount, budgetId, oId]
    );

    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });

  } catch (err) {
    console.error('Expense insert error:', err.message, err.stack);
    return new Response(
      JSON.stringify({ status: 'error', message: err.message || 'Server error' }),
      { status: 500 }
    );
  }
}
