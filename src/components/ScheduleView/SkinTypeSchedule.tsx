'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkinType, WeeklyGraph } from '@/types/skincare';
import { weeklyGraphs } from '@/data/weeklyGraphData';
import { getWeeklyStats } from '@/utils/scheduleGraphLogic';

interface SkinTypeScheduleProps {
  selectedSkinType: SkinType | null;
  onSkinTypeSelect: (skinType: SkinType) => void;
  onExportPDF?: (skinType: SkinType) => void;
}

const skinTypeConfig = [
  {
    type: 'normal' as SkinType,
    title: 'Kulit Normal',
    description: 'Seimbang, tidak terlalu berminyak atau kering',
    icon: '😊',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'oily' as SkinType,
    title: 'Kulit Berminyak',
    description: 'Produksi sebum berlebih, cenderung berkilap',
    icon: '💧',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    type: 'dry' as SkinType,
    title: 'Kulit Kering',
    description: 'Kekurangan kelembaban, terasa kencang',
    icon: '🍂',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    type: 'sensitive' as SkinType,
    title: 'Kulit Sensitif',
    description: 'Mudah iritasi, kemerahan, dan reaktif',
    icon: '🌸',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    type: 'combination' as SkinType,
    title: 'Kulit Kombinasi',
    description: 'Berminyak di zona T, normal/kering di area lain',
    icon: '🎭',
    color: 'bg-purple-100 text-purple-800'
  }
];

export function SkinTypeSchedule({ 
  selectedSkinType, 
  onSkinTypeSelect, 
  onExportPDF 
}: SkinTypeScheduleProps) {
  const [activeTab, setActiveTab] = useState<SkinType | 'overview'>(
    selectedSkinType || 'overview'
  );

  const handleSkinTypeChange = (skinType: SkinType) => {
    setActiveTab(skinType);
    onSkinTypeSelect(skinType);
  };

  const renderSkinTypeOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skinTypeConfig.map((config) => {
        const stats = getWeeklyStats(config.type);
        const isSelected = selectedSkinType === config.type;
        
        return (
          <Card 
            key={config.type}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'
            }`}
            onClick={() => handleSkinTypeChange(config.type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{config.icon}</span>
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                </div>
                <Badge className={config.color}>
                  {stats.chromaticNumber} slot
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{config.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{stats.totalNodes}</div>
                  <div className="text-muted-foreground">Produk</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{stats.conflictEdges}</div>
                  <div className="text-muted-foreground">Konflik</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{stats.chromaticNumber}</div>
                  <div className="text-muted-foreground">Chromatic</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{stats.computationTime}</div>
                  <div className="text-muted-foreground">Waktu</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {stats.nodesByTimeSlot.morning} pagi / {stats.nodesByTimeSlot.evening} malam
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkinTypeChange(config.type);
                  }}
                >
                  Lihat Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderSkinTypeDetail = (skinType: SkinType) => {
    const config = skinTypeConfig.find(c => c.type === skinType);
    const stats = getWeeklyStats(skinType);
    const weeklyGraph = weeklyGraphs[skinType];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{config?.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{config?.title}</h2>
              <p className="text-muted-foreground">{config?.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onExportPDF?.(skinType)}
            >
              📄 Export PDF
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab('overview')}
            >
              Kembali
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalNodes}</div>
              <div className="text-sm text-muted-foreground">Total Produk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.conflictEdges}</div>
              <div className="text-sm text-muted-foreground">Konflik</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.chromaticNumber}</div>
              <div className="text-sm text-muted-foreground">Chromatic Number</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.computationTime}</div>
              <div className="text-sm text-muted-foreground">Waktu Komputasi</div>
            </CardContent>
          </Card>
        </div>

        {/* Day-wise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Produk Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, index) => {
                const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
                const productCount = stats.nodesByDay[dayKey] || 0;
                
                return (
                  <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm">{day}</div>
                    <div className="text-2xl font-bold text-primary mt-1">{productCount}</div>
                    <div className="text-xs text-muted-foreground">produk</div>
                  </div>
                );
              })}
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
              {Object.entries(stats.colorGroups).map(([colorGroup, count]) => (
                <div key={colorGroup} className="text-center p-3 border rounded-lg">
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 border border-gray-300"
                    style={{ 
                      backgroundColor: `hsl(${(parseInt(colorGroup) - 1) * 60}, 70%, 80%)` 
                    }}
                  />
                  <div className="font-medium">Slot {colorGroup}</div>
                  <div className="text-sm text-muted-foreground">{count} produk</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {weeklyGraph.nodes.map((node) => (
                <div key={node.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: `hsl(${(node.colorGroup - 1) * 60}, 70%, 80%)` 
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{node.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {node.day} - {node.timeSlot === 'morning' ? 'Pagi' : 'Malam'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SkinType | 'overview')}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          {skinTypeConfig.map((config) => (
            <TabsTrigger key={config.type} value={config.type}>
              {config.icon} {config.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Jadwal Skincare Mingguan</h2>
              <p className="text-muted-foreground">
                Pilih tipe kulit untuk melihat visualisasi graf dan jadwal detail
              </p>
            </div>
            {renderSkinTypeOverview()}
          </div>
        </TabsContent>

        {skinTypeConfig.map((config) => (
          <TabsContent key={config.type} value={config.type} className="mt-6">
            {renderSkinTypeDetail(config.type)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default SkinTypeSchedule;