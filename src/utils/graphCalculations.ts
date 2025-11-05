import { GraphNode, GraphEdge, LayoutState } from '@/types/skincare';

export function calculateCircularLayout(
  nodes: GraphNode[], 
  centerX: number, 
  centerY: number, 
  radius: number
): GraphNode[] {
  const nodeCount = nodes.length;
  
  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodeCount;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return {
      ...node,
      x,
      y
    };
  });
}

export function applyJitter(
  nodes: GraphNode[], 
  jitterAmount: number = 5
): GraphNode[] {
  return nodes.map(node => ({
    ...node,
    x: node.x! + (Math.random() - 0.5) * jitterAmount,
    y: node.y! + (Math.random() - 0.5) * jitterAmount
  }));
}

export function getNodeRadius(degree: number, baseRadius: number = 20): number {
  return baseRadius + degree * 3;
}

export function getConnectedNodes(nodeId: string, edges: GraphEdge[]): string[] {
  const connected = new Set<string>();
  
  edges.forEach(edge => {
    if (edge.source === nodeId) {
      connected.add(edge.target);
    } else if (edge.target === nodeId) {
      connected.add(edge.source);
    }
  });
  
  return Array.from(connected);
}

export function getEdgeBetweenNodes(source: string, target: string, edges: GraphEdge[]): GraphEdge | undefined {
  return edges.find(edge => 
    (edge.source === source && edge.target === target) ||
    (edge.source === target && edge.target === source)
  );
}

export function saveLayoutToLocalStorage(skinType: string, layout: LayoutState): void {
  const key = `skincare_layout_${skinType}_v1`;
  localStorage.setItem(key, JSON.stringify(layout));
}

export function loadLayoutFromLocalStorage(skinType: string): LayoutState | null {
  const key = `skincare_layout_${skinType}_v1`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

export function createLayoutState(nodes: GraphNode[]): LayoutState {
  const layout: LayoutState = {};
  nodes.forEach(node => {
    if (node.x !== undefined && node.y !== undefined) {
      layout[node.id] = { x: node.x, y: node.y };
    }
  });
  return layout;
}