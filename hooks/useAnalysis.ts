'use client';

import { useState, useCallback, useEffect } from 'react';
import { PriceData, Trade, AnalysisState, TechnicalAnalysis, SupportResistance } from '@/lib/analysis/types';
import { determineTrend, findSupportResistance, calculateSMA, calculateRSI, calculateMACD, calculateBollingerBands } from '@/lib/analysis/indicators';

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
  });

  const analyzeTechnical = useCallback((priceData: PriceData[]) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      if (priceData.length === 0) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'No price data available',
        }));
        return;
      }

      const closePrices = priceData.map((p) => p.close);
      const sma20 = calculateSMA(closePrices, 20);
      const sma50 = calculateSMA(closePrices, 50);
      const sma200 = calculateSMA(closePrices, 200);
      const rsi = calculateRSI(closePrices);
      const macd = calculateMACD(closePrices);
      const bollingerBands = calculateBollingerBands(closePrices);
      const trend = determineTrend(closePrices);
      const supportResistance = findSupportResistance(closePrices);

      const analysis: TechnicalAnalysis = {
        sma20: { name: 'SMA(20)', value: sma20 },
        sma50: { name: 'SMA(50)', value: sma50 },
        sma200: { name: 'SMA(200)', value: sma200 },
        rsi,
        macd,
        bollingerBands,
        trend,
      };

      setState((prev) => ({
        ...prev,
        technicalAnalysis: analysis,
        supportResistance,
        loading: false,
        error: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      }));
    }
  }, []);

  return {
    state,
    analyzeTechnical,
  };
}
