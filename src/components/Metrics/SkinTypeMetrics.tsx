'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkinType } from '@/types/skincare';
import { skinTypeMetrics } from '@/data/metricsData';
import { getWeeklyStats } from '@/utils/scheduleGraphLogic';

interface SkinTypeMetricsProps {
  selectedSkinType?: SkinType;
  showComparison?: boolean;
}

export function SkinTypeMetrics({ selectedSkinType, showComparison = false }: SkinTypeMetricsProps) {
  const getEfficiencyScore = (metrics: any): number => {
    const idealRatio = 0.6;
    const actualRatio = metrics.chromaticNumber / metrics.totalNodes;
    return Math.round((1 - Math.abs(actualRatio - idealRatio)) * 100);
  };

  const getComplexityLevel = (productCount: number): { level: string; color: string } => {
    if (productCount <= 7) return { level: 'Sederhana', color: 'bg-green-100 text-green-800' };
    if (productCount <= 10) return { level: 'Moderat', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Kompleks', color: 'bg-red-100 text-red-800' };
  };

  const renderMetricCard = (title: string, value: string | number, subtitle?: string, color?: string) => (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${color || ''}`}>{value}</div>
        <div className="text-sm font-medium mt-1">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </CardContent>
    </Card>
  );

  const renderProgressBar = (value: number, max: number, label: string, color: string) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <Progress value={(value / max) * 100} className="h-2" />
    </div>
  );

  if (selectedSkinType && !showComparison) {
    // Single skin type detailed view
    const metrics = skinTypeMetrics[selectedSkinType];
    const weeklyStats = getWeeklyStats(selectedSkinType);
    const efficiencyScore = getEfficiencyScore(weeklyStats);
    const complexity = getComplexityLevel(metrics.productCount);

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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderMetricCard("Produk Total", metrics.productCount, "Aktif digunakan")}
          {renderMetricCard("Konflik", metrics.conflictCount, "Hubungan konflik", "text-red-600")}
          {renderMetricCard("Chromatic Number", metrics.chromaticNumber, "Slot waktu unik", "text-blue-600")}
          {renderMetricCard("Waktu Komputasi", `${metrics.computationTime}ms`, "Sangat cepat", "text-green-600")}
        </div>

        {/* Efficiency Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analisis Efisiensi
              <Badge className={complexity.color}>{complexity.level}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{efficiencyScore}%</div>
                <div className="text-sm text-muted-foreground">Skor Efisiensi</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Berdasarkan optimalisasi slot waktu
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {(metrics.productCount / metrics.chromaticNumber).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Rasio Produk/Slot</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Optimal: 1.5 - 2.0
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {renderProgressBar(
                weeklyStats.nodesByTimeSlot.morning, 
                weeklyStats.totalNodes, 
                "Produk Pagi", 
                "bg-blue-500"
              )}
              {renderProgressBar(
                weeklyStats.nodesByTimeSlot.evening, 
                weeklyStats.totalNodes, 
                "Produk Malam", 
                "bg-purple-500"
              )}
              {renderProgressBar(
                weeklyStats.conflictEdges, 
                weeklyStats.totalEdges, 
                "Edge Konflik", 
                "bg-red-500"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Color Group Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Grup Warna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(weeklyStats.colorGroups).map(([colorGroup, count]) => (
                <div key={colorGroup} className="text-center p-3 border rounded-lg">
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 border border-gray-300"
                    style={{ 
                      backgroundColor: `hsl(${(parseInt(colorGroup) - 1) * 60}, 70%, 80%)` 
                    }}
                  />
                  <div className="font-medium">Slot {colorGroup}</div>
                  <div className="text-sm text-muted-foreground">{count} produk</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((count / weeklyStats.totalNodes) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insight Performa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.computationTime < 2 ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span>
                  <strong>Kecepatan:</strong> {metrics.computationTime < 2 ? 'Sangat cepat' : 'Cepat'} 
                  ({metrics.computationTime}ms)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.conflictCount < 5 ? 'bg-green-500' : 
                  metrics.conflictCount < 8 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span>
                  <strong>Konflik:</strong> {
                    metrics.conflictCount < 5 ? 'Rendah' :
                    metrics.conflictCount < 8 ? 'Sedang' : 'Tinggi'
                  } ({metrics.conflictCount} konflik)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  efficiencyScore > 80 ? 'bg-green-500' : 
                  efficiencyScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span>
                  <strong>Efisiensi:</strong> {
                    efficiencyScore > 80 ? 'Sangat efisien' :
                    efficiencyScore > 60 ? 'Efisien' : 'Perlu optimasi'
                  } ({efficiencyScore}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showComparison) {
    // Comparison view for all skin types
    return (
      <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Perbandingan Metrik Semua Tipe Kulit</h2>
          <p className="text-muted-foreground">
            Analisis komprehensif performa setiap tipe kulit
          </p>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tabel Perbandingan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Tipe Kulit</th>
                    <th className="text-center p-2">Produk</th>
                    <th className="text-center p-2">Konflik</th>
                    <th className="text-center p-2">Chromatic</th>
                    <th className="text-center p-2">Waktu (ms)</th>
                    <th className="text-center p-2">Efisiensi</th>
                    <th className="text-center p-2">Kompleksitas</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(skinTypeMetrics) as SkinType[]).map((skinType) => {
                    const metrics = skinTypeMetrics[skinType];
                    const weeklyStats = getWeeklyStats(skinType);
                    const efficiencyScore = getEfficiencyScore(weeklyStats);
                    const complexity = getComplexityLevel(metrics.productCount);
                    
                    return (
                      <tr key={skinType} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium capitalize">
                          {skinType === 'normal' ? 'Normal' :
                           skinType === 'oily' ? 'Berminyak' :
                           skinType === 'dry' ? 'Kering' :
                           skinType === 'sensitive' ? 'Sensitif' : 'Kombinasi'}
                        </td>
                        <td className="text-center p-2">{metrics.productCount}</td>
                        <td className="text-center p-2">
                          <span className={metrics.conflictCount > 6 ? 'text-red-600 font-medium' : ''}>
                            {metrics.conflictCount}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="text-blue-600 font-medium">{metrics.chromaticNumber}</span>
                        </td>
                        <td className="text-center p-2">{metrics.computationTime}</td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center space-x-1">
                            <span>{efficiencyScore}%</span>
                            <div className={`w-2 h-2 rounded-full ${
                              efficiencyScore > 80 ? 'bg-green-500' : 
                              efficiencyScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge className={complexity.color} variant="secondary">
                            {complexity.level}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(skinTypeMetrics) as SkinType[]).map((skinType) => {
            const metrics = skinTypeMetrics[skinType];
            const weeklyStats = getWeeklyStats(skinType);
            const efficiencyScore = getEfficiencyScore(weeklyStats);
            
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
                  <div className="grid grid-cols-2 gap-2">
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
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Efisiensi</span>
                      <span className="text-sm font-bold">{efficiencyScore}%</span>
                    </div>
                    <Progress value={efficiencyScore} className="h-2 mt-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

export default SkinTypeMetrics;