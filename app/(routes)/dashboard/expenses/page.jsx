"use client";

import React, { useEffect, useState } from "react";

const ExpensesPage = () => {
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch expenses");

        setGroupedExpenses(data.groupedExpenses || {});
      } catch (err) {
        console.error(err);
        setError("Unable to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Expenses</h1>

      {loading && <p>Loading expenses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && Object.keys(groupedExpenses).length === 0 && (
        <p>No expenses found.</p>
      )}

      {Object.entries(groupedExpenses).map(([monthYear, group]) => (
        <div
          key={monthYear}
          className="mb-6 rounded-lg overflow-hidden shadow border"
        >
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-lg font-semibold">
            <span>{monthYear}</span>
            <span>Total Spending: ₹{group.total.toFixed(2)}</span>
          </div>
          <div className="bg-white divide-y">
            {group.items.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                {/* Left: Icon and Name */}
                <div className="flex items-center gap-3 w-1/3">
                  <div className="text-2xl">{expense.icon}</div>
                  <div className="font-semibold">{expense.name}</div>
                </div>

                {/* Center: Amount */}
                <div className="text-sm text-gray-800 font-medium text-center w-1/3">
                  ₹{expense.amount.toFixed(2)}
                </div>

                {/* Right: Date */}
                <div className="text-sm text-gray-600 text-right w-1/3">
                  {new Date(expense.createdAt).toLocaleDateString("en-GB")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensesPage;