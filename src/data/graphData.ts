import { GraphData, GraphNode, GraphEdge } from '@/types/skincare';
import { products, conflicts } from './skincareData';

export const normalSkinGraphData: GraphData = {
  nodes: products.map(product => ({
    id: product.name,
    name: product.name,
    color: getNodeColor(product.name),
    degree: getNodeDegree(product.name)
  })),
  edges: conflicts.map(conflict => ({
    source: conflict.productA,
    target: conflict.productB,
    severity: conflict.severity,
    mechanism: conflict.mechanism
  }))
};

function getNodeColor(productName: string): number {
  const colorAssignment: { [key: string]: number } = {
    'Cleanser': 1,
    'Toner': 1,
    'Vitamin C Serum': 2,
    'Moisturizer': 1,
    'Sunscreen': 2,
    'Niacinamide Serum': 3,
    'Retinol Serum': 4,
    'AHA/BHA Exfoliant': 5,
    'Clay Mask': 6,
    'Hydrating Mask': 4
  };
  return colorAssignment[productName] || 1;
}

function getNodeDegree(productName: string): number {
  const degreeMap: { [key: string]: number } = {
    'Vitamin C Serum': 3,
    'Retinol Serum': 3,
    'AHA/BHA Exfoliant': 3,
    'Clay Mask': 2,
    'Niacinamide Serum': 1,
    'Cleanser': 0,
    'Toner': 0,
    'Moisturizer': 0,
    'Sunscreen': 0,
    'Hydrating Mask': 0
  };
  return degreeMap[productName] || 0;
}

export const graphInteractions = {
  onNodeHover: "show product details and conflicts",
  onNodeClick: "highlight connected conflicts and show schedule placement",
  onEdgeHover: "show conflict mechanism and severity",
  nodeDragging: "enabled for custom layout adjustment",
  zoomPan: "enabled for graph navigation"
};