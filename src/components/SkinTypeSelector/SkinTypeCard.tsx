'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkinType } from '@/types/skincare';

interface SkinTypeCardProps {
  skinType: SkinType;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: (skinType: SkinType) => void;
}

export function SkinTypeCard({
  skinType,
  title,
  description,
  icon,
  isSelected,
  onSelect
}: SkinTypeCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'
      }`}
      onClick={() => onSelect(skinType)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(skinType);
        }
      }}
      aria-pressed={isSelected}
      aria-describedby={`${skinType}-description`}
    >
      <CardHeader className="text-center pb-2">
        <div className="text-4xl mb-2" role="img" aria-label={`${title} icon`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription 
          id={`${skinType}-description`}
          className="text-sm text-center"
        >
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default SkinTypeCard;