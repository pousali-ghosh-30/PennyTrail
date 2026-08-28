// // const express = require('express');
// // const router = express.Router();
// // const db = require('../config/db'); // MySQL connection

// // // GET /users — Fetch all users
// // router.get('/', (req, res) => {
// //   db.query('SELECT * FROM budgets', (err, results) => {
// //     if (err) {
// //       console.error('Database error:', err);
// //       return res.status(500).json({ error: 'Database query failed' });
// //     }
// //     res.json(results);
// //   });
// // });

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db'); // Adjust path as needed

// // GET — Fetch all budgets with aggregated expense data
// router.get('/', async (req, res) => {
//   try {
//     const [rows] = await db.promise().execute(`
//       SELECT 
//         b.ID AS id, 
//         b.BNAME AS name,
//         b.AMOUNT AS amount,
//         b.ICON AS icon,
//         b.CREATEDBY AS createdBy,
//         IFNULL(SUM(e.AMOUNT), 0) AS totalSpend,
//         COUNT(e.E_ID) AS totalItem
//       FROM BUDGETS b
//       LEFT JOIN EXPENSES e ON b.ID = e.B_ID
//       GROUP BY b.ID
//     `);

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // POST — Add a new budget
// router.post('/', async (req, res) => {
//   try {
//     const { name, amount, icon, createdBy } = req.body;

//     if (!name || !amount || !icon || !createdBy) {
//       return res.status(400).json({ success: false, error: "Missing required fields" });
//     }

//     const [result] = await db.promise().execute(
//       `INSERT INTO BUDGETS (BNAME, AMOUNT, ICON, CREATEDBY) VALUES (?, ?, ?, ?)`,
//       [name, amount, icon, createdBy]
//     );

//     res.status(200).json({ success: true, result });
//   } catch (error) {
//     console.error("Insert error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // DELETE — Delete a budget by ID
// router.delete('/', async (req, res) => {
//   try {
//     const { id } = req.body;
//     const budgetId = Number(id);

//     if (!budgetId || isNaN(budgetId)) {
//       return res.status(400).json({ success: false, error: 'Invalid ID' });
//     }

//     await db.promise().execute(`DELETE FROM EXPENSES WHERE B_ID = ?`, [budgetId]);
//     const [result] = await db.promise().execute(`DELETE FROM BUDGETS WHERE ID = ?`, [budgetId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, error: 'Budget not found' });
//     }

//     res.status(200).json({ success: true, message: 'Budget deleted successfully' });
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // PUT — Update a budget
// router.put('/', async (req, res) => {
//   try {
//     const { id, bname, amount, icon } = req.body;

//     if (!id || !bname || !amount || !icon) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const [result] = await db.promise().execute(
//       'UPDATE BUDGETS SET BNAME = ?, AMOUNT = ?, ICON = ? WHERE ID = ?',
//       [bname, amount, icon, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'No budget found to update' });
//     }

//     res.status(200).json({ message: 'Budget updated successfully' });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;

