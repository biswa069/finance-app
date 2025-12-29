import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Transaction } from '../types';

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

interface Props {
  transactions: Transaction[];
}

const CategoryChart: React.FC<Props> = ({ transactions }) => {
  // 1. Group Data by Category
  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};

    transactions.forEach(tx => {
      // Only count expenses (negative amounts)
      if (tx.amount < 0) {
        const category = tx.category || 'Uncategorized';
        // Convert to positive number for the chart
        const amount = Math.abs(tx.amount);
        categories[category] = (categories[category] || 0) + amount;
      }
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Expenses ($)',
          data: Object.values(categories),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [transactions]);

  if (transactions.length === 0) return <p className="text-muted text-center">No data to display</p>;

  return (
    <div className="card p-4 shadow-sm h-100">
      <h4 className="mb-3">💸 Spending Breakdown</h4>
      <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
        <Doughnut 
            data={chartData} 
            options={{ maintainAspectRatio: false }} 
        />
      </div>
    </div>
  );
};

export default CategoryChart;