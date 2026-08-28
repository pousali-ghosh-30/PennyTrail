"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function BarChartDashboard({ budgetList }) {
  // Filter data for the current month
  const filteredData = budgetList.filter((item) => {
    const now = new Date();
    const date = new Date(item.createdAt);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div style={{ width: "100%", height: 400 }} className='border rounded-lg p-5'>
      <h2 className="text-center text-purple-700 font-bold text-xl mb-4">
      Budget Allocation and Spending through Bar Chart
      </h2>
      <div className="flex justify-center gap-8 text-lg font-semibold">
        <div className="flex items-center gap-2 text-purple-600">
          <div className="w-4 h-4 bg-[#D79DEB] rounded-sm"></div>
          Budget
        </div>
        <div className="flex items-center gap-2 text-purple-800"> 
          <div className="w-4 h-4 bg-[#8650AB] rounded-sm"></div>
          Spent
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" name="Budget" fill="#D79DEB" />
          <Bar
            dataKey="totalSpend"
            name="Spent"
            fill="#8650AB"
            // Use red color if overspent
            isAnimationActive={false}
          />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default BarChartDashboard;
