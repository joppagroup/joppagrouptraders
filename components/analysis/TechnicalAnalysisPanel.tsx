'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PriceData, TechnicalAnalysis } from '@/lib/analysis/types';
import {
  calculateSMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  determineTrend,
} from '@/lib/analysis/indicators';

interface TechnicalAnalysisPanelProps {
  priceData: PriceData[];
}

export function TechnicalAnalysisPanel({
  priceData,
}: TechnicalAnalysisPanelProps) {
  const analysis = useMemo(() => {
    if (priceData.length === 0) return null;

    const closePrices = priceData.map((p) => p.close);

    const sma20 = calculateSMA(closePrices, 20);
    const sma50 = calculateSMA(closePrices, 50);
    const sma200 = calculateSMA(closePrices, 200);
    const rsi = calculateRSI(closePrices);
    const macd = calculateMACD(closePrices);
    const bollingerBands = calculateBollingerBands(closePrices);
    const trend = determineTrend(closePrices);

    return {
      sma20: { name: 'SMA(20)', value: sma20 },
      sma50: { name: 'SMA(50)', value: sma50 },
      sma200: { name: 'SMA(200)', value: sma200 },
      rsi,
      macd,
      bollingerBands,
      trend,
    } as TechnicalAnalysis;
  }, [priceData]);

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (analysis.trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (analysis.trend) {
      case 'bullish':
        return 'text-green-600 bg-green-50';
      case 'bearish':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend */}
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${getTrendColor()}`}
        >
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className="font-semibold capitalize">{analysis.trend} Trend</span>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">SMA(20)</p>
            <p className="text-lg font-semibold">{analysis.sma20.value.toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">SMA(50)</p>
            <p className="text-lg font-semibold">{analysis.sma50.value.toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">SMA(200)</p>
            <p className="text-lg font-semibold">{analysis.sma200.value.toFixed(2)}</p>
          </div>
        </div>

        {/* RSI */}
        <div className="p-3 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold">RSI(14)</p>
            <p className="text-lg font-bold">{analysis.rsi.value.toFixed(2)}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                analysis.rsi.value > 70
                  ? 'bg-red-500'
                  : analysis.rsi.value < 30
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(analysis.rsi.value, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Oversold (30)</span>
            <span>Neutral (50)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        {/* MACD */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">MACD Line</p>
            <p className="text-lg font-semibold">{analysis.macd.value.toFixed(4)}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">Signal</p>
            <p className="text-lg font-semibold">{analysis.macd.signal?.toFixed(4)}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground">Histogram</p>
            <p className="text-lg font-semibold">{analysis.macd.histogram?.toFixed(4)}</p>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="border rounded-lg p-3">
          <p className="text-sm font-semibold mb-3">Bollinger Bands</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Upper Band</span>
              <span className="font-semibold">{
                analysis.bollingerBands.upper.toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Middle Band (SMA)</span>
              <span className="font-semibold">{
                analysis.bollingerBands.middle.toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lower Band</span>
              <span className="font-semibold">{
                analysis.bollingerBands.lower.toFixed(2)
              }</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
