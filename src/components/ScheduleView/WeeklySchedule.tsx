'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeeklySchedule } from '@/types/skincare';
import { DailyRoutine } from './DailyRoutine';
import { scheduleInteractions } from '@/data/scheduleData';

interface WeeklyScheduleProps {
  schedule: WeeklySchedule;
  onExportPDF: () => void;
  onExportCalendar: () => void;
}

export function WeeklyScheduleView({ 
  schedule, 
  onExportPDF, 
  onExportCalendar 
}: WeeklyScheduleProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const getProductUsageStats = () => {
    const productCount: { [key: string]: number } = {};
    
    Object.values(schedule).forEach(daySchedule => {
      [...daySchedule.morning, ...daySchedule.evening].forEach(product => {
        productCount[product] = (productCount[product] || 0) + 1;
      });
    });

    return Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const mostUsedProducts = getProductUsageStats();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Jadwal Mingguan Skincare</h2>
        <p className="text-muted-foreground mb-4">
          Rutinitas perawatan kulit yang disesuaikan dengan tipe kulit Anda
        </p>
        
        {/* Export Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={onExportPDF} variant="outline">
            📄 Export PDF
          </Button>
          <Button onClick={onExportCalendar} variant="outline">
            📅 Export Kalender
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(Object.values(schedule).flatMap(day => [...day.morning, ...day.evening])).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Frekuensi Paling Tinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {mostUsedProducts[0]?.[0] || '-'}
            </div>
            <div className="text-sm text-muted-foreground">
              {mostUsedProducts[0]?.[1] || 0}x/minggu
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rata-rata Produk/Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                Object.values(schedule).reduce((acc, day) => 
                  acc + day.morning.length + day.evening.length, 0
                ) / 7
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map(day => (
          <DailyRoutine
            key={day}
            day={day}
            schedule={schedule[day]}
            isOpen={expandedDays.has(day)}
            onToggle={() => toggleDayExpansion(day)}
          />
        ))}
      </div>

      {/* Most Used Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produk Paling Sering Digunakan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mostUsedProducts.map(([product, count], index) => (
              <div key={product} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <span className="text-sm">{product}</span>
                </div>
                <Badge variant="secondary">{count}x</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Petunjuk Penggunaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Klik tombol "Detail" untuk melihat penjelasan setiap produk</p>
            <p>• Ikuti urutan aplikasi produk sesuai nomor urut</p>
            <p>• Tunggu 2-3 menit antara produk untuk penyerapan optimal</p>
            <p>• Gunakan sunscreen setiap hari untuk perlindungan UV</p>
            <p>• Sesuaikan frekuensi sesuai respons kulit Anda</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WeeklyScheduleView;