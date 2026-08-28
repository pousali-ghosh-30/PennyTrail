import db from "@/mysql/db";

export async function GET(req, { params }) {
  const budgetId = params.budgetId;
  try {
    const [[budget]] = await db.execute(
      `SELECT 
         ID as id,
         BNAME as name,
         AMOUNT as amount,
         ICON as icon,
         (SELECT COALESCE(SUM(AMOUNT), 0) FROM EXPENSES WHERE B_ID = ?) as spent,
         (SELECT COUNT(*) FROM EXPENSES WHERE B_ID = ?) as items
       FROM BUDGETS
       WHERE ID = ?`,
      [budgetId, budgetId, budgetId]
    );

    if (!budget) {
      return new Response(JSON.stringify({ error: "Budget not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, budget }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching budget:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
export async function PUT(req, { params }) {
  const budgetId = params.budgetId;
  const { name, icon, amount } = await req.json(); 
  if (!name || icon === undefined || amount === undefined) {
    return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400 });
  }

  if (amount < 0) {
    return new Response(JSON.stringify({ success: false, error: "Amount must be a non-negative number" }), { status: 400 });
  }
  try {
    await db.execute(
      `UPDATE BUDGETS SET BNAME = ?, ICON = ?, AMOUNT = ? WHERE ID = ?`,
      [name, icon, amount, budgetId] 
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error updating budget:", err);
    return new Response(JSON.stringify({ error: "Failed to update budget" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const budgetId = params.budgetId;

  try {
    await db.execute(`DELETE FROM EXPENSES WHERE B_ID = ?`, [budgetId]);
    await db.execute(`DELETE FROM BUDGETS WHERE ID = ?`, [budgetId]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error deleting budget:", err);
    return new Response(JSON.stringify({ error: "Failed to delete budget" }), { status: 500 });
  }
}