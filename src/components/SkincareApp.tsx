'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkinTypeSelector } from '@/components/SkinTypeSelector';
import { SkincareGraph } from '@/components/GraphVisualization';
import { WeeklyGraph } from '@/components/GraphVisualization';
import { GraphLegend } from '@/components/GraphVisualization';
import { WeeklyScheduleView } from '@/components/ScheduleView';
import { SkinTypeSchedule } from '@/components/ScheduleView';
import { ProductCard } from '@/components/ProductInfo';
import { ConflictMatrix } from '@/components/ProductInfo';
import { MetricsDashboard } from '@/components/Metrics';
import { SkinTypeMetrics } from '@/components/Metrics';
import { SkinType, Product } from '@/types/skincare';
import { 
  products, 
  conflicts, 
  colorMapping
} from '@/data/skincareData';
import { 
  normalSkinGraphData
} from '@/data/graphData';
import { 
  normalSkinSchedule,
  oilySkinSchedule,
  drySkinSchedule,
  sensitiveSkinSchedule,
  normalColorAssignment
} from '@/data/scheduleData';
import { weeklyGraphs } from '@/data/weeklyGraphData';
import { exportToPDF, exportToCalendar, printSchedule, exportWeeklyGraphToPDF } from '@/utils/exportUtils';

export default function SkincareApp() {
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [activeTab, setActiveTab] = useState('selector');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive graph dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 40, 1200);
      const height = Math.min(window.innerHeight - 200, 600);
      setGraphDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Get schedule based on skin type
  const getScheduleForSkinType = (skinType: SkinType) => {
    switch (skinType) {
      case 'normal': return normalSkinSchedule;
      case 'oily': return oilySkinSchedule;
      case 'dry': return drySkinSchedule;
      case 'sensitive': return sensitiveSkinSchedule;
      case 'combination': return normalSkinSchedule; // Using normal as placeholder
      default: return normalSkinSchedule;
    }
  };

  // Get graph data based on skin type
  const getGraphDataForSkinType = (skinType: SkinType) => {
    // For now, using normal skin data for all types
    // In a real implementation, you'd have different graph data for each skin type
    return normalSkinGraphData;
  };

  // Handle skin type selection
  const handleSkinTypeSelect = (skinType: SkinType) => {
    setSelectedSkinType(skinType);
    setActiveTab('graph');
  };

  // Handle export functions
  const handleExportPDF = () => {
    if (selectedSkinType) {
      const schedule = getScheduleForSkinType(selectedSkinType);
      exportToPDF(schedule, selectedSkinType);
    }
  };

  const handleExportCalendar = () => {
    if (selectedSkinType) {
      const schedule = getScheduleForSkinType(selectedSkinType);
      exportToCalendar(schedule, selectedSkinType);
    }
  };

  const handlePrint = () => {
    if (selectedSkinType) {
      const schedule = getScheduleForSkinType(selectedSkinType);
      printSchedule(schedule, selectedSkinType);
    }
  };

  const handleWeeklyGraphExportPDF = () => {
    if (selectedSkinType) {
      const weeklyGraph = weeklyGraphs[selectedSkinType];
      exportWeeklyGraphToPDF(weeklyGraph);
    }
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day === selectedDay ? '' : day);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🧴 Skincare Scheduler
              </h1>
              <p className="text-sm text-gray-600">
                Aplikasi penjadwalan skincare berbasis teori graf pewarnaan
              </p>
            </div>
            {selectedSkinType && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Tipe Kulit: <strong>{selectedSkinType.charAt(0).toUpperCase() + selectedSkinType.slice(1)}</strong>
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedSkinType(null);
                    setActiveTab('selector');
                  }}
                >
                  Ganti
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!selectedSkinType ? (
          /* Skin Type Selection */
          <SkinTypeSelector 
            selectedSkinType={selectedSkinType}
            onSkinTypeSelect={handleSkinTypeSelect}
          />
        ) : (
          /* Main App with Tabs */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'}`}>
              <TabsTrigger value="graph">📊 Graf</TabsTrigger>
              <TabsTrigger value="weekly">📅 Weekly</TabsTrigger>
              <TabsTrigger value="schedule">📋 Jadwal</TabsTrigger>
              <TabsTrigger value="products">🧴 Produk</TabsTrigger>
              <TabsTrigger value="conflicts">⚠️ Konflik</TabsTrigger>
              <TabsTrigger value="metrics">📈 Metrik</TabsTrigger>
            </TabsList>

            {/* Original Graph Visualization Tab */}
            <TabsContent value="graph" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi Graf Konflik Produk</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Klik dan seret node untuk mengatur posisi. Hover untuk detail produk dan konflik.
                  </p>
                </CardHeader>
                <CardContent>
                  <SkincareGraph
                    nodes={getGraphDataForSkinType(selectedSkinType).nodes}
                    edges={getGraphDataForSkinType(selectedSkinType).edges}
                    products={products}
                    skinType={selectedSkinType}
                    width={graphDimensions.width}
                    height={graphDimensions.height}
                  />
                </CardContent>
              </Card>
              <GraphLegend />
            </TabsContent>

            {/* Weekly Graph Tab */}
            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Graf Jadwal Mingguan</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Visualisasi 7 hari dengan produk berwarna berdasarkan slot waktu
                      </p>
                    </CardHeader>
                    <CardContent>
                      <WeeklyGraph
                        weeklyGraph={weeklyGraphs[selectedSkinType]}
                        width={isMobile ? graphDimensions.width - 40 : graphDimensions.width * 0.65}
                        height={graphDimensions.height}
                        onNodeClick={(node) => {
                          console.log('Node clicked:', node);
                        }}
                        onExportClick={handleWeeklyGraphExportPDF}
                        selectedDay={selectedDay}
                        isMobile={isMobile}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <GraphLegend compact={true} />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kontrol Hari</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                          <Button
                            key={day}
                            variant={selectedDay === day.toLowerCase() ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleDaySelect(day.toLowerCase())}
                            className="text-xs"
                          >
                            {day.substring(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <WeeklyScheduleView
                schedule={getScheduleForSkinType(selectedSkinType)}
                onExportPDF={handleExportPDF}
                onExportCalendar={handleExportCalendar}
              />
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Informasi Produk</h2>
                <p className="text-muted-foreground">
                  Detail semua produk skincare yang digunakan
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const colorAssignment = normalColorAssignment.find(
                    ca => ca.node === product.name
                  );
                  const productConflicts = conflicts
                    .filter(c => c.productA === product.name || c.productB === product.name)
                    .map(c => c.productA === product.name ? c.productB : c.productA);
                  
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      colorIndex={colorAssignment?.color}
                      conflicts={productConflicts}
                    />
                  );
                })}
              </div>
            </TabsContent>

            {/* Conflicts Tab */}
            <TabsContent value="conflicts">
              <ConflictMatrix conflicts={conflicts} />
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <SkinTypeMetrics selectedSkinType={selectedSkinType} />
              <div className="mt-6">
                <MetricsDashboard />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Export Actions (shown when skin type is selected) */}
        {selectedSkinType && (
          <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
            <Button onClick={handlePrint} size="sm" variant="outline">
              🖨️ Print
            </Button>
            <Button onClick={handleExportPDF} size="sm" variant="outline">
              📄 PDF
            </Button>
            <Button onClick={handleExportCalendar} size="sm" variant="outline">
              📅 Kalender
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Skincare Scheduler - Aplikasi berbasis teori graf pewarnaan untuk optimalisasi jadwal perawatan kulit</p>
            <p className="mt-1">Dibuat dengan ❤️ menggunakan React, TypeScript, dan D3.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}