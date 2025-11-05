'use client';

import React from 'react';
import { SkinTypeCard } from './SkinTypeCard';
import { SkinType } from '@/types/skincare';

interface SkinTypeSelectorProps {
  selectedSkinType: SkinType | null;
  onSkinTypeSelect: (skinType: SkinType) => void;
}

const skinTypes = [
  {
    type: 'normal' as SkinType,
    title: 'Kulit Normal',
    description: 'Seimbang, tidak terlalu berminyak atau kering. Pori-pori tidak terlihat jelas.',
    icon: '😊'
  },
  {
    type: 'oily' as SkinType,
    title: 'Kulit Berminyak',
    description: 'Produksi sebum berlebih, kilap, dan pori-pori yang terlihat jelas.',
    icon: '💧'
  },
  {
    type: 'dry' as SkinType,
    title: 'Kulit Kering',
    description: 'Kekurangan kelembaban, terasa kencang, dan kadang bersisik.',
    icon: '🍂'
  },
  {
    type: 'sensitive' as SkinType,
    title: 'Kulit Sensitif',
    description: 'Mudah iritasi, kemerahan, dan reaksi terhadap produk tertentu.',
    icon: '🌸'
  },
  {
    type: 'combination' as SkinType,
    title: 'Kulit Kombinasi',
    description: 'Berminyak di zona T (dahi, hidung, dagu) dan normal/kering di area lain.',
    icon: '🎭'
  }
];

export function SkinTypeSelector({ selectedSkinType, onSkinTypeSelect }: SkinTypeSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Pilih Tipe Kulit Anda</h2>
        <p className="text-muted-foreground">
          Pilih tipe kulit Anda untuk melihat jadwal perawatan skincare yang tepat
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {skinTypes.map((skinType) => (
          <SkinTypeCard
            key={skinType.type}
            skinType={skinType.type}
            title={skinType.title}
            description={skinType.description}
            icon={skinType.icon}
            isSelected={selectedSkinType === skinType.type}
            onSelect={onSkinTypeSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default SkinTypeSelector;