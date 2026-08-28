'use client';

import { useState } from "react";
import PieChartComponent from "./_components/PieChartComponent";
import LineChartMonthly from "./_components/LineChartMonthly";
import DateExpenseViewer from "./_components/DateExpenseViewer";

const monthOptions = [
  "All", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function StatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const currentYear = new Date().getFullYear();

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      {/* Line/Bar Chart Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Monthly Budget vs Expenses</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-4 py-2"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month === "All" ? "All Months" : month}
              </option>
            ))}
          </select>
        </div>

        <LineChartMonthly selectedMonth={selectedMonth} year={currentYear} />
      </section>

      {/* Pie Chart and Calendar Side-by-Side */}
      <section className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-rose-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Yearly Expense Summary</h2>
          <PieChartComponent />
        </div>

        <div className="flex-1 bg-violet-200 p-6 rounded-xl shadow-md border border-gray-200">
          <DateExpenseViewer />
        </div>
      </section>
    </main>
  );
}