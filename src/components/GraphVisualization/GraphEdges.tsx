'use client';

import React from 'react';
import { GraphEdge } from '@/types/skincare';
import { colorMapping } from '@/data/skincareData';

interface GraphEdgesProps {
  edges: GraphEdge[];
  highlightedNodes: Set<string>;
  onEdgeHover: (edge: GraphEdge | null) => void;
}

export function GraphEdges({ edges, highlightedNodes, onEdgeHover }: GraphEdgesProps) {
  const getStrokeColor = (severity: string): string => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getStrokeWidth = (severity: string): number => {
    switch (severity) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1.5;
      default: return 1;
    }
  };

  const isEdgeHighlighted = (edge: GraphEdge): boolean => {
    return highlightedNodes.has(edge.source) && highlightedNodes.has(edge.target);
  };

  return (
    <g className="graph-edges">
      {edges.map((edge, index) => {
        const isHighlighted = isEdgeHighlighted(edge);
        const strokeColor = getStrokeColor(edge.severity);
        const strokeWidth = getStrokeWidth(edge.severity);
        
        return (
          <g key={index}>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={0}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={isHighlighted ? 1 : 0.3}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => onEdgeHover(edge)}
              onMouseLeave={() => onEdgeHover(null)}
              data-source={edge.source}
              data-target={edge.target}
            />
            {isHighlighted && (
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={0}
                stroke={strokeColor}
                strokeWidth={strokeWidth + 2}
                strokeOpacity={0.3}
                pointerEvents="none"
                data-source={edge.source}
                data-target={edge.target}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export default GraphEdges;