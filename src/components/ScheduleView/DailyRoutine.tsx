'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DailySchedule } from '@/types/skincare';

interface DailyRoutineProps {
  day: string;
  schedule: DailySchedule;
  isOpen: boolean;
  onToggle: () => void;
}

export function DailyRoutine({ day, schedule, isOpen, onToggle }: DailyRoutineProps) {
  const getProductExplanation = (product: string, timeSlot: 'morning' | 'evening'): string => {
    const explanations: { [key: string]: { [key: string]: string } } = {
      'Cleanser': {
        morning: 'Membersihkan wajah dari kotoran dan minyak yang terakumulasi semalam',
        evening: 'Membersihkan wajah dari makeup, polusi, dan kotoran hari ini'
      },
      'Toner': {
        morning: 'Mengembalikan pH kulit dan mempersiapkan untuk produk selanjutnya',
        evening: 'Menghidrasi dan menenangkan kulit setelah pembersihan'
      },
      'Vitamin C Serum': {
        morning: 'Antioksidan melindungi dari radikal bebas dan mencerahkan kulit',
        evening: 'Tidak direkomendasikan di malam hari untuk menghindari iritasi'
      },
      'Moisturizer': {
        morning: 'Mengunci kelembapan dan melindungi skin barrier',
        evening: 'Memperbaiki skin barrier saat tidur'
      },
      'Sunscreen': {
        morning: 'Melindungi dari kerusakan akibat sinar UV',
        evening: 'Tidak diperlukan di malam hari'
      },
      'Niacinamide Serum': {
        morning: 'Mengontrol produksi sebum dan mengurangi pori-pori',
        evening: 'Membantu regenerasi sel dan menenangkan inflamasi'
      },
      'Retinol Serum': {
        morning: 'Tidak direkomendasikan karena membuat kulit sensitif terhadap sinar matahari',
        evening: 'Merangsang produksi kolagen dan mempercepat turnover sel'
      },
      'AHA/BHA Exfoliant': {
        morning: 'Tidak direkomendasikan karena membuat kulit sensitif terhadap sinar matahari',
        evening: 'Mengangkat sel kulit mati dan membersihkan pori-pori'
      },
      'Clay Mask': {
        morning: 'Tidak direkomendasikan karena bisa membuat kulit kering',
        evening: 'Menyerap minyak berlebih dan membersihkan pori-pori secara mendalam'
      },
      'Hydrating Mask': {
        morning: 'Bisa digunakan untuk kelembapan ekstra sebelum makeup',
        evening: 'Memberikan hidrasi intensif dan memperbaiki skin barrier'
      }
    };

    return explanations[product]?.[timeSlot] || 'Produk perawatan kulit';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{day}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`${day}-routine`}
          >
            {isOpen ? 'Sembunyikan' : 'Detail'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Morning Routine */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">🌅 Pagi</span>
            <Badge variant="secondary" className="text-xs">
              {schedule.morning.length} produk
            </Badge>
          </div>
          <div className="space-y-1">
            {schedule.morning.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-blue-600">
                    {index + 1}.
                  </span>
                  <span className="text-sm">{product}</span>
                </div>
                {isOpen && (
                  <span className="text-xs text-gray-600 max-w-xs text-right">
                    {getProductExplanation(product, 'morning')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evening Routine */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">🌙 Malam</span>
            <Badge variant="secondary" className="text-xs">
              {schedule.evening.length} produk
            </Badge>
          </div>
          <div className="space-y-1">
            {schedule.evening.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-purple-600">
                    {index + 1}.
                  </span>
                  <span className="text-sm">{product}</span>
                </div>
                {isOpen && (
                  <span className="text-xs text-gray-600 max-w-xs text-right">
                    {getProductExplanation(product, 'evening')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyRoutine;