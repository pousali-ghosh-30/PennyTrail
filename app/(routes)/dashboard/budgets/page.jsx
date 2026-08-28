'use client';

import React, { useEffect, useState } from 'react';
import BudgetList from './_components/BudgetList';

const Page = () => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch('/api/budget');
        const data = await res.json();
        setBudgets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-4xl">My Budgets</h2>
      </div>

      {/* Only left side now, pass budgets */}
      <BudgetList budgets={budgets} />
    </div>
  );
};

export default Page;
