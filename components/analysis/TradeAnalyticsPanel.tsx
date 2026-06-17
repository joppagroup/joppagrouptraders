'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Trade } from '@/lib/analysis/types';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface TradeAnalyticsPanelProps {
  trades: Trade[];
}

export function TradeAnalyticsPanel({ trades }: TradeAnalyticsPanelProps) {
  const closedTrades = trades
    .filter((t) => t.status === 'closed')
    .sort((a, b) => b.exitTime! - a.exitTime!);

  // Group trades by hour
  const tradesByHour = React.useMemo(() => {
    const hourMap: { [key: number]: { wins: number; losses: number; profit: number } } = {};

    for (let i = 0; i < 24; i++) {
      hourMap[i] = { wins: 0, losses: 0, profit: 0 };
    }

    for (const trade of closedTrades) {
      const hour = new Date(trade.exitTime! * 1000).getHours();
      if (trade.profitLoss > 0) {
        hourMap[hour].wins++;
      } else if (trade.profitLoss < 0) {
        hourMap[hour].losses++;
      }
      hourMap[hour].profit += trade.profitLoss;
    }

    return Object.entries(hourMap).map(([hour, data]) => ({
      hour: `${hour}:00`,
      wins: data.wins,
      losses: data.losses,
      profit: data.profit,
    }));
  }, [closedTrades]);

  // Contract type breakdown
  const contractTypeData = React.useMemo(() => {
    const typeMap: { [key: string]: { count: number; profit: number; winRate: number } } = {};

    for (const trade of closedTrades) {
      if (!typeMap[trade.contractType]) {
        typeMap[trade.contractType] = { count: 0, profit: 0, winRate: 0 };
      }
      typeMap[trade.contractType].count++;
      typeMap[trade.contractType].profit += trade.profitLoss;
    }

    return Object.entries(typeMap).map(([type, data]) => {
      const winCount = closedTrades
        .filter(
          (t) => t.contractType === type && t.profitLoss > 0
        ).length;
      const winRate = data.count > 0 ? (winCount / data.count) * 100 : 0;

      return {
        type,
        count: data.count,
        profit: data.profit,
        winRate,
      };
    });
  }, [closedTrades]);

  return (
    <div className="space-y-6">
      {/* Trade Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Total Trades"
              value={closedTrades.length}
              icon={<Calendar className="w-4 h-4" />}
            />
            <SummaryCard
              label="Winning Trades"
              value={closedTrades.filter((t) => t.profitLoss > 0).length}
              valueColor="text-green-600"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <SummaryCard
              label="Losing Trades"
              value={closedTrades.filter((t) => t.profitLoss < 0).length}
              valueColor="text-red-600"
              icon={<TrendingDown className="w-4 h-4" />}
            />
            <SummaryCard
              label="Total Profit/Loss"
              value={`$${closedTrades.reduce((sum, t) => sum + t.profitLoss, 0).toFixed(2)}`}
              valueColor={
                closedTrades.reduce((sum, t) => sum + t.profitLoss, 0) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Trades by Hour */}
      {tradesByHour.some((d) => d.wins > 0 || d.losses > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Trades by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tradesByHour} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" stackId="a" fill="#10b981" name="Wins" />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Contract Type Performance */}
      {contractTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance by Contract Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractTypeData.map((item, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{item.type}</span>
                    <span className={item.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${item.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.count} trades</span>
                    <span>{item.winRate.toFixed(2)}% win rate</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Trades Table */}
      {closedTrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedTrades.slice(0, 10).map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="text-xs">
                        {new Date(trade.exitTime! * 1000).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            trade.type === 'CALL'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trade.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">${(trade.exitPrice || 0).toFixed(2)}</TableCell>
                      <TableCell
                        className={`font-semibold ${
                          trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ${trade.profitLoss.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${
                          trade.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {trade.returnPercentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  icon?: React.ReactNode;
}

function SummaryCard({ label, value, valueColor = 'text-foreground', icon }: SummaryCardProps) {
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
