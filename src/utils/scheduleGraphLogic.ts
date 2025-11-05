import { WeeklyGraph, WeeklyGraphNode, WeeklyGraphEdge, SkinType, DaySegment } from '@/types/skincare';
import { weeklyGraphs } from '@/data/weeklyGraphData';
import { colorMapping } from '@/data/skincareData';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function generateWeeklyGraph(skinType: SkinType): WeeklyGraph {
  return weeklyGraphs[skinType];
}

export function calculateDaySegments(centerX: number, centerY: number, radius: number): DaySegment[] {
  const segmentAngle = (2 * Math.PI) / 7;
  
  return days.map((day, index) => {
    const angle = index * segmentAngle - Math.PI / 2; // Start from top
    const startAngle = angle - segmentAngle / 2;
    const endAngle = angle + segmentAngle / 2;
    
    return {
      day,
      angle,
      startAngle,
      endAngle
    };
  });
}

export function calculateNodePosition(
  node: WeeklyGraphNode,
  centerX: number,
  centerY: number,
  radius: number,
  daySegments: DaySegment[]
): { x: number; y: number } {
  const daySegment = daySegments.find(ds => ds.day === node.day);
  if (!daySegment) return { x: centerX, y: centerY };
  
  const segmentAngle = (daySegment.endAngle - daySegment.startAngle) / 2;
  const midAngle = daySegment.startAngle + segmentAngle;
  
  // Position nodes within the day segment
  const timeSlotOffset = node.timeSlot === 'morning' ? -0.3 : 0.3;
  const adjustedAngle = midAngle + timeSlotOffset * (daySegment.endAngle - daySegment.startAngle);
  
  // Vary radius based on position in sequence
  const nodeCountForDay = weeklyGraphs.normal.nodes.filter(n => n.day === node.day).length;
  const nodeIndex = weeklyGraphs.normal.nodes
    .filter(n => n.day === node.day)
    .findIndex(n => n.id === node.id);
  
  const radiusVariation = (nodeIndex - (nodeCountForDay - 1) / 2) * 15;
  const finalRadius = radius + radiusVariation;
  
  return {
    x: centerX + finalRadius * Math.cos(adjustedAngle),
    y: centerY + finalRadius * Math.sin(adjustedAngle)
  };
}

export function calculateConflicts(skinType: SkinType): number {
  const graph = weeklyGraphs[skinType];
  return graph.edges.filter(edge => edge.relation === 'conflict').length;
}

export function getConnectedNodes(nodeId: number, edges: WeeklyGraphEdge[]): number[] {
  const connected = new Set<number>();
  
  edges.forEach(edge => {
    if (edge.from === nodeId) {
      connected.add(edge.to);
    } else if (edge.to === nodeId) {
      connected.add(edge.from);
    }
  });
  
  return Array.from(connected);
}

export function getEdgeColor(relation: WeeklyGraphEdge['relation']): string {
  switch (relation) {
    case 'same-day': return '#9ca3af'; // Gray
    case 'adjacent-day': return '#60a5fa'; // Blue, dashed
    case 'conflict': return '#ef4444'; // Red
    default: return '#9ca3af';
  }
}

export function getEdgeStroke(relation: WeeklyGraphEdge['relation']): string {
  return relation === 'adjacent-day' ? '5,5' : '0';
}

export function getNodeColor(colorGroup: number): string {
  return colorMapping[colorGroup as keyof typeof colorMapping] || '#e5e7eb';
}

export function getProductInfo(productName: string) {
  // This would typically come from your products data
  const productInfo: Record<string, { ingredients: string; function: string }> = {
    'Cleanser': { ingredients: 'Surfaktan ringan', function: 'Pembersihan' },
    'Toner': { ingredients: 'Hyaluronic Acid, Niacinamide', function: 'Hidrasi dan pH balance' },
    'Vitamin C Serum': { ingredients: 'Ascorbic Acid (10-20%)', function: 'Antioksidan, brightening' },
    'Niacinamide Serum': { ingredients: 'Niacinamide (5-10%)', function: 'Kontrol sebum, brightening' },
    'Retinol Serum': { ingredients: 'Retinol (0.025-0.1%)', function: 'Anti-aging, cell turnover' },
    'AHA/BHA Exfoliant': { ingredients: 'Glycolic/Salicylic Acid', function: 'Eksfoliasi kimia' },
    'Moisturizer': { ingredients: 'Ceramide, Hyaluronic Acid', function: 'Hidrasi dan barrier repair' },
    'Sunscreen': { ingredients: 'SPF 30-50+', function: 'Proteksi UV' },
    'Clay Mask': { ingredients: 'Kaolin, Bentonite', function: 'Deep cleansing' },
    'Hydrating Mask': { ingredients: 'Hyaluronic Acid, Aloe Vera', function: 'Hidrasi intensif' }
  };
  
  return productInfo[productName] || { ingredients: 'Unknown', function: 'Unknown' };
}

export function exportSchedulePDF(skinType: SkinType): void {
  // This will be implemented in the export utilities
  console.log(`Exporting PDF for ${skinType} skin type`);
}

export function animateToDaySegment(selectedDay: string, svgElement: SVGSVGElement): void {
  if (!svgElement) return;
  
  const g = svgElement.querySelector('g.main-graph');
  if (!g) return;
  
  // Calculate rotation to focus on selected day
  const dayIndex = days.indexOf(selectedDay);
  const segmentAngle = (2 * Math.PI) / 7;
  const targetRotation = -(dayIndex * segmentAngle * 180 / Math.PI) - 90;
  
  g.style.transition = 'transform 0.5s ease-in-out';
  g.style.transform = `rotate(${targetRotation}deg)`;
  
  // Reset after 3 seconds
  setTimeout(() => {
    g.style.transition = 'transform 0.5s ease-in-out';
    g.style.transform = 'rotate(0deg)';
  }, 3000);
}

export function getWeeklyStats(skinType: SkinType) {
  const graph = weeklyGraphs[skinType];
  const nodesByDay = days.reduce((acc, day) => {
    acc[day] = graph.nodes.filter(n => n.day === day).length;
    return acc;
  }, {} as Record<string, number>);
  
  const nodesByTimeSlot = {
    morning: graph.nodes.filter(n => n.timeSlot === 'morning').length,
    evening: graph.nodes.filter(n => n.timeSlot === 'evening').length
  };
  
  const colorGroups = graph.nodes.reduce((acc, node) => {
    acc[node.colorGroup] = (acc[node.colorGroup] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    conflictEdges: graph.edges.filter(e => e.relation === 'conflict').length,
    sameDayEdges: graph.edges.filter(e => e.relation === 'same-day').length,
    adjacentDayEdges: graph.edges.filter(e => e.relation === 'adjacent-day').length,
    nodesByDay,
    nodesByTimeSlot,
    colorGroups,
    chromaticNumber: graph.chromaticNumber,
    computationTime: graph.computationTime
  };
}