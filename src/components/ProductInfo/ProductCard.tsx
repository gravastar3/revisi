'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/skincare';
import { colorMapping } from '@/data/skincareData';

interface ProductCardProps {
  product: Product;
  colorIndex?: number;
  conflicts?: string[];
  isSelected?: boolean;
  onClick?: () => void;
}

export function ProductCard({
  product,
  colorIndex,
  conflicts = [],
  isSelected = false,
  onClick
}: ProductCardProps) {
  const getFrequencyColor = (frequency: string): string => {
    if (frequency.includes('2x/hari')) return 'bg-green-100 text-green-800';
    if (frequency.includes('1x/hari')) return 'bg-blue-100 text-blue-800';
    if (frequency.includes('minggu')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (conflictList: string[]): string => {
    if (conflictList.length === 0) return 'bg-green-100 text-green-800';
    if (conflictList.length >= 3) return 'bg-red-100 text-red-800';
    if (conflictList.length >= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
          {colorIndex && (
            <div 
              className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
              style={{ backgroundColor: colorMapping[colorIndex as keyof typeof colorMapping] }}
              title={`Slot Warna ${colorIndex}`}
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Active Ingredients */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Bahan Aktif</h4>
          <p className="text-sm">{product.activeIngredients}</p>
        </div>

        {/* Function */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Fungsi</h4>
          <p className="text-sm">{product.function}</p>
        </div>

        {/* Frequency */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Frekuensi</h4>
          <Badge className={getFrequencyColor(product.frequency)}>
            {product.frequency}
          </Badge>
        </div>

        {/* Conflicts */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Konflik</h4>
          {conflicts.length > 0 ? (
            <div className="space-y-1">
              <Badge className={getSeverityColor(conflicts)}>
                {conflicts.length} konflik
              </Badge>
              <div className="text-xs text-gray-600">
                {conflicts.slice(0, 3).join(', ')}
                {conflicts.length > 3 && ` +${conflicts.length - 3} lainnya`}
              </div>
            </div>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Tidak ada konflik
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;