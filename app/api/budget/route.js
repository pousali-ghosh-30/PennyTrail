import { getEmail } from '@/app/lib/getEmail';
import { getAuth } from "@clerk/nextjs/server";
import db from "@/mysql/db"; 
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const email = await getEmail();
    if (!email) {
      return new Response('Unauthorized', { status: 401 });
    }
    const [rows] = await db.execute(

      `SELECT 
  b.ID AS id, 
  b.BNAME AS name,
  b.AMOUNT AS amount,
  b.ICON AS icon,
  b.CREATEDBY AS createdBy,
  b.CREATEDAT AS createdAt,
  DATE_FORMAT(b.CREATEDAT, '%Y-%m') AS monthYear,
  IFNULL(SUM(e.AMOUNT), 0) AS totalSpend,
  COUNT(e.E_ID) AS totalItem
FROM BUDGETS b
LEFT JOIN EXPENSES e ON b.ID = e.B_ID
WHERE b.CREATEDBY=?
GROUP BY b.ID, monthYear
ORDER BY b.CREATEDAT DESC`,[email]);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, amount, icon, createdBy } = body;

    // Ensure all required fields are provided
    if (!name || !amount || !icon || !createdBy) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }

    if (amount < 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Amount must be a non-negative number" }),
        { status: 400 }
      );
    }

    // Insert new budget into the database
    const [result] = await db.execute(
      `INSERT INTO BUDGETS (BNAME, AMOUNT, ICON, CREATEDBY,CREATEDAT) VALUES (?, ?, ?, ?,NOW())`,
      [name, amount, icon, createdBy]
    );

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Database insert error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// export async function DELETE(req) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
//     }

//     const body = await req.json();
//     const budgetId = Number(body.id);

//     if (!budgetId || isNaN(budgetId)) {
//       return new Response(JSON.stringify({ success: false, error: 'Invalid ID' }), { status: 400 });
//     }

//     await db.execute(`DELETE FROM EXPENSES WHERE B_ID = ?`, [budgetId]);
//     const [result] = await db.execute(`DELETE FROM BUDGETS WHERE ID = ?`, [budgetId]);

//     if (result.affectedRows === 0) {
//       return new Response(JSON.stringify({ success: false, error: 'Budget not found' }), { status: 404 });
//     }

//     return new Response(JSON.stringify({ success: true, message: 'Budget deleted successfully' }), { status: 200 });
//   } catch (error) {
//     console.error('Delete error:', error);
//     return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
//   }
// }
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const budgetId = Number(body.id);

    if (!budgetId || isNaN(budgetId)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid ID' }), { status: 400 });
    }

    // Fetch all O_IDs linked to this B_ID
    const [oIdRows] = await db.execute(
      `SELECT O_ID FROM EXPENSES WHERE B_ID = ? AND O_ID IS NOT NULL`,
      [budgetId]
    );

    const oIds = oIdRows.map(row => row.O_ID);

    //    deleting the budget will automatically delete its related expenses.
    const [expensesDelete] = await db.execute(
      `DELETE FROM EXPENSES WHERE B_ID = ?`,
      [budgetId]
    );

    const [budgetDelete] = await db.execute(
      `DELETE FROM BUDGETS WHERE ID = ?`,
      [budgetId]
    );

    if (budgetDelete.affectedRows === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Budget not found' }), { status: 404 });
    }

    // Delete all related online_transaction records
    if (oIds.length > 0) {
      await db.execute(
        `DELETE FROM online_transaction WHERE O_ID IN (${oIds.map(() => '?').join(',')})`,
        oIds
      );
    }

    return new Response(JSON.stringify({ success: true, message: 'Budget deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, bname, amount, icon } = body;

    // Check if the required fields are provided
    if (!id || !bname || !amount || !icon) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be a non‑negative number' },
        { status: 400 }
      );
    }
    // Update budget using direct db connection (without connection pool)
    const [result] = await db.execute(
      'UPDATE BUDGETS SET BNAME = ?, AMOUNT = ?, ICON = ? WHERE ID = ?',
      [bname, amount, icon, id]
    );

    // Check if any rows were affected by the update
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'No budget found to update' }, { status: 404 });
    }

    // Successfully updated the budget
    return NextResponse.json({ message: 'Budget updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}