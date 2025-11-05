import { Product, Conflict } from '@/types/skincare';

export const products: Product[] = [
  {
    id: 1,
    name: 'Cleanser',
    activeIngredients: 'Surfaktan ringan',
    function: 'Pembersihan',
    frequency: '2x/hari (pagi dan malam)'
  },
  {
    id: 2,
    name: 'Toner',
    activeIngredients: 'Hyaluronic Acid, Niacinamide',
    function: 'Hidrasi dan pH balance',
    frequency: '2x/hari (pagi dan malam)'
  },
  {
    id: 3,
    name: 'Vitamin C Serum',
    activeIngredients: 'Ascorbic Acid (10-20%)',
    function: 'Antioksidan, brightening',
    frequency: '1x/hari (pagi)'
  },
  {
    id: 4,
    name: 'Niacinamide Serum',
    activeIngredients: 'Niacinamide (5-10%)',
    function: 'Kontrol sebum, brightening',
    frequency: '1x/hari'
  },
  {
    id: 5,
    name: 'Retinol Serum',
    activeIngredients: 'Retinol (0.025-0.1%)',
    function: 'Anti-aging, cell turnover',
    frequency: '2-3x/minggu (malam)'
  },
  {
    id: 6,
    name: 'AHA/BHA Exfoliant',
    activeIngredients: 'Glycolic/Salicylic Acid',
    function: 'Eksfoliasi kimia',
    frequency: '2-3x/minggu (malam)'
  },
  {
    id: 7,
    name: 'Moisturizer',
    activeIngredients: 'Ceramide, Hyaluronic Acid',
    function: 'Hidrasi dan barrier repair',
    frequency: '2x/hari (pagi dan malam)'
  },
  {
    id: 8,
    name: 'Sunscreen',
    activeIngredients: 'SPF 30-50+',
    function: 'Proteksi UV',
    frequency: '1x/hari (pagi)'
  },
  {
    id: 9,
    name: 'Clay Mask',
    activeIngredients: 'Kaolin, Bentonite',
    function: 'Deep cleansing',
    frequency: '1-2x/minggu'
  },
  {
    id: 10,
    name: 'Hydrating Mask',
    activeIngredients: 'Hyaluronic Acid, Aloe Vera',
    function: 'Hidrasi intensif',
    frequency: '2-3x/minggu'
  }
];

export const conflicts: Conflict[] = [
  {
    productA: 'Vitamin C Serum',
    productB: 'Retinol Serum',
    severity: 'high',
    mechanism: 'Destabilisasi pH, reduksi efektivitas'
  },
  {
    productA: 'Vitamin C Serum',
    productB: 'AHA/BHA Exfoliant',
    severity: 'medium',
    mechanism: 'Over-exfoliation, pH incompatibility'
  },
  {
    productA: 'Retinol Serum',
    productB: 'AHA/BHA Exfoliant',
    severity: 'high',
    mechanism: 'Iritasi berlebihan, barrier damage'
  },
  {
    productA: 'Niacinamide Serum',
    productB: 'Vitamin C Serum (pH rendah)',
    severity: 'medium',
    mechanism: 'Potensi nicotinic acid formation'
  },
  {
    productA: 'AHA/BHA Exfoliant',
    productB: 'Clay Mask',
    severity: 'medium',
    mechanism: 'Over-drying, iritasi'
  },
  {
    productA: 'Retinol Serum',
    productB: 'Clay Mask',
    severity: 'high',
    mechanism: 'Oxidative degradation'
  }
];

export const colorMapping = {
  1: '#FFADAD', // Merah muda - Produk dasar
  2: '#A0C4FF', // Biru muda - Produk pagi
  3: '#BDB2FF', // Ungu muda - Niacinamide
  4: '#FFD6A5', // Oranye - Retinol & Hydrating Mask
  5: '#CAFFBF', // Hijau muda - AHA/BHA
  6: '#9BF6FF'  // Biru hijau - Clay Mask
};