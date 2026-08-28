'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Crown, Gem, ShieldCheck, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});
  const { user } = useUser();

  const handleMockPayment = async (plan) => {
    const username = user?.fullName || user?.username || 'Unknown User';

    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pay', username, plan }),
    });

    const result = await res.json();

    if (result.status === 'success') {
      toast.success(`🎉 Payment for the ${plan} plan was successful!`);
      setSelectedPlan(plan);
      setPaymentStatus((prev) => ({ ...prev, [plan]: 'success' }));
    } else {
      toast.error(` Payment for the ${plan} plan failed!`);
      setPaymentStatus((prev) => ({ ...prev, [plan]: 'failure' }));
    }
  };

  const handleCancelPayment = async () => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });

    const result = await res.json();

    if (result.status === 'success') {
      toast('Subscription canceled successfully.', { icon: '🚫' });
      setPaymentStatus((prev) => {
        const updated = { ...prev };
        delete updated[selectedPlan];
        return updated;
      });
      setSelectedPlan(null);
    } else {
      toast.error(result.message || 'Failed to cancel subscription.');
    }
  };

  const planDetails = [
    {
      id: 'monthly',
      title: '₹99/month',
      icon: <Crown className="text-yellow-500 w-8 h-8" />,
      label: 'Choose this plan',
      note: 'Unlimited access to all PRO features for a month',
    },
    {
      id: 'annual',
      title: '₹599/year',
      icon: <Gem className="text-pink-500 w-8 h-8" />,
      label: 'Choose this plan',
      note: 'Unlimited access to all PRO features for years',
    },
    {
      id: '2year',
      title: '₹899/2 years',
      icon: <ShieldCheck className="text-purple-500 w-8 h-8" />,
      label: 'Choose this plan',
      note: 'Unlimited access to all PRO features for 2 years',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />

      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 relative overflow-hidden"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 80% 100%, 0% 100%)',
        }}
      >
        <h1 className="text-3xl md:text-4xl font-medium text-center leading-tight">
          <div>More content,</div>
          more quality with PRO
        </h1>
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
          <img
            src="/chess-icon.png"
            alt="PRO Icon"
            className="w-56 h-56 mb-4"
          />
        </div>
      </div>

      {/* Plan Selection */}
      <div className="max-w-6xl mx-auto px-4 text-center mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Select Your Plan</h2>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {planDetails.map((plan) => (
            <div
              key={plan.id}
              className={`relative w-72 p-6 rounded-2xl bg-purple-50 shadow-md hover:shadow-lg transition border-2 ${
                selectedPlan === plan.id ? 'border-purple-500' : 'border-gray-200'
              }`}
              onClick={() => handleMockPayment(plan.id)}
            >
              {selectedPlan === plan.id && paymentStatus[plan.id] === 'success' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelPayment();
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}

              <div className="flex justify-center mb-3">{plan.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.title}</h3>
              <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition">
                {plan.label}
              </button>
              <p className="text-sm text-gray-500 mt-4">{plan.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Box (Full-width edge-to-edge) */}
      <div className="relative left-0 right-0 mt-16 mb-20">
        <div
          className="bg-purple-800 text-white shadow-xl p-4 sm:p-6 md:p-8"
          style={{
            clipPath: 'polygon(50px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)',
            borderBottomLeftRadius: '2rem',
          }}
        >
          {/* Header Row */}
          <div className="flex justify-between font-semibold text-lg border-b border-purple-400 pb-0 mb-3">
            <div className="w-1/3 pl-4 text-left">What is included?</div>
            <div className="w-1/3 text-center">Free</div>
            <div className="w-1/3 text-center">Pro</div>
          </div>

          {/* Feature Row */}
          <div className="flex justify-between text-base py-3">
            <div className="w-1/3 pl-4 text-left">Fetch online Transactions</div>
            <div className="w-1/3 text-center text-red-500 text-2xl font-bold">❌</div>
            <div className="w-1/3 text-center text-green-500 text-2xl font-bold">✅</div>
          </div>
        </div>
      </div>
    </div>
  );
}