export type SkinType = 'normal' | 'oily' | 'dry' | 'sensitive' | 'combination';

export type ConflictSeverity = 'low' | 'medium' | 'high';

export type TimeSlot = 'morning' | 'evening';

export interface Product {
  id: number;
  name: string;
  activeIngredients: string;
  function: string;
  frequency: string;
}

export interface Conflict {
  productA: string;
  productB: string;
  severity: ConflictSeverity;
  mechanism: string;
}

export interface ColorAssignment {
  node: string;
  color: number;
  timeSlot: TimeSlot;
  days: string;
}

export interface DailySchedule {
  morning: string[];
  evening: string[];
}

export interface WeeklySchedule {
  [key: string]: DailySchedule;
}

export interface GraphNode {
  id: string;
  name: string;
  x?: number;
  y?: number;
  color: number;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  severity: ConflictSeverity;
  mechanism: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SkinTypeData {
  products: Product[];
  conflicts: Conflict[];
  colorAssignment: ColorAssignment[];
  schedule: WeeklySchedule;
  graphData: GraphData;
}

export interface Metrics {
  productCount: number;
  conflictCount: number;
  chromaticNumber: number;
  computationTime: number;
}

export interface SkinTypeMetrics {
  [key in SkinType]: Metrics;
}

export interface GraphInteractions {
  onNodeHover: string;
  onNodeClick: string;
  onEdgeHover: string;
  nodeDragging: string;
  zoomPan: string;
}

export interface ScheduleInteractions {
  onDayClick: string;
  onProductClick: string;
  onTimeSlotHover: string;
  exportFunction: string;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface LayoutState {
  [key: string]: NodePosition;
}

// Weekly Graph Visualization Types
export interface WeeklyGraphNode {
  id: number;
  name: string;
  day: string; // monday - sunday
  timeSlot: TimeSlot;
  colorGroup: number;
  x?: number;
  y?: number;
}

export interface WeeklyGraphEdge {
  from: number;
  to: number;
  relation: 'same-day' | 'adjacent-day' | 'conflict';
}

export interface WeeklyGraph {
  skinType: SkinType;
  nodes: WeeklyGraphNode[];
  edges: WeeklyGraphEdge[];
  chromaticNumber: number;
  computationTime: string;
}

export interface WeeklyGraphInteractions {
  onDaySelect: string;
  onNodeHover: string;
  onNodeClick: string;
  onEdgeHover: string;
  onExportClick: string;
}

export interface DaySegment {
  day: string;
  angle: number;
  startAngle: number;
  endAngle: number;
}