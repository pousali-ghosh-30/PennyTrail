'use client';

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
  "#3B3EAC", "#E6F7FF", "#DD4477", "#66AA00", "#B82E2E",
  "#316395", "#994499", "#22AA99", "#AAAA11", "#6633CC",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function PieChartComponent() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("yearly"); // 'yearly' or 'monthly'
  const [selectedMonth, setSelectedMonth] = useState("Jan");

  const fetchData = async () => {
    setLoading(true);
    const year = new Date().getFullYear();
    const type = mode === "yearly" ? "yearly-budget-summary" : "monthly-budget-summary";
    const url =
      mode === "yearly"
        ? `/api/statistics?type=${type}&year=${year}`
        : `/api/statistics?type=${type}&year=${year}&month=${selectedMonth}`;

    const res = await fetch(url);
    const json = await res.json();

   const formatted = json.map((item) => ({
  category: item.category || "Other",
  amount: Number(
    mode === "monthly" ? item.expense : item.amount
  ) || 0,
}));

    const totalAmount = formatted.reduce((acc, cur) => acc + cur.amount, 0);
    setData(formatted);
    setTotal(totalAmount);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [mode, selectedMonth]);

  return (
    <div className="space-y-4">
      {/* Toggle Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMode("yearly")}
          className={`px-4 py-2 rounded ${mode === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Yearly
        </button>
        <button
          onClick={() => setMode("monthly")}
          className={`px-4 py-2 rounded ${mode === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Monthly
        </button>

        {mode === "monthly" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-4 px-3 py-2 border rounded"
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-pulse">
          <div className="relative w-[400px] h-[400px] bg-gray-100 rounded-full" />
          <div className="space-y-3 w-48">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-gray-300" />
                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                <div className="w-10 h-4 bg-gray-300 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">
          No data available for pie chart.
        </p>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="relative w-[400px] h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={1}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl font-bold text-gray-800">
                ₹{total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="capitalize">{entry.category}</span>
                <span className="ml-auto font-semibold">₹{entry.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}