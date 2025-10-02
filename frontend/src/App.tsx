import { useState } from 'react';
import KpiCard from './components/KpiCardDashboard';
import type { EquityData, DailyPnLData, PeriodPnLData, DrawdownData } from './components/KpiCardDashboard';

// Mock data for demonstration
const mockEquityData: EquityData = {
  balance: 50000.00,
  unrealizedPnL: 2500.00,
  totalEquity: 52500.00,
  changePercent: 5.26,
  changeAmount: 2500.00,
};

const mockDailyData: DailyPnLData = {
  realized: 1200.00,
  unrealized: 800.00,
  total: 2000.00,
  changePercent: 4.17,
};

const mockPeriodData: PeriodPnLData = {
  today: 2000.00,
  todayChangePercent: 4.17,
  mtd: 15000.00,
  mtdDelta: 3000.00,
  mtdChangePercent: 25.00,
  ytd: 45000.00,
  ytdDelta: 12000.00,
  ytdChangePercent: 36.36,
};

const mockDrawdownData: DrawdownData = {
  currentDrawdown: 2000.00,
  maxDrawdown: 5000.00,
  drawdownRatio: 0.40,
  currentDrawdownPercent: 3.81,
  maxDrawdownPercent: 9.09,
  peakEquity: 55000.00,
  currentEquity: 52500.00,
  recoveryPercent: 60.00,
};

// Utility functions
const formatCurrency = (value: number, options?: { abbreviated?: boolean }): string => {
  if (options?.abbreviated) {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

function App() {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">KPIs Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            variant="equity"
            data={mockEquityData}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
            defaultExpanded={false}
          />
          
          <KpiCard
            variant="daily"
            data={mockDailyData}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
            defaultExpanded={false}
          />
          
          <KpiCard
            variant="period"
            data={mockPeriodData}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
            defaultExpanded={false}
          />
          
          <KpiCard
            variant="drawdown"
            data={mockDrawdownData}
            isLoading={isLoading}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
            defaultExpanded={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
