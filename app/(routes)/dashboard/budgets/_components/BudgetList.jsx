"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
import { PiggyBank, Wallet, CalendarDays } from "lucide-react";

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      const res = await fetch("/api/budget");
      const rows = await res.json();
      setBudgetList(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1">
        <div className="mb-4">
          <CreateBudget />
        </div>

        {Object.entries(
          budgetList.reduce((acc, item) => {
            const group = item.monthYear || "Unknown";
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
          }, {})
        ).map(([month, items]) => {
          const totalAmount = items.reduce((sum, b) => sum + b.amount, 0);

          return (
            <div key={month} className="mb-6">
              {/* Summary Row with Left-Aligned Icons, Gray Background */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 px-6 py-4 rounded-lg mb-4">
                
                {/* Year-Month */}
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 p-3 rounded-xl">
                    <CalendarDays className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Year-Month</div>
                    <div className="text-xl font-bold text-black">{month}</div>
                  </div>
                </div>

                {/* Total Budget */}
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 p-3 rounded-xl">
                    <PiggyBank className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Budget</div>
                    <div className="text-xl font-bold text-black">₹{totalAmount}</div>
                  </div>
                </div>

                {/* Number of Budgets */}
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 p-3 rounded-xl">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">No. of Budgets</div>
                    <div className="text-xl font-bold text-black">{items.length}</div>
                  </div>
                </div>
              </div>

              {/* Budget items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((budget, index) => (
                  <BudgetItem key={index} budget={budget} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetList;

