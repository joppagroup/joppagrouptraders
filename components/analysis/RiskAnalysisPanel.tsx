'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Trade } from '@/lib/analysis/types';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface RiskAnalysisPanelProps {
  trades: Trade[];
  accountBalance?: number;
}

export function RiskAnalysisPanel({
  trades,
  accountBalance = 10000,
}: RiskAnalysisPanelProps) {
  // Calculate drawdown series
  const closedTrades = trades
    .filter((t) => t.status === 'closed')
    .sort((a, b) => a.exitTime! - b.exitTime!);

  const drawdownData = React.useMemo(() => {
    let balance = accountBalance;
    let peakBalance = accountBalance;
    const data = [];

    for (const trade of closedTrades) {
      balance += trade.profitLoss;
      peakBalance = Math.max(peakBalance, balance);
      const drawdown = ((peakBalance - balance) / peakBalance) * 100;

      data.push({
        trade: data.length + 1,
        balance,
        drawdown,
        profitLoss: trade.profitLoss,
      });
    }

    return data;
  }, [closedTrades, accountBalance]);

  // Calculate volatility
  const returns = closedTrades.map((t) => t.returnPercentage);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const variance = returns.reduce(
    (sum, r) => sum + Math.pow(r - avgReturn, 2),
    0
  ) / (returns.length || 1);
  const volatility = Math.sqrt(variance) * 100;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let balance = accountBalance;
  let peakBalance = accountBalance;

  for (const trade of closedTrades) {
    balance += trade.profitLoss;
    peakBalance = Math.max(peakBalance, balance);
    const drawdown = peakBalance - balance;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }

  const maxDrawdownPercent = (maxDrawdown / accountBalance) * 100;

  // Risk level indicator
  const getRiskLevel = () => {
    if (volatility < 5) return { level: 'Low', color: 'bg-green-100 text-green-800' };
    if (volatility < 15) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (volatility < 30) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Very High', color: 'bg-red-100 text-red-800' };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Risk Level</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                riskLevel.color
              }`}>
                {riskLevel.level}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Volatility</span>
              </div>
              <p className="text-2xl font-bold">{volatility.toFixed(2)}%</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Max Drawdown</span>
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">{maxDrawdownPercent.toFixed(2)}%</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Max Loss</span>
              </div>
              <p className="text-2xl font-bold text-red-600">${maxDrawdown.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawdown Chart */}
      {drawdownData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Equity Curve & Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={drawdownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trade" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="balance"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                  name="Account Balance"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorDrawdown)"
                  name="Drawdown (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Risk Warnings */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {volatility > 20 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-800">⚠️ High Volatility</p>
                <p className="text-xs text-orange-700 mt-1">
                  Your portfolio volatility is {volatility.toFixed(2)}%, which is above normal levels.
                </p>
              </div>
            )}
            {maxDrawdownPercent > 20 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800">🔴 Significant Drawdown</p>
                <p className="text-xs text-red-700 mt-1">
                  Maximum drawdown is {maxDrawdownPercent.toFixed(2)}%. Consider reviewing your
                  risk management.
                </p>
              </div>
            )}
            {volatility < 5 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800">✓ Low Volatility</p>
                <p className="text-xs text-green-700 mt-1">Your portfolio shows stable returns.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
