
'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function DateExpenseViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
useEffect(() => {
  const fetchExpenses = async () => {
    const dateStr = selectedDate.toLocaleDateString('en-CA'); //  YYYY-MM-DD in local time
    const res = await fetch(`/api/expenses/by-date?date=${dateStr}`);
    const json = await res.json();
    setExpenses(json);
  };

  fetchExpenses();
}, [selectedDate]);


  return (
    <div className="w-full md:max-w-[400px] bg-purple-100 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Check Expenses by Date</h2>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        showOutsideDays
        fixedWeeks
        modifiersClassNames={{
          selected: 'bg-black text-white rounded-full',
          today: 'font-bold border border-black rounded-full',
        }}
        styles={{
          caption: { textAlign: 'center', fontWeight: 'bold' },
          head_cell: { fontWeight: '600' },
        }}
      />

      <div className="mt-4 space-y-2">
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses found.</p>
        ) : (
          expenses.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-1"
            >
              <span className="capitalize">{item.name}</span>
              <span className="font-semibold text-right">₹{item.amount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

