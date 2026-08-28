// app/api/expenses/[id]/route.js
import db from "@/mysql/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  // Await the params to resolve the Promise
  const resolvedParams = await params; // Awaiting params
  console.log("Received params:", resolvedParams);
  
  const id = resolvedParams.id; 
  const { userId } = await getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const [expenses] = await db.execute(
      `SELECT E_ID as id, ENAME as name, AMOUNT as amount, CREATEDAT as createdAt 
       FROM EXPENSES 
       WHERE B_ID = ?`,
      [id]
    );

    return new Response(JSON.stringify({ success: true, expenses }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}


export async function POST(req, { params }) {
  const resolvedParams = await params; 
  const id = resolvedParams.id;
  const { userId } = await getAuth(req);


  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { name, amount } = await req.json();

    if (!name || !amount) {
      return new Response(JSON.stringify({ error: "Missing name or amount" }), { status: 400 });
    }
    await db.execute(
      `INSERT INTO EXPENSES (ENAME, AMOUNT, B_ID, CREATEDAT)
       VALUES (?, ?, ?, NOW())`,
      [name, amount, id]
    );

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// export async function DELETE(request, { params }) {
//   const resolvedParams=await params;
//   const expenseId = resolvedParams.id;

//   try {
//     const [result] = await db.execute(`DELETE FROM EXPENSES WHERE E_ID = ?`, [expenseId]);

//     if (result.affectedRows === 0) {
//       return new Response(JSON.stringify({ success: false, error: 'Expense not found' }), {
//         status: 404,
//       });
//     }

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (err) {
//     console.error('DELETE /api/expenses/[id] failed:', err);
//     return new Response(JSON.stringify({ success: false, error: 'Database error' }), {
//       status: 500,
//     });
//   }
// }
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const expenseId = resolvedParams.id;

  try {
    // 1. Fetch related O_ID before deleting the expense
    const [rows] = await db.execute(
      `SELECT O_ID FROM EXPENSES WHERE E_ID = ?`,
      [expenseId]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Expense not found" }), {
        status: 404,
      });
    }

    const oId = rows[0].O_ID;

    // 2. Delete the expense
    const [result] = await db.execute(`DELETE FROM EXPENSES WHERE E_ID = ?`, [expenseId]);

    // 3. Delete the related online_transaction if O_ID exists
    if (oId) {
      await db.execute(`DELETE FROM online_transaction WHERE O_ID = ?`, [oId]);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("DELETE /api/expenses/[id] failed:", err);
    return new Response(JSON.stringify({ success: false, error: "Database error" }), {
      status: 500,
    });
  }
}


export async function PUT(req, { params }) {
  const resolvedParams = await params;
  const expenseId = resolvedParams.id;
  const { userId } = await getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { name, amount } = await req.json();

    if (!name || !amount) {
      return new Response(JSON.stringify({ error: "Missing name or amount" }), { status: 400 });
    }

    const [result] = await db.execute(
      `UPDATE EXPENSES SET ENAME = ?, AMOUNT = ? WHERE E_ID = ?`,
      [name, amount, expenseId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ success: false, error: "Expense not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
//expenses/[id]/route.js
