'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

function BudgetCard({ budget, onEditComplete, onDeleteComplete }) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState(budget?.icon || "❓");
  const [name, setName] = useState(budget?.name || "");
  const [amount, setAmount] = useState(budget?.amount || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setEmojiIcon(budget?.icon || "❓");
    setName(budget?.name || "");
    setAmount(budget?.amount || "");
  }, [budget]);

  if (!budget) {
  return (
    <div className="border rounded-lg p-8 shadow-md w-full max-w-lg relative animate-pulse select-none">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div> {/* emoji placeholder */}
        <div className="h-8 w-40 rounded bg-gray-300"></div> {/* title placeholder */}
      </div>

      <div className="h-10 w-24 rounded bg-gray-300 mb-2"></div> {/* amount placeholder */}

      <div className="h-6 w-28 rounded bg-gray-300 mb-2"></div> {/* items placeholder */}

      <div className="flex gap-4 text-base mt-4">
        <div className="h-5 w-20 rounded bg-gray-300"></div> {/* spent placeholder */}
        <div className="h-5 w-24 rounded bg-gray-300"></div> {/* remaining placeholder */}
      </div>

      <div className="h-4 w-full bg-gray-300 rounded mt-4">
        <div className="h-full w-1/2 bg-gray-400 rounded animate-pulse"></div> {/* progress bar shimmer */}
      </div>
    </div>
  );
}


  const parsedAmount = parseFloat(amount) || 0;
  const spent = parseFloat(budget.spent) || 0;
  const remaining = parsedAmount - spent;
  const progress = parsedAmount > 0 ? (spent / parsedAmount) * 100 : 0;

  // Handle budget update on edit dialog submit
  const handleUpdate = async () => {
  if (!name || !amount || isNaN(parsedAmount) || parsedAmount <= 0) {
    toast.error("Please enter a valid name and positive amount.");
    return;
  }

  try {
    const res = await fetch(`/api/budget/${budget.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: budget.id,
        icon: emojiIcon,
        name: name.trim(),
        amount: parsedAmount,
      }),
    });

    if (res.ok) {
      toast.success("Budget updated successfully.");
      setEditOpen(false);
      onEditComplete?.();  // Notify parent
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to update budget.");
    }
  } catch (e) {
    toast.error("Error updating budget.");
    console.error(e);
  }
};

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/budget', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: budget.id }),
      });

      if (res.ok) {
        toast.success("Budget deleted.");
        onDeleteComplete?.();
        router.push('/dashboard/budgets');
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete.");
      }
    } catch (e) {
      toast.error("Error deleting budget.");
      console.error(e);
    }
  };

  return (
    <div className="border rounded-lg p-8 shadow-md w-full max-w-lg relative">
      <h2 className="flex items-center gap-3 mb-4">
        <span className="text-4xl leading-none bg-blue-100 rounded-full p-2">
          {emojiIcon}
        </span>
        <span className="text-3xl text-indigo-900 font-bold">{name}</span>

        <div className="ml-auto flex gap-4">
          <button onClick={() => setEditOpen(true)} className="text-blue-600 hover:text-blue-800">
            <Pencil className="w-6 h-6" />
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-red-600 hover:text-red-800">
                <Trash2 className="w-6 h-6" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this budget and its expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <p className="text-blue-700 font-extrabold text-3xl mb-2">₹{parsedAmount}</p>
      <p className="text-gray-600 text-lg">{budget.items} Item(s)</p>

     <div className="text-base mt-4">
  <span className="text-red-500 font-semibold">₹{spent} Spent</span>{" "}
  |
  {remaining >= 0 ? (
    <span className="text-green-500 font-semibold"> ₹{remaining} Remaining</span>
  ) : (
    <span className="text-red-600 font-bold"> Excess Spent: ₹{Math.abs(remaining)}</span>
  )}
</div>

      <div className="h-4 w-full bg-gray-300 rounded-full mt-4">
        <div
  className={`h-full rounded-full transition-all duration-300 ${
    progress > 100 ? 'bg-red-600' : 'bg-indigo-600'
  }`}
  style={{ width: `${Math.min(progress, 100)}%` }}
></div>

      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update emoji, name, or amount.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 relative mt-2">
            <Button variant="outline" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {emojiIcon}
            </Button>

            {showEmojiPicker && (
              <div className="absolute z-20">
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Budget Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter budget name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleUpdate} disabled={!name || !amount} className="w-full">
              Update Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BudgetCard;