'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Trade } from '@/lib/analysis/types';
import { generatePortfolioAnalysis } from '@/lib/analysis/portfolio';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioAnalysisPanelProps {
  trades: Trade[];
  accountBalance?: number;
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function PortfolioAnalysisPanel({
  trades,
  accountBalance = 10000,
}: PortfolioAnalysisPanelProps) {
  const analysis = useMemo(
    () => generatePortfolioAnalysis(trades, accountBalance),
    [trades, accountBalance]
  );

  const performanceData = useMemo(() => {
    const { metrics } = analysis;
    return [
      {
        name: 'Wins',
        value: metrics.winningTrades,
        color: '#10b981',
      },
      {
        name: 'Losses',
        value: metrics.losingTrades,
        color: '#ef4444',
      },
    ];
  }, [analysis]);

  return (
    <div className="space-y-6">
      {/* Portfolio Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              label="Total Trades"
              value={analysis.metrics.totalTrades}
              icon={<div className="w-4 h-4 bg-blue-500 rounded" />}
            />
            <MetricCard
              label="Win Rate"
              value={`${analysis.metrics.winRate.toFixed(2)}%`}
              icon={<TrendingUp className="w-4 h-4 text-green-500" />}
            />
            <MetricCard
              label="Profit Factor"
              value={analysis.metrics.profitFactor.toFixed(2)}
              icon={<div className="w-4 h-4 bg-green-500 rounded" />}
            />
            <MetricCard
              label="Total P&L"
              value={`$${analysis.metrics.totalProfitLoss.toFixed(2)}`}
              valueColor={
                analysis.metrics.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }
              icon={<TrendingDown className="w-4 h-4 text-orange-500" />}
            />
            <MetricCard
              label="Avg Win"
              value={`$${analysis.metrics.averageWin.toFixed(2)}`}
              valueColor="text-green-600"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <MetricCard
              label="Avg Loss"
              value={`$${analysis.metrics.averageLoss.toFixed(2)}`}
              valueColor="text-red-600"
              icon={<TrendingDown className="w-4 h-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Win/Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Win/Loss Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      {analysis.allocation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.allocation.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-sm">{asset.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{asset.percentage.toFixed(2)}%</div>
                    <div className="text-xs text-muted-foreground">${asset.value.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              label="Volatility"
              value={`${(analysis.riskMetrics.volatility * 100).toFixed(2)}%`}
              icon={<div className="w-4 h-4 bg-orange-500 rounded" />}
            />
            <MetricCard
              label="Max Drawdown"
              value={`${analysis.riskMetrics.maxDrawdownPercentage.toFixed(2)}%`}
              valueColor="text-red-600"
              icon={<TrendingDown className="w-4 h-4" />}
            />
            <MetricCard
              label="Sharpe Ratio"
              value={analysis.riskMetrics.sharpeRatio.toFixed(2)}
              icon={<div className="w-4 h-4 bg-purple-500 rounded" />}
            />
            <MetricCard
              label="Sortino Ratio"
              value={analysis.riskMetrics.sortinoRatio.toFixed(2)}
              icon={<div className="w-4 h-4 bg-indigo-500 rounded" />}
            />
            <MetricCard
              label="Risk/Reward"
              value={analysis.riskMetrics.riskRewardRatio.toFixed(2)}
              icon={<div className="w-4 h-4 bg-cyan-500 rounded" />}
            />
            <MetricCard
              label="Value at Risk"
              value={`${(analysis.riskMetrics.valueAtRisk * 100).toFixed(2)}%`}
              valueColor="text-red-600"
              icon={<div className="w-4 h-4 bg-red-500 rounded" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  icon?: React.ReactNode;
}

function MetricCard({ label, value, valueColor = 'text-foreground', icon }: MetricCardProps) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}
