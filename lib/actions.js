import { db } from '../mysql/db';



// Fetch all budgets from the database
// export async function getBudgets() {
//   try {
//     const [rows] = await db.execute("SELECT * FROM budgets");
//     return rows;
//   } catch (error) {
//     console.error("Error fetching budgets:", error);
//     return [];
//   }
// }
export async function getBudgets() {
  try {
    const res = await fetch('/api/budget', { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      console.error("Fetch error:", text);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch budgets:", err);
    return [];
  }
}

// Add a new budget
export async function createBudget({ name, icon, amount, totalSpend, totalItem, createdBy }) {
  try {
    const [result] = await db.execute(
      `INSERT INTO budgets (name, icon, amount, totalSpend, totalItem, createdBy) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, icon, amount, totalSpend, totalItem, createdBy]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating budget:", error);
    return null;
  }
}

// Delete a budget by ID
export async function deleteBudget(id) {
  try {
    await db.execute("DELETE FROM budgets WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting budget:", error);
    return false;
  }
}

// Update a budget by ID
export async function updateBudget(id, { name, icon, amount, totalSpend, totalItem }) {
  try {
    await db.execute(
      `UPDATE budgets SET name = ?, icon = ?, amount = ?, totalSpend = ?, totalItem = ? WHERE id = ?`,
      [name, icon, amount, totalSpend, totalItem, id]
    );
    return true;
  } catch (error) {
    console.error("Error updating budget:", error);
    return false;
  }
}