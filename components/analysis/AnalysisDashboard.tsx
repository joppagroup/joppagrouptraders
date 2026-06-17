'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicalAnalysisPanel } from './TechnicalAnalysisPanel';
import { PortfolioAnalysisPanel } from './PortfolioAnalysisPanel';
import { RiskAnalysisPanel } from './RiskAnalysisPanel';
import { TradeAnalyticsPanel } from './TradeAnalyticsPanel';
import { PriceData, Trade } from '@/lib/analysis/types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface AnalysisDashboardProps {
  priceData: PriceData[];
  trades: Trade[];
  accountBalance?: number;
}

export function AnalysisDashboard({
  priceData,
  trades,
  accountBalance = 10000,
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <div className="w-full space-y-6">
      {/* Dashboard Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analysis Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Technical</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Technical Analysis */}
        <TabsContent value="technical" className="space-y-6">
          <TechnicalAnalysisPanel priceData={priceData} />
        </TabsContent>

        {/* Portfolio Analysis */}
        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioAnalysisPanel trades={trades} accountBalance={accountBalance} />
        </TabsContent>

        {/* Risk Analysis */}
        <TabsContent value="risk" className="space-y-6">
          <RiskAnalysisPanel trades={trades} accountBalance={accountBalance} />
        </TabsContent>

        {/* Trade Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <TradeAnalyticsPanel trades={trades} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
