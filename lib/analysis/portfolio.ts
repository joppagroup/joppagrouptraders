/**
 * Portfolio analysis functions
 */

import { Trade, PortfolioMetrics, RiskMetrics, PortfolioAnalysis } from './types';

// Calculate portfolio metrics
export function calculatePortfolioMetrics(trades: Trade[]): PortfolioMetrics {
  const closedTrades = trades.filter((t) => t.status === 'closed');
  const winningTrades = closedTrades.filter((t) => t.profitLoss > 0);
  const losingTrades = closedTrades.filter((t) => t.profitLoss < 0);
  
  const totalProfitLoss = closedTrades.reduce((sum, t) => sum + t.profitLoss, 0);
  const totalReturn = closedTrades.length > 0 
    ? (totalProfitLoss / closedTrades.length) 
    : 0;
  
  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + t.profitLoss, 0) / winningTrades.length
    : 0;
  
  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0) / losingTrades.length)
    : 0;
  
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
  
  // Calculate consecutive wins/losses
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  
  for (const trade of closedTrades) {
    if (trade.profitLoss > 0) {
      consecutiveWins++;
      consecutiveLosses = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
    } else {
      consecutiveLosses++;
      consecutiveWins = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
    }
  }
  
  return {
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
    totalProfitLoss,
    totalReturn,
    averageWin: avgWin,
    averageLoss: avgLoss,
    profitFactor,
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
  };
}

// Calculate risk metrics
export function calculateRiskMetrics(
  trades: Trade[],
  accountBalance: number = 10000
): RiskMetrics {
  const closedTrades = trades.filter((t) => t.status === 'closed');
  
  if (closedTrades.length === 0) {
    return {
      volatility: 0,
      maxDrawdown: 0,
      maxDrawdownPercentage: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
      riskRewardRatio: 0,
      valueAtRisk: 0,
    };
  }
  
  // Calculate returns
  const returns = closedTrades.map((t) => t.returnPercentage);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  // Calculate volatility (standard deviation)
  const variance = returns.reduce(
    (sum, r) => sum + Math.pow(r - avgReturn, 2),
    0
  ) / returns.length;
  const volatility = Math.sqrt(variance);
  
  // Calculate maximum drawdown
  let runningMax = 0;
  let maxDrawdown = 0;
  let balance = accountBalance;
  
  for (const trade of closedTrades) {
    balance += trade.profitLoss;
    runningMax = Math.max(runningMax, balance);
    const drawdown = runningMax - balance;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  const maxDrawdownPercentage = (maxDrawdown / accountBalance) * 100;
  
  // Calculate Sharpe Ratio (assuming 0% risk-free rate)
  const sharpeRatio = volatility > 0 ? avgReturn / volatility : 0;
  
  // Calculate Sortino Ratio (only downside volatility)
  const negativeReturns = returns.filter((r) => r < 0);
  const downVariance = negativeReturns.length > 0
    ? negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
    : 0;
  const downVolatility = Math.sqrt(downVariance);
  const sortinoRatio = downVolatility > 0 ? avgReturn / downVolatility : 0;
  
  // Risk/Reward Ratio
  const winTrades = closedTrades.filter((t) => t.profitLoss > 0);
  const lossTrades = closedTrades.filter((t) => t.profitLoss < 0);
  const avgWin = winTrades.length > 0
    ? winTrades.reduce((sum, t) => sum + t.profitLoss, 0) / winTrades.length
    : 0;
  const avgLoss = lossTrades.length > 0
    ? Math.abs(
        lossTrades.reduce((sum, t) => sum + t.profitLoss, 0) / lossTrades.length
      )
    : 0;
  const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;
  
  // Value at Risk (95% confidence)
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const var95Index = Math.floor(sortedReturns.length * 0.05);
  const valueAtRisk = Math.abs(sortedReturns[var95Index] || 0);
  
  return {
    volatility,
    maxDrawdown,
    maxDrawdownPercentage,
    sharpeRatio,
    sortinoRatio,
    riskRewardRatio,
    valueAtRisk,
  };
}

// Generate portfolio analysis
export function generatePortfolioAnalysis(
  trades: Trade[],
  accountBalance: number = 10000
): PortfolioAnalysis {
  const metrics = calculatePortfolioMetrics(trades);
  const riskMetrics = calculateRiskMetrics(trades, accountBalance);
  
  const closedTrades = trades.filter((t) => t.status === 'closed');
  const topProfitable = closedTrades
    .sort((a, b) => b.profitLoss - a.profitLoss)
    .slice(0, 5);
  
  const recentTrades = closedTrades
    .sort((a, b) => b.exitTime! - a.exitTime!)
    .slice(0, 10);
  
  // Asset allocation (simplified)
  const allocation = [];
  const assetMap: { [key: string]: number } = {};
  let totalValue = 0;
  
  for (const trade of trades) {
    if (!assetMap[trade.contractType]) {
      assetMap[trade.contractType] = 0;
    }
    assetMap[trade.contractType] += trade.profitLoss;
    totalValue += Math.abs(trade.profitLoss);
  }
  
  for (const [symbol, value] of Object.entries(assetMap)) {
    allocation.push({
      symbol,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      value,
    });
  }
  
  return {
    metrics,
    riskMetrics,
    topProfitable,
    recentTrades,
    allocation,
  };
}
