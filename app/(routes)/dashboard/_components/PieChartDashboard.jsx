'use client';
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const CATEGORY_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#4BC0C0', '#FF9F40','#C24641','#FE9FB8','#FF7663','#768400'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, spent, value } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border-l-4">
        <p className="font-semibold text-black mb-1">{name}</p>
        <p className="text-gray-500">Total Spend : {spent.toFixed(2)}</p>
        <p className="text-gray-500">Allocated Amount : {value.toFixed(2)}</p>
        <div className="absolute -left-2 top-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
      </div>
    );
  }
  return null;
};

function PieChartDashboard({ budgetList }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !Array.isArray(budgetList) || budgetList.length === 0) {
    return null;
  }

  // Filter budgets for current month
  const now = new Date();
  const currentMonthBudgets = budgetList.filter((item) => {
    const createdDate = new Date(item.createdAt);
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  });

  let totalBudget = 0;
  let totalSpent = 0;

  const pieData = currentMonthBudgets.map((budget, index) => {
    const amount = Number(budget.amount) || 0;
    const spent = Number(budget.totalSpend) || 0;

    totalBudget += amount;
    totalSpent += spent;

    let displayName = budget.name?.trim() || 'Unnamed';
    if (displayName.toLowerCase() === 'gift shopping') {
      displayName = '→ Gift Shopping';
    }

    return {
      name: displayName,
      value: amount,
      spent,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
  });

  const totalRemaining = Math.max(totalBudget - totalSpent, 0);

  return (
    <div className="border rounded-lg p-5 mt-5 bg-white shadow-md">
      <h2 className="font-bold text-xl text-center text-purple-700 mb-6">
        Budget Allocation by Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div>
          <p className="text-gray-500">Total Budget</p>
          <p className="font-bold text-lg">{totalBudget.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Spent</p>
          <p className="font-bold text-lg text-red-600">{totalSpent.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Remaining</p>
          <p className="font-bold text-lg text-green-600">{totalRemaining.toFixed(2)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={130}
            dataKey="value"
            nameKey="name"
            stroke="#fff"
            strokeWidth={2}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartDashboard;
