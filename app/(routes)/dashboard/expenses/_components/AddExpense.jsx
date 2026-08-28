import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

function AddExpense({ budgetId, onExpenseAdded }) {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addNewExpense = async () => {
    if (!isLoaded || !user) {
      console.warn("User not loaded yet");
      return;
    }
    const parsedAmount = parseFloat(amount);
  if (!name.trim()) {
    toast.error("Please enter an expense name.");
    return;
  }

  if (isNaN(parsedAmount)) {
    toast.error("Please enter a valid number for amount.");
    return;
  }

  if (parsedAmount <= 0) {
    toast.error("Expense amount must be a positive number.");
    return;
  }
    try {
      const res = await fetch(`/api/expenses/${budgetId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount: Number(amount),
          budgetId,
          userId: user.id, // Not strictly needed unless you're handling it manually on backend
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast("New Expense Added!!");
        setName("");
        setAmount("");
        if (onExpenseAdded) onExpenseAdded(); // ✅ Trigger refresh
      } else {
        toast("Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      toast("Error submitting expense.");
    }
  };

  return (
    <div className="p-5">
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="my-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Family Vacation"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="my-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={addNewExpense}
        className="mt-3"
      >
        Add Expense
      </Button>
    </div>
    </div>
  );
}
export default AddExpense;

