import { PiggyBank, Receipt, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [currentMonthBudgets, setCurrentMonthBudgets] = useState([]);

  useEffect(() => {
    if (budgetList && budgetList.length > 0) {
      // Filter current month budgets
      const now = new Date();
      const filtered = budgetList.filter((item) => {
        const createdDate = new Date(item.createdAt);
        return (
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      });

      setCurrentMonthBudgets(filtered);
      calculateCardInfo(filtered);
    }
  }, [budgetList]);

  const calculateCardInfo = (budgets) => {
    let total = 0;
    let spend = 0;
    budgets.forEach((item) => {
      total += Number(item.amount) || 0;
      spend += Number(item.totalSpend) || 0;
    });
    setTotalBudget(total);
    setTotalSpend(spend);
  };

  return (
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Budget</h2>
          <h2 className='font-bold text-2xl'>₹{totalBudget}</h2>
        </div>
        <PiggyBank className='bg-purple-800 text-white p-3 h-12 w-12 rounded-2xl' />
      </div>

      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>Total Spend</h2>
          <h2 className='font-bold text-2xl'>₹{totalSpend}</h2>
        </div>
        <Receipt className='bg-purple-800 text-white p-3 h-12 w-12 rounded-2xl' />
      </div>

      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
          <h2 className='text-sm'>No. of Budgets</h2>
          <h2 className='font-bold text-2xl'>{currentMonthBudgets.length}</h2>
        </div>
        <Wallet className='bg-purple-800 text-white p-3 h-12 w-12 rounded-2xl' />
      </div>
    </div>
  );
}

export default CardInfo;
