import { SkinTypeMetrics } from '@/types/skincare';

export const skinTypeMetrics: SkinTypeMetrics = {
  normal: {
    productCount: 10,
    conflictCount: 6,
    chromaticNumber: 6,
    computationTime: 2.3
  },
  oily: {
    productCount: 9,
    conflictCount: 7,
    chromaticNumber: 5,
    computationTime: 2.1
  },
  dry: {
    productCount: 11,
    conflictCount: 5,
    chromaticNumber: 5,
    computationTime: 2.5
  },
  sensitive: {
    productCount: 7,
    conflictCount: 3,
    chromaticNumber: 4,
    computationTime: 1.8
  },
  combination: {
    productCount: 12,
    conflictCount: 8,
    chromaticNumber: 6,
    computationTime: 2.7
  }
};