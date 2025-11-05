'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Conflict } from '@/types/skincare';

interface ConflictMatrixProps {
  conflicts: Conflict[];
  selectedProduct?: string;
  onProductSelect?: (product: string) => void;
}

export function ConflictMatrix({ 
  conflicts, 
  selectedProduct, 
  onProductSelect 
}: ConflictMatrixProps) {
  // Get all unique products from conflicts
  const allProducts = Array.from(new Set(
    conflicts.flatMap(c => [c.productA, c.productB])
  )).sort();

  // Filter conflicts if a product is selected
  const filteredConflicts = selectedProduct
    ? conflicts.filter(c => c.productA === selectedProduct || c.productB === selectedProduct)
    : conflicts;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getConflictCount = (product: string): number => {
    return conflicts.filter(c => c.productA === product || c.productB === product).length;
  };

  const getConflictPartners = (product: string): string[] => {
    const partners = new Set<string>();
    conflicts.forEach(c => {
      if (c.productA === product) partners.add(c.productB);
      if (c.productB === product) partners.add(c.productA);
    });
    return Array.from(partners);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Matriks Konflik Produk</h2>
        <p className="text-muted-foreground">
          Visualisasi interaksi dan konflik antar produk skincare
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Konflik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conflicts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Produk Terlibat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProducts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Konflik Tinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {conflicts.filter(c => c.severity === 'high').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product List with Conflict Counts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produk dengan Konflik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allProducts.map(product => {
              const conflictCount = getConflictCount(product);
              const isSelected = selectedProduct === product;
              
              return (
                <div
                  key={product}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => onProductSelect?.(isSelected ? undefined : product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onProductSelect?.(isSelected ? undefined : product);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{product}</span>
                    <Badge 
                      variant={conflictCount > 0 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {conflictCount}
                    </Badge>
                  </div>
                  {conflictCount > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Konflik dengan: {getConflictPartners(product).slice(0, 2).join(', ')}
                      {getConflictPartners(product).length > 2 && ` +${getConflictPartners(product).length - 2}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedProduct ? `Konflik ${selectedProduct}` : 'Detail Konflik'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredConflicts.length > 0 ? (
            <div className="space-y-3">
              {filteredConflicts.map((conflict, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSeverityIcon(conflict.severity)}</span>
                      <div className="font-medium">
                        {conflict.productA} ↔ {conflict.productB}
                      </div>
                    </div>
                    <Badge className={getSeverityColor(conflict.severity)}>
                      {conflict.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Mekanisme:</strong> {conflict.mechanism}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedProduct 
                ? `Tidak ada konflik ditemukan untuk ${selectedProduct}`
                : 'Pilih produk untuk melihat detail konflik'
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔴</span>
              <div>
                <div className="font-medium text-sm">Tinggi</div>
                <div className="text-xs text-gray-600">Hindari penggunaan bersama</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟡</span>
              <div>
                <div className="font-medium text-sm">Sedang</div>
                <div className="text-xs text-gray-600">Pisahkan waktu aplikasi</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟢</span>
              <div>
                <div className="font-medium text-sm">Rendah</div>
                <div className="text-xs text-gray-600">Monitor respons kulit</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConflictMatrix;