'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colorMapping } from '@/data/skincareData';

interface GraphLegendProps {
  showColorGroups?: boolean;
  showEdgeTypes?: boolean;
  compact?: boolean;
}

export function GraphLegend({ 
  showColorGroups = true, 
  showEdgeTypes = true, 
  compact = false 
}: GraphLegendProps) {
  const colorGroupInfo = [
    { color: 1, name: 'Produk Dasar', products: ['Cleanser', 'Toner', 'Moisturizer'], description: 'Digunakan setiap hari' },
    { color: 2, name: 'Produk Pagi', products: ['Vitamin C Serum', 'Sunscreen'], description: 'Rutinitas pagi hari' },
    { color: 3, name: 'Niacinamide', products: ['Niacinamide Serum'], description: 'Kontrol sebum dan brightening' },
    { color: 4, name: 'Retinol & Mask', products: ['Retinol Serum', 'Hydrating Mask'], description: 'Perawatan malam khusus' },
    { color: 5, name: 'Eksfolian', products: ['AHA/BHA Exfoliant'], description: 'Pengelupasan kimia' },
    { color: 6, name: 'Masker', products: ['Clay Mask'], description: 'Perawatan deep cleansing' }
  ];

  const edgeTypeInfo = [
    { type: 'same-day' as const, color: '#9ca3af', label: 'Hari yang Sama', description: 'Produk dalam rutinitas yang sama' },
    { type: 'adjacent-day' as const, color: '#60a5fa', label: 'Hari Berdekatan', description: 'Hubungan antar hari', dash: true },
    { type: 'conflict' as const, color: '#ef4444', label: 'Konflik', description: 'Produk tidak boleh digunakan bersamaan' }
  ];

  if (compact) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Legenda Warna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(colorMapping).map(([colorNum, color]) => (
            <div key={colorNum} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">Slot {colorNum}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Color Groups Legend */}
      {showColorGroups && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grup Warna Produk</CardTitle>
            <p className="text-sm text-muted-foreground">
              Warna menunjukkan slot waktu penggunaan berdasarkan hasil pewarnaan graf
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorGroupInfo.map((group) => (
                <div key={group.color} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: colorMapping[group.color as keyof typeof colorMapping] }}
                    />
                    <div>
                      <h4 className="font-medium text-sm">Slot {group.color}</h4>
                      <p className="text-xs text-muted-foreground">{group.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 ml-11">{group.description}</p>
                  <div className="ml-11">
                    <Badge variant="outline" className="text-xs">
                      {group.products.join(', ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edge Types Legend */}
      {showEdgeTypes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipe Hubungan</CardTitle>
            <p className="text-sm text-muted-foreground">
              Garis menunjukkan hubungan antar produk dalam jadwal mingguan
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {edgeTypeInfo.map((edge) => (
                <div key={edge.type} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-0 border-t-2 relative">
                      {edge.dash && (
                        <div className="absolute inset-0 border-t-2 border-dashed" 
                             style={{ borderColor: edge.color }} />
                      )}
                      {!edge.dash && (
                        <div className="absolute inset-0 border-t-2" 
                             style={{ borderColor: edge.color }} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{edge.label}</h4>
                    <p className="text-xs text-muted-foreground">{edge.description}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: edge.color }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Petunjuk Penggunaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Hover node:</strong> Lihat detail produk dan waktu penggunaan</p>
            <p>• <strong>Klik node:</strong> Sorot hubungan dan jalur penggunaan</p>
            <p>• <strong>Hover edge:</strong> Lihat tipe hubungan antar produk</p>
            <p>• <strong>Pilih hari:</strong> Fokus pada segmen hari tertentu</p>
            <p>• <strong>Warna sama:</strong> Produk dapat digunakan dalam slot waktu yang sama</p>
            <p>• <strong>Garis merah:</strong> Produk memiliki konflik dan harus dipisah</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GraphLegend;