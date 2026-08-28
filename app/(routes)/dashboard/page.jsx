// "use client";
// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import CardInfo from "./_components/CardInfo";
// import BarChartDashboard from "./_components/BarChartDashboard";
// import BudgetItem from "./budgets/_components/BudgetItem";
// import PieChartDashboard from "./_components/PieChartDashboard";

// function Dashboard() {
//   const { user } = useUser();
//   const [budgetList, setBudgetList] = useState([]);

//   useEffect(() => {
//     if (user) {
//       getBudgetList();
//     }
//   }, [user]);

//   const getBudgetList = async () => {
//     try {
//       const res = await fetch("/api/budget");
//       const data = await res.json();
//       setBudgetList(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching budgets:", error);
//     }
//   };

//   // Filter budgetList to only include current month items
//   const now = new Date();
//   const currentMonthBudgets = budgetList.filter((item) => {
//     if (!item.createdAt) return false;
//     const createdDate = new Date(item.createdAt);
//     return (
//       createdDate.getMonth() === now.getMonth() &&
//       createdDate.getFullYear() === now.getFullYear()
//     );
//   });

//   return (
//     <div className="p-5">
//       <h2 className="font-bold text-3xl">Welcome, {user?.fullName} 🖐</h2>
//       <p className="text-gray-500 p-2">
//         Let’s get started!🚀 Create a budget or add your expense to track your spending
//       </p>

//       <CardInfo budgetList={currentMonthBudgets} />

//       <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
//         <div className="md:col-span-2">
//           <BarChartDashboard budgetList={currentMonthBudgets} />
//           <PieChartDashboard budgetList={currentMonthBudgets} />
//         </div>
//         <div>
//           {currentMonthBudgets.map((budget, index) => (
//             <BudgetItem budget={budget} key={index} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import PieChartDashboard from "./_components/PieChartDashboard";

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      const res = await fetch("/api/budget");
      const data = await res.json();
      setBudgetList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // Filter budgetList to only include current month items
  const now = new Date();
  const currentMonthBudgets = budgetList.filter((item) => {
    if (!item.createdAt) return false;
    const createdDate = new Date(item.createdAt);
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl">Welcome, {user?.fullName} 🖐</h2>
      <p className="text-gray-500 p-2">
        Let’s get started!🚀 Create a budget or add your expense to track your spending
      </p>

      <CardInfo budgetList={currentMonthBudgets} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={currentMonthBudgets} />
          <PieChartDashboard budgetList={currentMonthBudgets} />
        </div>
        <div>
          {currentMonthBudgets.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;