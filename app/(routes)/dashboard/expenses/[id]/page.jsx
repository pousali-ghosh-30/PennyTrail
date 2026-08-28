"use client";
import { useEffect, useState } from "react";
import AddExpense from "../_components/AddExpense";
import BudgetCard from "../_components/BudgetCard";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "next/navigation";
import { Trash, PenBox } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ExpensesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const { id } = useParams();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const deleteExpense = async () => {
    if (!selectedExpense) return;

    try {
      const res = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted "${selectedExpense.name}" successfully`);
        fetchExpenses();
        fetchBudget();
      } else {
        toast.error("Failed to delete expense!");
      }
    } catch (err) {
      toast.error("An error occurred!");
    } finally {
      setOpenDialog(false);
      setSelectedExpense(null);
    }
  };

  const handleEditExpense = async () => {
    if (!editingExpense) return;
    const parsedAmount = parseFloat(editAmount);
    if (!editName.trim()) {
      toast.error("Please enter a valid expense name.");
      return;
    }

    if (isNaN(parsedAmount)) {
      toast.error("Please enter a valid number for the amount.");
      return;
    }

    if (parsedAmount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }
    try {
      const res = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          amount: parseFloat(editAmount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Updated "${editName}" successfully`);
        fetchExpenses();
        fetchBudget();
      } else {
        toast.error("Failed to update expense!");
      }
    } catch (err) {
      toast.error("An error occurred!");
    } finally {
      setEditDialogOpen(false);
      setEditingExpense(null);
    }
  };

  const fetchExpenses = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/expenses/${id}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.expenses);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await fetch(`/api/budget/${id}`);
      const data = await res.json();
      if (data.success) {
        setBudget(data.budget);
      }
    } catch (err) {
      console.error("Failed to fetch budget:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, [id]);

  if (!isLoaded || !user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="p-20">
      <h2 className="text-3xl font-bold mb-6">Latest Expenses</h2>

      {/* Add Expense + Budget Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <AddExpense
          budgetId={id}
          user={user}
          onExpenseAdded={() => {
            fetchExpenses();
            fetchBudget();
          }}
        />
        <BudgetCard budget={budget} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses found for this budget.</p>
      ) : (
        <div className="mt-3">

          {expenses.map((expense) => (
            <div key={expense.id} className="grid grid-cols-4 bg-slate-50 p-3 items-center">
              <h2>{expense.name}</h2>
              <h2>₹{expense.amount}</h2>
              <h2>{new Date(expense.createdAt).toLocaleDateString("en-IN")}</h2>
              <div className="flex gap-25 items-center">
                <Trash
                  className="text-red-600 cursor-pointer"
                  onClick={() => {
                    setSelectedExpense(expense);
                    setOpenDialog(true);
                  }}
                />
                <PenBox
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setEditingExpense(expense);
                    setEditName(expense.name);
                    setEditAmount(expense.amount);
                    setEditDialogOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedExpense?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteExpense}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Update the expense details below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 mt-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Amount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditExpense}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
