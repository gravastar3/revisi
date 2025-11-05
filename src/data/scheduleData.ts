import { WeeklySchedule, ColorAssignment, ScheduleInteractions } from '@/types/skincare';

export const normalSkinSchedule: WeeklySchedule = {
  'Senin': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol Serum', 'Moisturizer']
  },
  'Selasa': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'AHA/BHA Exfoliant', 'Moisturizer']
  },
  'Rabu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol Serum', 'Moisturizer']
  },
  'Kamis': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'AHA/BHA Exfoliant', 'Moisturizer']
  },
  'Jumat': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol Serum', 'Moisturizer']
  },
  'Sabtu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Clay Mask', 'Moisturizer']
  },
  'Minggu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Hydrating Mask', 'Niacinamide Serum', 'Moisturizer']
  }
};

export const oilySkinSchedule: WeeklySchedule = {
  'Senin': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'BHA 2%', 'Moisturizer']
  },
  'Selasa': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol Serum', 'Moisturizer']
  },
  'Rabu': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'BHA 2%', 'Moisturizer']
  },
  'Kamis': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol Serum', 'Moisturizer']
  },
  'Jumat': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'BHA 2%', 'Moisturizer']
  },
  'Sabtu': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Clay Mask', 'Moisturizer']
  },
  'Minggu': {
    morning: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer (oil-free)', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer']
  }
};

export const drySkinSchedule: WeeklySchedule = {
  'Senin': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer', 'Facial Oil']
  },
  'Selasa': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'AHA 5%', 'Moisturizer', 'Facial Oil']
  },
  'Rabu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer', 'Facial Oil']
  },
  'Kamis': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Retinol 0.025%', 'Moisturizer', 'Facial Oil']
  },
  'Jumat': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Niacinamide Serum', 'Moisturizer', 'Facial Oil']
  },
  'Sabtu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Hydrating Mask', 'Moisturizer', 'Facial Oil']
  },
  'Minggu': {
    morning: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen'],
    evening: ['Cleanser', 'Toner', 'Hydrating Mask', 'Moisturizer', 'Facial Oil']
  }
};

export const sensitiveSkinSchedule: WeeklySchedule = {
  'Senin': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Moisturizer', 'Barrier Repair Cream']
  },
  'Selasa': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Moisturizer', 'Barrier Repair Cream']
  },
  'Rabu': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Moisturizer', 'Barrier Repair Cream']
  },
  'Kamis': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'AHA 5%', 'Moisturizer']
  },
  'Jumat': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Moisturizer', 'Barrier Repair Cream']
  },
  'Sabtu': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Hydrating Mask', 'Moisturizer']
  },
  'Minggu': {
    morning: ['Cleanser (gentle)', 'Toner', 'Niacinamide 5%', 'Moisturizer', 'Sunscreen (mineral)'],
    evening: ['Cleanser', 'Toner', 'Moisturizer', 'Barrier Repair Cream']
  }
};

export const normalColorAssignment: ColorAssignment[] = [
  { node: 'Cleanser', color: 1, timeSlot: 'morning', days: 'Setiap hari' },
  { node: 'Toner', color: 1, timeSlot: 'morning', days: 'Setiap hari' },
  { node: 'Vitamin C Serum', color: 2, timeSlot: 'morning', days: 'Setiap hari' },
  { node: 'Moisturizer', color: 1, timeSlot: 'morning', days: 'Setiap hari' },
  { node: 'Sunscreen', color: 2, timeSlot: 'morning', days: 'Setiap hari' },
  { node: 'Niacinamide Serum', color: 3, timeSlot: 'evening', days: 'Setiap hari' },
  { node: 'Retinol Serum', color: 4, timeSlot: 'evening', days: 'Senin, Rabu, Jumat' },
  { node: 'AHA/BHA Exfoliant', color: 5, timeSlot: 'evening', days: 'Selasa, Kamis' },
  { node: 'Clay Mask', color: 6, timeSlot: 'evening', days: 'Sabtu' },
  { node: 'Hydrating Mask', color: 4, timeSlot: 'evening', days: 'Minggu' }
];

export const scheduleInteractions: ScheduleInteractions = {
  onDayClick: "expand to show detailed morning/evening routine",
  onProductClick: "show why it's scheduled at that time",
  onTimeSlotHover: "show optimal usage explanation",
  exportFunction: "PDF and calendar export"
};