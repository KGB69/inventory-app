import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface FinancialSummary {
  revenue: number;
  cogs: number;
  totalOutflows: number;
  grossProfit: number;
  netProfit: number;
  operatingExpenses: number;
}

interface DashboardProps {
  summary: FinancialSummary;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-brand-secondary p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <p className="text-brand-light text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-brand-text">{formatCurrency(value)}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ summary }) => {
  const { revenue, cogs, totalOutflows, netProfit, operatingExpenses } = summary;
  const netProfitColor = netProfit >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="space-y-8">
        <div className="bg-brand-secondary p-8 rounded-lg shadow-lg text-center">
            <p className="text-brand-light text-lg font-medium">Net Profit</p>
            <p className={`text-6xl font-bold my-2 ${netProfitColor}`}>{formatCurrency(netProfit)}</p>
            <p className="text-brand-light">Your overall financial performance for the selected period.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={revenue} icon={TrendingUp} color="bg-green-500/80" />
            <StatCard title="Cost of Goods Sold" value={cogs} icon={TrendingDown} color="bg-yellow-500/80" />
            <StatCard title="Operating Expenses" value={operatingExpenses} icon={Receipt} color="bg-red-500/80" />
            <StatCard title="Total Outflows" value={totalOutflows} icon={DollarSign} color="bg-orange-500/80" />
        </div>
    </div>
  );
};

export default Dashboard;