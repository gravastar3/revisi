'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeeklyGraph, WeeklyGraphNode, WeeklyGraphEdge, DaySegment } from '@/types/skincare';
import { 
  calculateDaySegments, 
  calculateNodePosition, 
  getConnectedNodes, 
  getEdgeColor, 
  getEdgeStroke,
  getNodeColor,
  getProductInfo,
  animateToDaySegment,
  getWeeklyStats
} from '@/utils/scheduleGraphLogic';
import { colorMapping } from '@/data/skincareData';

interface WeeklyGraphProps {
  weeklyGraph: WeeklyGraph;
  width: number;
  height: number;
  onNodeClick?: (node: WeeklyGraphNode) => void;
  onExportClick?: () => void;
  selectedDay?: string;
  isMobile?: boolean;
}

export function WeeklyGraph({ 
  weeklyGraph, 
  width, 
  height, 
  onNodeClick,
  onExportClick,
  selectedDay,
  isMobile = false 
}: WeeklyGraphProps) {
  const [graphNodes, setGraphNodes] = useState<WeeklyGraphNode[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<WeeklyGraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<WeeklyGraphEdge | null>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  // Initialize graph layout
  useEffect(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const daySegments = calculateDaySegments(centerX, centerY, radius);
    
    const layoutNodes = weeklyGraph.nodes.map(node => {
      const position = calculateNodePosition(node, centerX, centerY, radius, daySegments);
      return {
        ...node,
        x: position.x,
        y: position.y
      };
    });
    
    setGraphNodes(layoutNodes);
  }, [weeklyGraph, width, height]);

  // Setup zoom and pan
  useEffect(() => {
    if (!svgRef.current || isMobile) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    d3.select(svgRef.current).call(zoom);

    return () => {
      d3.select(svgRef.current).on('.zoom', null);
    };
  }, [isMobile]);

  // Animate to selected day
  useEffect(() => {
    if (selectedDay && svgRef.current) {
      animateToDaySegment(selectedDay, svgRef.current);
    }
  }, [selectedDay]);

  // Update edge positions when transform changes
  useEffect(() => {
    if (!gRef.current) return;

    const nodePositions = new Map<number, { x: number; y: number }>();
    graphNodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        nodePositions.set(node.id, {
          x: node.x * transform.k + transform.x,
          y: node.y * transform.k + transform.y
        });
      }
    });

    // Update edge positions
    const edgeLines = gRef.current.querySelectorAll('.weekly-graph-edges line');
    edgeLines.forEach((line) => {
      const from = line.getAttribute('data-from');
      const to = line.getAttribute('data-to');
      
      if (from && to) {
        const fromPos = nodePositions.get(parseInt(from));
        const toPos = nodePositions.get(parseInt(to));
        
        if (fromPos && toPos) {
          line.setAttribute('x1', fromPos.x.toString());
          line.setAttribute('y1', fromPos.y.toString());
          line.setAttribute('x2', toPos.x.toString());
          line.setAttribute('y2', toPos.y.toString());
        }
      }
    });
  }, [graphNodes, transform]);

  const handleNodeHover = useCallback((node: WeeklyGraphNode | null) => {
    setHoveredNode(node);
    if (node) {
      const connected = getConnectedNodes(node.id, weeklyGraph.edges);
      setHighlightedNodes(new Set([node.id, ...connected]));
    } else {
      setHighlightedNodes(new Set());
    }
  }, [weeklyGraph.edges]);

  const handleNodeClick = useCallback((node: WeeklyGraphNode) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
    onNodeClick?.(node);
  }, [selectedNode, onNodeClick]);

  const handleEdgeHover = useCallback((edge: WeeklyGraphEdge | null) => {
    setHoveredEdge(edge);
  }, []);

  const stats = getWeeklyStats(weeklyGraph.skinType);
  const daySegments = calculateDaySegments(width / 2, height / 2, Math.min(width, height) * 0.35);

  // For mobile: create vertical timeline layout
  if (isMobile) {
    return (
      <div className="relative w-full h-full overflow-y-auto">
        <div className="space-y-4 p-4">
          {/* Day-wise timeline for mobile */}
          {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((dayName, index) => {
            const dayKey = days[index];
            const dayNodes = weeklyGraph.nodes.filter(n => n.day === dayKey);
            
            return (
              <Card key={dayKey} className="relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {dayName}
                    <Badge variant="outline">{dayNodes.length} produk</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dayNodes.map((node) => {
                      const productInfo = getProductInfo(node.name);
                      const color = getNodeColor(node.colorGroup);
                      
                      return (
                        <div 
                          key={node.id}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            highlightedNodes.has(node.id) ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleNodeClick(node)}
                          onMouseEnter={() => handleNodeHover(node)}
                          onMouseLeave={() => handleNodeHover(null)}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{node.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {node.timeSlot === 'morning' ? '🌅 Pagi' : '🌙 Malam'} • {productInfo.function}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Slot {node.colorGroup}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Mobile Stats */}
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
          <div className="flex justify-around text-xs">
            <div className="text-center">
              <div className="font-bold">{stats.totalNodes}</div>
              <div className="text-muted-foreground">Produk</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-red-600">{stats.conflictEdges}</div>
              <div className="text-muted-foreground">Konflik</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">{stats.chromaticNumber}</div>
              <div className="text-muted-foreground">Slot</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{stats.computationTime}</div>
              <div className="text-muted-foreground">Waktu</div>
            </div>
          </div>
        </div>

        {/* Mobile Export Button */}
        {onExportClick && (
          <div className="fixed bottom-20 right-4 z-10">
            <button
              onClick={onExportClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
            >
              📄 PDF
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop: Circular SVG graph
  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
        role="img"
        aria-label={`Weekly skincare schedule graph for ${weeklyGraph.skinType} skin`}
      >
        <g ref={gRef} transform={transform.toString()} className="main-graph">
          {/* Day segments */}
          {daySegments.map((segment, index) => {
            const isSelected = selectedDay === segment.day;
            const dayName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'][index];
            
            return (
              <g key={segment.day}>
                {/* Segment background */}
                <path
                  d={d3.arc()
                    .innerRadius(0)
                    .outerRadius(Math.min(width, height) * 0.4)
                    .startAngle(segment.startAngle)
                    .endAngle(segment.endAngle)() || ''}
                  fill={isSelected ? '#f3f4f6' : '#fafafa'}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  className="cursor-pointer transition-colors"
                  onClick={() => {
                    // Handle day selection
                  }}
                />
                
                {/* Day label */}
                <text
                  x={width / 2 + Math.min(width, height) * 0.45 * Math.cos(segment.angle)}
                  y={height / 2 + Math.min(width, height) * 0.45 * Math.sin(segment.angle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-gray-700 pointer-events-none"
                >
                  {dayName}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          <g className="weekly-graph-edges">
            {weeklyGraph.edges.map((edge, index) => {
              const isHighlighted = highlightedNodes.has(edge.from) && highlightedNodes.has(edge.to);
              const strokeColor = getEdgeColor(edge.relation);
              const strokeDasharray = getEdgeStroke(edge.relation);
              
              return (
                <g key={index}>
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={0}
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeDasharray={strokeDasharray}
                    strokeOpacity={isHighlighted ? 1 : 0.4}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => handleEdgeHover(edge)}
                    onMouseLeave={() => handleEdgeHover(null)}
                    data-from={edge.from}
                    data-to={edge.to}
                  />
                  {isHighlighted && (
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={0}
                      stroke={strokeColor}
                      strokeWidth={5}
                      strokeOpacity={0.2}
                      pointerEvents="none"
                      data-from={edge.from}
                      data-to={edge.to}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="weekly-graph-nodes">
            {graphNodes.map((node) => {
              const productInfo = getProductInfo(node.name);
              const isHighlighted = highlightedNodes.has(node.id);
              const isSelected = selectedNode === node.id;
              const color = getNodeColor(node.colorGroup);
              const nodeRadius = isMobile ? 8 : 12;
              
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => handleNodeHover(node)}
                  onMouseLeave={() => handleNodeHover(null)}
                  onClick={() => handleNodeClick(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(node);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.name} - ${node.timeSlot} on ${node.day}`}
                >
                  {/* Node shadow */}
                  {isSelected && (
                    <circle
                      r={nodeRadius + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeOpacity={0.5}
                    />
                  )}
                  
                  {/* Main node circle */}
                  <circle
                    r={nodeRadius}
                    fill={color}
                    stroke={isHighlighted ? '#1f2937' : '#9ca3af'}
                    strokeWidth={isHighlighted ? 3 : 1}
                    className="transition-all duration-200"
                    style={{
                      filter: isHighlighted ? 'brightness(1.1)' : 'brightness(1)'
                    }}
                  />
                  
                  {/* Time slot indicator */}
                  <text
                    y={nodeRadius + 12}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-600 pointer-events-none select-none"
                  >
                    {node.timeSlot === 'morning' ? '🌅' : '🌙'}
                  </text>
                  
                  {/* Node label */}
                  <text
                    y={nodeRadius + 24}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
                    style={{
                      fontSize: isMobile ? '10px' : '11px'
                    }}
                  >
                    {node.name.length > 15 ? node.name.substring(0, 12) + '...' : node.name}
                  </text>
                  
                  {/* Highlight indicator */}
                  {isHighlighted && (
                    <circle
                      r={nodeRadius - 3}
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
          </g>
        </g>
      </svg>
      
      {/* Tooltip for hovered node */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-10">
          <h3 className="font-semibold text-lg mb-2">{hoveredNode.name}</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Hari:</strong> {hoveredNode.day}</p>
            <p><strong>Waktu:</strong> {hoveredNode.timeSlot === 'morning' ? 'Pagi' : 'Malam'}</p>
            <p><strong>Color Group:</strong> {hoveredNode.colorGroup}</p>
            <p><strong>Bahan Aktif:</strong> {getProductInfo(hoveredNode.name).ingredients}</p>
            <p><strong>Fungsi:</strong> {getProductInfo(hoveredNode.name).function}</p>
          </div>
        </div>
      )}
      
      {/* Tooltip for hovered edge */}
      {hoveredEdge && (
        <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-10">
          <h3 className="font-semibold text-lg mb-2">Hubungan Produk</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Tipe:</strong> {hoveredEdge.relation}</p>
            <p><strong>Warna:</strong> 
              <span 
                className="inline-block w-4 h-4 rounded ml-2 border border-gray-300"
                style={{ backgroundColor: getEdgeColor(hoveredEdge.relation) }}
              />
            </p>
          </div>
        </div>
      )}
      
      {/* Stats Panel */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
        <h4 className="font-semibold text-sm mb-2">Statistik {weeklyGraph.skinType}</h4>
        <div className="space-y-1 text-xs">
          <p><strong>Produk:</strong> {stats.totalNodes}</p>
          <p><strong>Konflik:</strong> {stats.conflictEdges}</p>
          <p><strong>Chromatic:</strong> {stats.chromaticNumber}</p>
          <p><strong>Waktu:</strong> {stats.computationTime}</p>
        </div>
      </div>

      {/* Export Button */}
      {onExportClick && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onExportClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
          >
            📄 Export PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default WeeklyGraph;