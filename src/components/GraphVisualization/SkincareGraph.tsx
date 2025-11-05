'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphEdge, Product, LayoutState } from '@/types/skincare';
import { GraphNodes } from './GraphNodes';
import { GraphEdges } from './GraphEdges';
import { 
  calculateCircularLayout, 
  applyJitter, 
  getConnectedNodes, 
  saveLayoutToLocalStorage,
  loadLayoutFromLocalStorage,
  createLayoutState
} from '@/utils/graphCalculations';
import { colorMapping } from '@/data/skincareData';

interface SkincareGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  products: Product[];
  skinType: string;
  width: number;
  height: number;
}

export function SkincareGraph({ 
  nodes, 
  edges, 
  products, 
  skinType, 
  width, 
  height 
}: SkincareGraphProps) {
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  // Initialize graph layout
  useEffect(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    // Try to load saved layout from localStorage
    const savedLayout = loadLayoutFromLocalStorage(skinType);
    
    let layoutNodes: GraphNode[];
    
    if (savedLayout) {
      // Apply saved positions
      layoutNodes = nodes.map(node => ({
        ...node,
        x: savedLayout[node.id]?.x || 0,
        y: savedLayout[node.id]?.y || 0
      }));
    } else {
      // Calculate new circular layout
      layoutNodes = calculateCircularLayout(nodes, centerX, centerY, radius);
      layoutNodes = applyJitter(layoutNodes, 3);
    }
    
    setGraphNodes(layoutNodes);
  }, [nodes, width, height, skinType]);

  // Setup zoom and pan
  useEffect(() => {
    if (!svgRef.current) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    d3.select(svgRef.current).call(zoom);

    return () => {
      d3.select(svgRef.current).on('.zoom', null);
    };
  }, []);

  // Update edge positions when transform changes
  useEffect(() => {
    if (!gRef.current) return;

    const nodePositions = new Map<string, { x: number; y: number }>();
    graphNodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        nodePositions.set(node.id, {
          x: node.x * transform.k + transform.x,
          y: node.y * transform.k + transform.y
        });
      }
    });

    // Update edge positions
    const edgeLines = gRef.current.querySelectorAll('.graph-edges line');
    edgeLines.forEach((line) => {
      const source = line.getAttribute('data-source');
      const target = line.getAttribute('data-target');
      
      if (source && target) {
        const sourcePos = nodePositions.get(source);
        const targetPos = nodePositions.get(target);
        
        if (sourcePos && targetPos) {
          line.setAttribute('x1', sourcePos.x.toString());
          line.setAttribute('y1', sourcePos.y.toString());
          line.setAttribute('x2', targetPos.x.toString());
          line.setAttribute('y2', targetPos.y.toString());
        }
      }
    });
  }, [graphNodes, transform]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
    if (node) {
      const connected = getConnectedNodes(node.id, edges);
      setHighlightedNodes(new Set([node.id, ...connected]));
    } else {
      setHighlightedNodes(new Set());
    }
  }, [edges]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
  }, [selectedNode]);

  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    setGraphNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    );
  }, []);

  const handleEdgeHover = useCallback((edge: GraphEdge | null) => {
    setHoveredEdge(edge);
  }, []);

  // Save layout to localStorage when nodes change
  useEffect(() => {
    if (graphNodes.length > 0) {
      const layoutState = createLayoutState(graphNodes);
      saveLayoutToLocalStorage(skinType, layoutState);
    }
  }, [graphNodes, skinType]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
        role="img"
        aria-label="Skincare product conflict graph"
      >
        <g ref={gRef} transform={transform.toString()}>
          <GraphEdges
            edges={edges}
            highlightedNodes={highlightedNodes}
            onEdgeHover={handleEdgeHover}
          />
          <GraphNodes
            nodes={graphNodes}
            products={products}
            highlightedNodes={highlightedNodes}
            selectedNode={selectedNode}
            onNodeHover={handleNodeHover}
            onNodeClick={handleNodeClick}
            onNodeDrag={handleNodeDrag}
          />
        </g>
      </svg>
      
      {/* Tooltip for hovered node */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-10">
          <h3 className="font-semibold text-lg mb-2">{hoveredNode.name}</h3>
          {(() => {
            const product = products.find(p => p.name === hoveredNode.name);
            return product ? (
              <div className="space-y-1 text-sm">
                <p><strong>Bahan Aktif:</strong> {product.activeIngredients}</p>
                <p><strong>Fungsi:</strong> {product.function}</p>
                <p><strong>Frekuensi:</strong> {product.frequency}</p>
                <p><strong>Konflik dengan:</strong> {getConnectedNodes(hoveredNode.id, edges).join(', ') || 'Tidak ada'}</p>
              </div>
            ) : null;
          })()}
        </div>
      )}
      
      {/* Tooltip for hovered edge */}
      {hoveredEdge && (
        <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-10">
          <h3 className="font-semibold text-lg mb-2">Konflik Produk</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Produk:</strong> {hoveredEdge.source} ↔ {hoveredEdge.target}</p>
            <p><strong>Severity:</strong> <span className={`px-2 py-1 rounded text-xs ${
              hoveredEdge.severity === 'high' ? 'bg-red-100 text-red-800' :
              hoveredEdge.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>{hoveredEdge.severity}</span></p>
            <p><strong>Mekanisme:</strong> {hoveredEdge.mechanism}</p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
        <h4 className="font-semibold text-sm mb-2">Legenda Warna</h4>
        <div className="space-y-1">
          {Object.entries(colorMapping).map(([colorNum, color]) => (
            <div key={colorNum} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">Slot {colorNum}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkincareGraph;