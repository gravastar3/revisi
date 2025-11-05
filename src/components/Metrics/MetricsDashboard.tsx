'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkinTypeMetrics, SkinType } from '@/types/skincare';
import { skinTypeMetrics } from '@/data/metricsData';

interface MetricsDashboardProps {
  selectedSkinType?: SkinType;
}

export function MetricsDashboard({ selectedSkinType }: MetricsDashboardProps) {
  const getEfficiencyScore = (metrics: SkinTypeMetrics[SkinType]): number => {
    // Calculate efficiency based on chromatic number and product count
    const idealRatio = 0.6; // Ideal ratio of chromatic number to product count
    const actualRatio = metrics.chromaticNumber / metrics.productCount;
    return Math.round((1 - Math.abs(actualRatio - idealRatio)) * 100);
  };

  const getComplexityLevel = (productCount: number): string => {
    if (productCount <= 7) return 'Sederhana';
    if (productCount <= 10) return 'Moderat';
    return 'Kompleks';
  };

  const getComplexityColor = (level: string): string => {
    switch (level) {
      case 'Sederhana': return 'bg-green-100 text-green-800';
      case 'Moderat': return 'bg-yellow-100 text-yellow-800';
      case 'Kompleks': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="60" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#3b82f6"
              className="hover:r-4 transition-all cursor-pointer"
              title={`${value}ms`}
            />
          );
        })}
      </svg>
    );
  };

  const computationTimes = Object.values(skinTypeMetrics).map(m => m.computationTime);

  if (selectedSkinType) {
    // Single skin type view
    const metrics = skinTypeMetrics[selectedSkinType];
    const efficiencyScore = getEfficiencyScore(metrics);
    const complexityLevel = getComplexityLevel(metrics.productCount);

    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Metrik {selectedSkinType.charAt(0).toUpperCase() + selectedSkinType.slice(1)}
          </h2>
          <p className="text-muted-foreground">
            Analisis performa dan kompleksitas graf pewarnaan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Jumlah Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.productCount}</div>
              <Badge className={getComplexityColor(complexityLevel)}>
                {complexityLevel}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Jumlah Konflik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conflictCount}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((metrics.conflictCount / (metrics.productCount * (metrics.productCount - 1) / 2)) * 100)}% densitas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Chromatic Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.chromaticNumber}</div>
              <div className="text-xs text-muted-foreground">
                Slot waktu unik
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Waktu Komputasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.computationTime}ms</div>
              <div className="text-xs text-muted-foreground">
                Sangat cepat
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Efisiensi Penjadwalan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{efficiencyScore}%</div>
                <div className="text-sm text-muted-foreground">
                  Skor efisiensi berdasarkan optimalisasi slot waktu
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Rasio Produk/Slot</div>
                <div className="text-lg font-semibold">
                  {(metrics.productCount / metrics.chromaticNumber).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Overview of all skin types
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Dashboard Metrik</h2>
        <p className="text-muted-foreground">
          Perbandingan performa semua tipe kulit
        </p>
      </div>

      {/* Computation Time Sparkline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tren Waktu Komputasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderSparkline(computationTimes)}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Normal</span>
              <span>Berminyak</span>
              <span>Kering</span>
              <span>Sensitif</span>
              <span>Kombinasi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(skinTypeMetrics).map(([skinType, metrics]) => {
          const efficiencyScore = getEfficiencyScore(metrics);
          const complexityLevel = getComplexityLevel(metrics.productCount);

          return (
            <Card key={skinType} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg capitalize">
                  {skinType === 'normal' ? 'Normal' :
                   skinType === 'oily' ? 'Berminyak' :
                   skinType === 'dry' ? 'Kering' :
                   skinType === 'sensitive' ? 'Sensitif' : 'Kombinasi'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold">{metrics.productCount}</div>
                    <div className="text-xs text-muted-foreground">Produk</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold">{metrics.conflictCount}</div>
                    <div className="text-xs text-muted-foreground">Konflik</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold">{metrics.chromaticNumber}</div>
                    <div className="text-xs text-muted-foreground">Slot</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold">{metrics.computationTime}ms</div>
                    <div className="text-xs text-muted-foreground">Waktu</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getComplexityColor(complexityLevel)}>
                    {complexityLevel}
                  </Badge>
                  <div className="text-sm font-medium">
                    Efisiensi: {efficiencyScore}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistik Ringkas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(Object.values(skinTypeMetrics).reduce((acc, m) => acc + m.productCount, 0) / 5)}
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata Produk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(Object.values(skinTypeMetrics).reduce((acc, m) => acc + m.conflictCount, 0) / 5)}
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata Konflik</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(Object.values(skinTypeMetrics).reduce((acc, m) => acc + m.chromaticNumber, 0) / 5)}
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata Slot</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...Object.values(skinTypeMetrics).map(m => m.computationTime))}ms
              </div>
              <div className="text-sm text-muted-foreground">Waktu Maks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MetricsDashboard;