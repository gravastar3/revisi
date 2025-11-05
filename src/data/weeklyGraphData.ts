import { WeeklyGraph, WeeklyGraphNode, WeeklyGraphEdge, SkinType } from '@/types/skincare';
import { 
  normalSkinSchedule, 
  oilySkinSchedule, 
  drySkinSchedule, 
  sensitiveSkinSchedule,
  normalColorAssignment 
} from '@/data/scheduleData';
import { conflicts } from '@/data/skincareData';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function generateWeeklyGraphNodes(
  schedule: any, 
  skinType: SkinType,
  colorAssignment: any[]
): WeeklyGraphNode[] {
  const nodes: WeeklyGraphNode[] = [];
  let nodeId = 1;

  days.forEach((day, dayIndex) => {
    const daySchedule = schedule[dayNames[dayIndex]];
    
    // Morning products
    daySchedule.morning.forEach((productName: string) => {
      const colorAssign = colorAssignment.find(ca => ca.node === productName);
      nodes.push({
        id: nodeId++,
        name: productName,
        day: day,
        timeSlot: 'morning',
        colorGroup: colorAssign?.color || 1
      });
    });

    // Evening products
    daySchedule.evening.forEach((productName: string) => {
      const colorAssign = colorAssignment.find(ca => ca.node === productName);
      nodes.push({
        id: nodeId++,
        name: productName,
        day: day,
        timeSlot: 'evening',
        colorGroup: colorAssign?.color || 1
      });
    });
  });

  return nodes;
}

function generateWeeklyGraphEdges(nodes: WeeklyGraphNode[]): WeeklyGraphEdge[] {
  const edges: WeeklyGraphEdge[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Same-day connections
  days.forEach(day => {
    const dayNodes = nodes.filter(n => n.day === day);
    for (let i = 0; i < dayNodes.length - 1; i++) {
      edges.push({
        from: dayNodes[i].id,
        to: dayNodes[i + 1].id,
        relation: 'same-day'
      });
    }
  });

  // Adjacent-day connections
  for (let i = 0; i < days.length - 1; i++) {
    const currentDayNodes = nodes.filter(n => n.day === days[i]);
    const nextDayNodes = nodes.filter(n => n.day === days[i + 1]);
    
    if (currentDayNodes.length > 0 && nextDayNodes.length > 0) {
      edges.push({
        from: currentDayNodes[currentDayNodes.length - 1].id,
        to: nextDayNodes[0].id,
        relation: 'adjacent-day'
      });
    }
  }

  // Conflict connections
  conflicts.forEach(conflict => {
    const sourceNodes = nodes.filter(n => n.name === conflict.productA);
    const targetNodes = nodes.filter(n => n.name === conflict.productB);
    
    sourceNodes.forEach(source => {
      targetNodes.forEach(target => {
        if (source.id !== target.id) {
          edges.push({
            from: source.id,
            to: target.id,
            relation: 'conflict'
          });
        }
      });
    });
  });

  return edges;
}

// Normal Skin Weekly Graph
export const normalSkinWeeklyGraph: WeeklyGraph = {
  skinType: 'normal',
  chromaticNumber: 6,
  computationTime: '0.008s',
  nodes: generateWeeklyGraphNodes(normalSkinSchedule, 'normal', normalColorAssignment),
  edges: [] // Will be filled by generateWeeklyGraphEdges
};
normalSkinWeeklyGraph.edges = generateWeeklyGraphEdges(normalSkinWeeklyGraph.nodes);

// Oily Skin Weekly Graph
export const oilySkinWeeklyGraph: WeeklyGraph = {
  skinType: 'oily',
  chromaticNumber: 5,
  computationTime: '0.007s',
  nodes: generateWeeklyGraphNodes(oilySkinSchedule, 'oily', normalColorAssignment),
  edges: []
};
oilySkinWeeklyGraph.edges = generateWeeklyGraphEdges(oilySkinWeeklyGraph.nodes);

// Dry Skin Weekly Graph
export const drySkinWeeklyGraph: WeeklyGraph = {
  skinType: 'dry',
  chromaticNumber: 5,
  computationTime: '0.009s',
  nodes: generateWeeklyGraphNodes(drySkinSchedule, 'dry', normalColorAssignment),
  edges: []
};
drySkinWeeklyGraph.edges = generateWeeklyGraphEdges(drySkinWeeklyGraph.nodes);

// Sensitive Skin Weekly Graph
export const sensitiveSkinWeeklyGraph: WeeklyGraph = {
  skinType: 'sensitive',
  chromaticNumber: 4,
  computationTime: '0.006s',
  nodes: generateWeeklyGraphNodes(sensitiveSkinSchedule, 'sensitive', normalColorAssignment),
  edges: []
};
sensitiveSkinWeeklyGraph.edges = generateWeeklyGraphEdges(sensitiveSkinWeeklyGraph.nodes);

// Combination Skin Weekly Graph (using normal as base)
export const combinationSkinWeeklyGraph: WeeklyGraph = {
  skinType: 'combination',
  chromaticNumber: 6,
  computationTime: '0.010s',
  nodes: generateWeeklyGraphNodes(normalSkinSchedule, 'combination', normalColorAssignment),
  edges: []
};
combinationSkinWeeklyGraph.edges = generateWeeklyGraphEdges(combinationSkinWeeklyGraph.nodes);

// Export all graphs
export const weeklyGraphs: Record<SkinType, WeeklyGraph> = {
  normal: normalSkinWeeklyGraph,
  oily: oilySkinWeeklyGraph,
  dry: drySkinWeeklyGraph,
  sensitive: sensitiveSkinWeeklyGraph,
  combination: combinationSkinWeeklyGraph
};

// Weekly graph interactions
export const weeklyGraphInteractions = {
  onDaySelect: "animate rotation to focus on selected day segment",
  onNodeHover: "show tooltip with product, time, and color group",
  onNodeClick: "highlight usage path across the week",
  onEdgeHover: "show relation type (same-day / conflict / adjacent)",
  onExportClick: "generate PDF of weekly routine per skin type"
};