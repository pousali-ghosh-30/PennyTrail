'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LineChartMonthly = ({ selectedMonth, year }) => {
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch chart and summary data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedMonth === 'All') {
          res = await axios.get(`/api/statistics?type=monthly-comparison&year=${year}`);
          const totalBudget = res.data.reduce((sum, m) => sum + (parseFloat(m.totalBudget) || 0), 0);
          const totalSpent = res.data.reduce((sum, m) => sum + (parseFloat(m.totalSpent) || 0), 0);
          setSummaryData({
            totalBudget: parseFloat(totalBudget) || 0,
            totalSpent: parseFloat(totalSpent) || 0,
            savings: parseFloat(totalBudget - totalSpent) || 0,
          });
        } else {
          res = await axios.get(`/api/statistics?type=monthly-budget-summary&year=${year}&month=${selectedMonth}`);
          const totalBudget = res.data.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
          const totalSpent = res.data.reduce((sum, c) => sum + (parseFloat(c.expense) || 0), 0);
          setSummaryData({
            totalBudget: parseFloat(totalBudget) || 0,
            totalSpent: parseFloat(totalSpent) || 0,
            savings: parseFloat(totalBudget - totalSpent) || 0,
          });
        }
        setChartData(res.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
        setSummaryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, year]);

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalBudget" stroke="#6366f1" strokeWidth={3} name="Budget" />
        <Line type="monotone" dataKey="totalSpent" stroke="#f97316" strokeWidth={3} name="Spent" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#6366f1" name="Budget" />
        <Bar dataKey="expense" fill="#f97316" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  );

  const heading = selectedMonth === 'All' ? `Yearly Overview (${year})` : `${selectedMonth} ${year} Overview`;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>

      {/* Summary Cards */}
      {!loading && summaryData && typeof summaryData.totalBudget === 'number' && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-indigo-100 text-indigo-900 p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold"> Total Budget</h3>
            <p className="text-xl font-bold">₹{summaryData.totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-orange-100 text-orange-900 p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold">Total Spent</h3>
            <p className="text-xl font-bold">₹{summaryData.totalSpent.toFixed(2)}</p>
          </div>
          <div
  className={`p-4 rounded-xl shadow-sm ${
    summaryData.savings >= 0
      ? 'bg-green-100 text-green-900'
      : 'bg-red-200 text-red-900'
  }`}
>
  <h3 className="text-sm font-semibold">
    {summaryData.savings >= 0 ? 'Savings' : 'Overspent'}
  </h3>
  <p className="text-xl font-bold">
    ₹{Math.abs(summaryData.savings).toFixed(2)}
  </p>
</div>

        </motion.div>
      )}

      {/* Chart */}
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth === 'All' ? 'line' : 'bar'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {selectedMonth === 'All' ? renderLineChart() : renderBarChart()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default LineChartMonthly;