/**
 * Technical indicators calculation functions
 */

import { PriceData, TechnicalIndicator } from './types';

// Simple Moving Average
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

// Exponential Moving Average
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const multiplier = 2 / (period + 1);
  let ema = calculateSMA(prices.slice(0, period), period);
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

// Relative Strength Index
export function calculateRSI(prices: number[], period: number = 14): TechnicalIndicator {
  if (prices.length < period) return { name: 'RSI', value: 0 };
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return {
    name: 'RSI',
    value: isNaN(rsi) ? 50 : rsi,
  };
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(prices: number[]): TechnicalIndicator {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA(prices, 9);
  const histogram = macdLine - signalLine;
  
  return {
    name: 'MACD',
    value: macdLine,
    signal: signalLine,
    histogram: histogram,
  };
}

// Bollinger Bands
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
) {
  const sma = calculateSMA(prices, period);
  const lastPrices = prices.slice(-period);
  
  const variance =
    lastPrices.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) /
    period;
  const std = Math.sqrt(variance);
  
  return {
    upper: sma + std * stdDev,
    middle: sma,
    lower: sma - std * stdDev,
  };
}

// Average True Range (for volatility)
export function calculateATR(
  priceData: PriceData[],
  period: number = 14
): number {
  if (priceData.length < period) return 0;
  
  const trueRanges: number[] = [];
  
  for (let i = 1; i < priceData.length; i++) {
    const current = priceData[i];
    const previous = priceData[i - 1];
    
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    
    trueRanges.push(tr);
  }
  
  const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
  return atr;
}

// Determine trend based on moving averages
export function determineTrend(
  prices: number[]
): 'bullish' | 'bearish' | 'neutral' {
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const currentPrice = prices[prices.length - 1];
  
  if (
    sma20 > sma50 &&
    sma50 > sma200 &&
    currentPrice > sma20
  ) {
    return 'bullish';
  }
  
  if (
    sma20 < sma50 &&
    sma50 < sma200 &&
    currentPrice < sma20
  ) {
    return 'bearish';
  }
  
  return 'neutral';
}

// Support and Resistance levels
export function findSupportResistance(
  prices: number[],
  lookback: number = 30
) {
  const recentPrices = prices.slice(-lookback);
  const support: number[] = [];
  const resistance: number[] = [];
  
  const localMin = Math.min(...recentPrices);
  const localMax = Math.max(...recentPrices);
  const range = localMax - localMin;
  
  // Generate support levels
  for (let i = 1; i <= 3; i++) {
    support.push(localMin + (range * i) / 4);
  }
  
  // Generate resistance levels
  for (let i = 1; i <= 3; i++) {
    resistance.push(localMax - (range * i) / 4);
  }
  
  return {
    support: support.sort((a, b) => a - b),
    resistance: resistance.sort((a, b) => b - a),
  };
}
