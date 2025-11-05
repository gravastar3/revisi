'use client';

import React, { useRef, useEffect } from 'react';
import { GraphNode, Product } from '@/types/skincare';
import { getNodeRadius } from '@/utils/graphCalculations';
import { colorMapping } from '@/data/skincareData';

interface GraphNodesProps {
  nodes: GraphNode[];
  products: Product[];
  highlightedNodes: Set<string>;
  selectedNode: string | null;
  onNodeHover: (node: GraphNode | null) => void;
  onNodeClick: (node: GraphNode) => void;
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
}

export function GraphNodes({
  nodes,
  products,
  highlightedNodes,
  selectedNode,
  onNodeHover,
  onNodeClick,
  onNodeDrag
}: GraphNodesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggedNode = useRef<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const getProductInfo = (nodeName: string): Product | undefined => {
    return products.find(p => p.name === nodeName);
  };

  const handleMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.preventDefault();
    draggedNode.current = node.id;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    dragOffset.current = {
      x: svgP.x - (node.x || 0),
      y: svgP.y - (node.y || 0)
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode.current || !svgRef.current) return;
    
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const newX = svgP.x - dragOffset.current.x;
    const newY = svgP.y - dragOffset.current.y;
    
    onNodeDrag(draggedNode.current, newX, newY);
  };

  const handleMouseUp = () => {
    draggedNode.current = null;
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    svg.addEventListener('mousemove', handleMouseMove as any);
    svg.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      svg.removeEventListener('mousemove', handleMouseMove as any);
      svg.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [onNodeDrag]);

  return (
    <svg ref={svgRef} className="graph-nodes" width="100%" height="100%">
      {nodes.map((node) => {
        const product = getProductInfo(node.name);
        const radius = getNodeRadius(node.degree);
        const isHighlighted = highlightedNodes.has(node.id);
        const isSelected = selectedNode === node.id;
        const color = colorMapping[node.color as keyof typeof colorMapping] || '#e5e7eb';
        
        return (
          <g
            key={node.id}
            transform={`translate(${node.x || 0}, ${node.y || 0})`}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => onNodeHover(node)}
            onMouseLeave={() => onNodeHover(null)}
            onClick={() => onNodeClick(node)}
            onMouseDown={(e) => handleMouseDown(e, node)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNodeClick(node);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${node.name} - ${product?.function}`}
          >
            {/* Node shadow */}
            {isSelected && (
              <circle
                r={radius + 4}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            )}
            
            {/* Main node circle */}
            <circle
              r={radius}
              fill={color}
              stroke={isHighlighted ? '#1f2937' : '#9ca3af'}
              strokeWidth={isHighlighted ? 3 : 1}
              className="transition-all duration-200"
              style={{
                filter: isHighlighted ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
            
            {/* Node label */}
            <text
              y={radius + 15}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
              style={{
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {node.name}
            </text>
            
            {/* Highlight indicator */}
            {isHighlighted && (
              <circle
                r={radius - 5}
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeOpacity={0.8}
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default GraphNodes;