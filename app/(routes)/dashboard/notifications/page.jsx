// 'use client';
// import { useEffect, useState } from 'react';
// import EmojiPicker from 'emoji-picker-react';

// export default function NotificationsPage() {
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [selectedBudgets, setSelectedBudgets] = useState({});
//   const [expenseNames, setExpenseNames] = useState({});
//   const [showNewBudgetInputs, setShowNewBudgetInputs] = useState({});
//   const [newBudgetNames, setNewBudgetNames] = useState({});
//   const [newBudgetAmounts, setNewBudgetAmounts] = useState({});
//   const [emojiIcons, setEmojiIcons] = useState({});
//   const [showEmojiPicker, setShowEmojiPicker] = useState({});

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const txRes = await fetch('/api/transactions');
//     const txData = await txRes.json();
//     setTransactions(txData.transactions);
//     await fetchBudgets();
//   };

//   const fetchBudgets = async () => {
//     const budgetRes = await fetch('/api/budget/current');
//     const budgetData = await budgetRes.json();
//     setBudgets(budgetData.budgets);
//   };

//   const handleSubmit = async (transaction) => {
//     const { O_ID, TRANSACTION_ID } = transaction;
//     const budgetId = selectedBudgets[O_ID];
//     const expenseName = expenseNames[O_ID];
//     if (!budgetId || !expenseName) return alert('Please fill out all fields');

//     const res = await fetch('/api/add-expense', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         budgetId,
//         transactionId: TRANSACTION_ID,
//         expenseName,
//         oId: O_ID,
//       }),
//     });

//     const data = await res.json();

//     if (data.status === 'success') {
//       alert('Expense added!');
//       fetchData();
//     } else {
//       alert('Failed to add expense: ' + (data.message || 'Unknown error'));
//     }
//   };

//   const handleCreateBudget = async (oId) => {
//     const name = newBudgetNames[oId];
//     const amount = newBudgetAmounts[oId];
//     const emoji = emojiIcons[oId] || '';

//     if (!name.trim() || !amount) return;

//     const res = await fetch('/api/budget/create', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name,
//         icon: emoji,
//         amount: parseFloat(amount),
//       }),
//     });

//     const data = await res.json();

//     if (data.status === 'success') {
//       setNewBudgetNames({ ...newBudgetNames, [oId]: '' });
//       setNewBudgetAmounts({ ...newBudgetAmounts, [oId]: '' });
//       setEmojiIcons({ ...emojiIcons, [oId]: '' });
//       setShowNewBudgetInputs({ ...showNewBudgetInputs, [oId]: false });
//       await fetchBudgets();
//     } else {
//       alert('Failed to create budget');
//     }
//   };

//   const handleDeleteExpenseAndTransaction = async (expenseId) => {
//     const confirmed = confirm('Are you sure you want to delete this expense and transaction?');
//     if (!confirmed) return;

//     const res = await fetch(`/api/expenses/${expenseId}`, {
//       method: 'DELETE',
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert('Expense and transaction deleted');
//       fetchData();
//     } else {
//       alert('Delete failed: ' + (data.error || 'Unknown error'));
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Notifications</h1>

//       {transactions.map((tx) => (
//         <div
//           key={tx.O_ID}
//           className="rounded-3xl bg-white border shadow-md mb-10 w-full overflow-hidden"
//         >
//           {/* Header */}
//           <div className="bg-blue-900 text-white flex justify-between px-4 py-2 text-md">
//             <span>
//               Payment At:{' '}
//               {new Date(tx.CREATEDAT).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </span>
//             <span>Transaction ID : {tx.TRANSACTION_ID}</span>
//           </div>

//           {/* Separator */}
//           <div className="h-[2px] bg-gray-300" />

//           {/* Amount
//           <div className="flex">
//             <div className="w-1/3 px-3 py-2 font-medium">Amount:</div>
//             <div className="w-2/3 px-3 py-2">{parseFloat(tx.AMOUNT).toFixed(2)}</div>
//           </div> */}
//           {/* Amount */}
// {/* <div className="flex border-t border-blue-900">
//   <div className="w-1/3 bg-white px-3 py-2 font-medium">Amount:</div>
//   <div className="w-2/3 px-3 py-2">
//     <div className="border px-3 py-1 rounded bg-white w-fit inline-block text-sm">
//       {parseFloat(tx.AMOUNT).toFixed(2)}
//     </div>
//   </div>
// </div> */}
//  <div className="flex border-t border-blue-900">
//   <div className="w-1/3 px-3 py-2 font-medium">Amount:</div>
//   <div className="w-2/3 px-3 py-2">
//     <div  className="w-full border px-2 py-1 rounded">
//       {parseFloat(tx.AMOUNT).toFixed(2)}
//     </div>
//   </div>
// </div>
//           {/* Budget Name */}
//           <div className="flex border-t border-gray-200">
//             <div className="w-1/3 px-3 py-2 font-medium">Budget name:</div>
//             <div className="w-2/3 px-3 py-2">
//               <select
//                 className="w-full border px-2 py-1 rounded"
//                 value={selectedBudgets[tx.O_ID] || ''}
//                 onChange={(e) =>
//                   setSelectedBudgets({
//                     ...selectedBudgets,
//                     [tx.O_ID]: e.target.value,
//                   })
//                 }
//               >
//                 <option value="">Select Budget</option>
//                 {budgets.map((b) => (
//                   <option key={b.ID} value={b.ID}>
//                     {b.BNAME} (ID: {b.ID})
//                   </option>
//                 ))}
//               </select>

//               <button
//                 onClick={() =>
//                   setShowNewBudgetInputs({
//                     ...showNewBudgetInputs,
//                     [tx.O_ID]: !showNewBudgetInputs[tx.O_ID],
//                   })
//                 }
//                 className="text-blue-600 text-xs mt-1 underline"
//               >
//                 + Create New Budget
//               </button>

//               {showNewBudgetInputs[tx.O_ID] && (
//                 <div className="mt-2 bg-indigo-100 p-2 rounded border border-gray-300">
//                   <div className="flex items-center justify-between mb-2">
//                     <input
//                       type="text"
//                       placeholder="Budget name"
//                       className="border px-2 py-1 rounded w-full text-sm mr-2"
//                       value={newBudgetNames[tx.O_ID] || ''}
//                       onChange={(e) =>
//                         setNewBudgetNames({
//                           ...newBudgetNames,
//                           [tx.O_ID]: e.target.value,
//                         })
//                       }
//                     />
                    
//                     <button
//                       className="text-xl"
//                       onClick={() =>
//                         setShowEmojiPicker((prev) => ({
//                           ...prev,
//                           [tx.O_ID]: !prev[tx.O_ID],
//                         }))
//                       }
//                     >
//                       {emojiIcons[tx.O_ID] || '😀'}
//                     </button>
//                   </div>

//                   {showEmojiPicker[tx.O_ID] && (
//                     <div className="mb-2">
//                       <EmojiPicker
//                         onEmojiClick={(emojiData) => {
//                           setEmojiIcons({ ...emojiIcons, [tx.O_ID]: emojiData.emoji });
//                           setShowEmojiPicker({ ...showEmojiPicker, [tx.O_ID]: false });
//                         }}
//                         height={300}
//                       />
//                     </div>
//                   )}

//                   <input
//                     type="number"
//                     placeholder="Budget amount"
//                     className="border px-2 py-1 rounded w-full mb-2 text-sm"
//                     value={newBudgetAmounts[tx.O_ID] || ''}
//                     onChange={(e) =>
//                       setNewBudgetAmounts({
//                         ...newBudgetAmounts,
//                         [tx.O_ID]: e.target.value,
//                       })
//                     }
//                   />
//                   <button
//                     onClick={() => handleCreateBudget(tx.O_ID)}
//                     className="bg-blue-900 text-white text-sm px-3 py-1 rounded w-full hover:bg-blue-950"
//                   >
//                     Create Budget
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Expense Name */}
//           <div className="flex border-t border-gray-200">
//             <div className="w-1/3 px-3 py-2 font-medium">Expense name:</div>
//             <div className="w-2/3 px-3 py-2">
//               <input
//                 type="text"
//                 className="border px-2 py-1 rounded w-full"
//                 value={expenseNames[tx.O_ID] || ''}
//                 onChange={(e) =>
//                   setExpenseNames({
//                     ...expenseNames,
//                     [tx.O_ID]: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 p-3 border-t border-gray-300">
//             <button
//               onClick={() => handleSubmit(tx)}
//               className="bg-blue-900 text-white px-4 py-1 rounded text-sm hover:bg-blue-950"
//             >
//               Add Expense
//             </button>
//             {tx.E_ID && (
//               <button
//                 onClick={() => handleDeleteExpenseAndTransaction(tx.E_ID)}
//                 className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgets, setSelectedBudgets] = useState({});
  const [expenseNames, setExpenseNames] = useState({});
  const [showNewBudgetInputs, setShowNewBudgetInputs] = useState({});
  const [newBudgetNames, setNewBudgetNames] = useState({});
  const [newBudgetAmounts, setNewBudgetAmounts] = useState({});
  const [emojiIcons, setEmojiIcons] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    const handleUpdate = () => fetchData();
    window.addEventListener('notification-update', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notification-update', handleUpdate);
    };
  }, []);

  const fetchData = async () => {
    try {
      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();
      setTransactions(txData.transactions);
      const budgetRes = await fetch('/api/budget/current');
      const budgetData = await budgetRes.json();
      setBudgets(budgetData.budgets);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSubmit = async (transaction) => {
    const { O_ID, TRANSACTION_ID } = transaction;
    const budgetId = selectedBudgets[O_ID];
    const expenseName = expenseNames[O_ID];
    if (!budgetId || !expenseName) return toast.error('Please fill out all fields');

    const res = await fetch('/api/add-expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budgetId, transactionId: TRANSACTION_ID, expenseName, oId: O_ID })
    });

    const data = await res.json();
    if (data.status === 'success') {
      toast.success('Expense added!');
      fetchData();
      window.dispatchEvent(new Event('notification-update'));
    } else {
      toast.error('Failed to add expense: ' + (data.message || 'Unknown error'));
    }
  };

  const handleCreateBudget = async (oId) => {
    const name = newBudgetNames[oId];
    const amount = newBudgetAmounts[oId];
    const emoji = emojiIcons[oId] || '';

    if (!name.trim() || !amount) return toast.error('Fill all budget fields');

    const res = await fetch('/api/budget/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, icon: emoji, amount: parseFloat(amount) })
    });

    const data = await res.json();
    if (data.status === 'success') {
      setNewBudgetNames({ ...newBudgetNames, [oId]: '' });
      setNewBudgetAmounts({ ...newBudgetAmounts, [oId]: '' });
      setEmojiIcons({ ...emojiIcons, [oId]: '' });
      setShowNewBudgetInputs({ ...showNewBudgetInputs, [oId]: false });
      fetchData();
    } else {
      toast.error('Failed to create budget');
    }
  };

  const handleDeleteExpenseAndTransaction = async (expenseId) => {
    toast('Are you sure you want to delete?', {
      action: {
        label: 'Yes',
        onClick: async () => {
          const res = await fetch(`/api/expenses/${expenseId}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          if (data.success) {
            toast.success('Expense and transaction deleted');
            fetchData();
            window.dispatchEvent(new Event('notification-update'));
          } else {
            toast.error('Delete failed: ' + (data.error || 'Unknown error'));
          }
        }
      }
    });
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {transactions.map((tx) => (
        <div
          key={tx.O_ID}
          className="rounded-3xl bg-white border shadow-md mb-10 w-full overflow-hidden"
        >
          <div className="bg-blue-900 text-white flex justify-between px-4 py-2 text-md">
            <span>
              Payment At:{' '}
              {new Date(tx.CREATEDAT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>Transaction ID : {tx.TRANSACTION_ID}</span>
          </div>

          <div className="flex border-t border-blue-900">
            <div className="w-1/3 px-3 py-2 font-medium">Amount:</div>
            <div className="w-2/3 px-3 py-2">
              <div className="w-full border px-2 py-1 rounded">
                {parseFloat(tx.AMOUNT).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex border-t border-gray-200">
            <div className="w-1/3 px-3 py-2 font-medium">Budget name:</div>
            <div className="w-2/3 px-3 py-2">
              <select
                className="w-full border px-2 py-1 rounded"
                value={selectedBudgets[tx.O_ID] || ''}
                onChange={(e) =>
                  setSelectedBudgets({ ...selectedBudgets, [tx.O_ID]: e.target.value })
                }
              >
                <option value="">Select Budget</option>
                {budgets.map((b) => (
                  <option key={b.ID} value={b.ID}>
                    {b.BNAME} (ID: {b.ID})
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  setShowNewBudgetInputs({
                    ...showNewBudgetInputs,
                    [tx.O_ID]: !showNewBudgetInputs[tx.O_ID]
                  })
                }
                className="text-blue-600 text-xs mt-1 underline"
              >
                + Create New Budget
              </button>

              {showNewBudgetInputs[tx.O_ID] && (
                <div className="mt-2 bg-indigo-100 p-2 rounded border border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      placeholder="Budget name"
                      className="border px-2 py-1 rounded w-full text-sm mr-2"
                      value={newBudgetNames[tx.O_ID] || ''}
                      onChange={(e) =>
                        setNewBudgetNames({ ...newBudgetNames, [tx.O_ID]: e.target.value })
                      }
                    />
                    <button
                      className="text-xl"
                      onClick={() =>
                        setShowEmojiPicker((prev) => ({ ...prev, [tx.O_ID]: !prev[tx.O_ID] }))
                      }
                    >
                      {emojiIcons[tx.O_ID] || '😀'}
                    </button>
                  </div>

                  {showEmojiPicker[tx.O_ID] && (
                    <div className="mb-2">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setEmojiIcons({ ...emojiIcons, [tx.O_ID]: emojiData.emoji });
                          setShowEmojiPicker({ ...showEmojiPicker, [tx.O_ID]: false });
                        }}
                        height={300}
                      />
                    </div>
                  )}

                  <input
                    type="number"
                    placeholder="Budget amount"
                    className="border px-2 py-1 rounded w-full mb-2 text-sm"
                    value={newBudgetAmounts[tx.O_ID] || ''}
                    onChange={(e) =>
                      setNewBudgetAmounts({ ...newBudgetAmounts, [tx.O_ID]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleCreateBudget(tx.O_ID)}
                    className="bg-blue-900 text-white text-sm px-3 py-1 rounded w-full hover:bg-blue-950"
                  >
                    Create Budget
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex border-t border-gray-200">
            <div className="w-1/3 px-3 py-2 font-medium">Expense name:</div>
            <div className="w-2/3 px-3 py-2">
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={expenseNames[tx.O_ID] || ''}
                onChange={(e) =>
                  setExpenseNames({ ...expenseNames, [tx.O_ID]: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-3 border-t border-gray-300">
            <button
              onClick={() => handleSubmit(tx)}
              className="bg-blue-900 text-white px-4 py-1 rounded text-sm hover:bg-blue-950"
            >
              Add Expense
            </button>
            {tx.E_ID && (
              <button
                onClick={() => handleDeleteExpenseAndTransaction(tx.E_ID)}
                className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
