'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner"; 
import EmojiPicker from 'emoji-picker-react';

function BudgetItem({ budget }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState(budget.icon || "😄");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(budget.name || "");
  const [budgetAmount, setBudgetAmount] = useState(budget.amount || "");

  const spend = budget.totalSpend || 0;
  const amount = budget.amount || 0;
  const remaining = amount - spend;
  const progress = amount > 0 ? Math.min((spend / amount) * 100, 100) : 0;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(prevState => !prevState);
  };

  const onUpdateBudget = async () => {
    try {
      const res = await fetch('/api/budget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: budget.id,
          bname: name,
          icon: emojiIcon,
          amount: parseFloat(budgetAmount),
        }),
      });

      if (res.ok) {
        toast.success("Budget updated successfully!");
        setEditOpen(false);
        window.location.reload();
      } else {
        const error = await res.json();
        toast.error(`Update failed: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating the budget.");
    }
  };

  const deleteBudget = async () => {
    try {
      const res = await fetch('/api/budget', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: budget.id }),
      });

      if (res.ok) {
        toast.success("Budget deleted successfully");
        window.location.reload();
      } else {
        const errorData = await res.json();
        toast.error(`Failed: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the budget');
    }
  };

  return (
    <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer relative">
      {/* Link to budget detail page */}
      <Link href={`/dashboard/expenses/${budget.id}`}>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-3xl p-3 px-4 bg-slate-100 rounded-full">
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              <h2 className="text-sm text-gray-600">{budget.totalItem} Item</h2>
            </div>
          </div>
          <h2 className="font-bold text-purple-700 text-lg">₹{budget.amount}</h2>
        </div>
      </Link>
      {/* 3 dots menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          style={{
              transform: 'rotate(90deg)',
              display: 'inline-block',
              fontSize: '20px',
              lineHeight: '20px',
              fontWeight: 'bold',
          }}
        >
          &#8230;
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
            <ul className="text-sm">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-blue-200"
                onClick={() => setEditOpen(true)}
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <PenBox className="w-4 h-4" />
                  <span>Edit</span>
                </span>
              </li>
              <li className="px-4 py-2 cursor-pointer hover:bg-blue-200">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span className="flex items-center gap-2 text-gray-700">
                      <Trash className="w-4 h-4 text-red-600" />
                      <span>Delete</span>
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your current budget along with expenses.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-rose-600">₹{Math.round(spend)} Spent</h2>
          {remaining >= 0 ? (
  <h2 className="text-xs text-green-600 font-semibold">₹{Math.round(remaining)} Remaining</h2>
) : (
  <h2 className="text-xs text-red-700 font-semibold">Excess Spent: ₹{Math.abs(Math.round(remaining))}</h2>
)}

        </div>
<div className="w-full bg-slate-300 h-2 rounded-full">
  <div
    className={`h-2 rounded-full transition-all duration-300 ${
      remaining < 0 ? 'bg-red-600' : 'bg-indigo-600'
    }`}
    style={{ width: `${Math.min((spend / amount) * 100, 100)}%` }}
  ></div>
</div>

      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>Choose an emoji and update your budget details:</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2 relative">
            <Button variant="outline" size="lg" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
              {emojiIcon}
            </Button>

            {openEmojiPicker && (
              <div className="absolute z-20">
                <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Budget Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                placeholder="e.g. Shopping"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Budget Amount</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                placeholder="e.g. 5000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onUpdateBudget} disabled={!name || !budgetAmount} className="w-full">
              Update Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default BudgetItem;