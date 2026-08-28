// // require('dotenv').config();  // Load env first

// // const express = require('express');
// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // const budgets = require('./routes/budgets');  // Adjust path if needed

// // app.use(express.json()); // For parsing JSON
// // app.use('/budgets', budgets);

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Import your backend route file budget.js
// const budgetRoutes = require('./routes/budget');  // <-- use your actual file name here

// // Enable CORS for frontend running on localhost:3000
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// app.use(express.json());

// // Use the route at /api/budget
// app.use('/api/budget', budgetRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

