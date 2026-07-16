import React, { useState, useRef } from 'react';
import { GitFork, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { usePlayback } from '../../contexts/PlaybackContext';

export default function RecursionTree() {
  const { currentSnapshot } = usePlayback();
  
  const nodes = currentSnapshot?.recursionTreeNodes || [];
  const edges = currentSnapshot?.recursionTreeEdges || [];
  const activeNodeId = currentSnapshot?.activeNodeId;

  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);

  // Build a node coordinate lookup table
  const nodesMap = {};
  nodes.forEach(n => {
    nodesMap[n.id] = n;
  });

  const isNodeDimmed = (node) => {
    if (currentSnapshot?.executionStatus === 'completed') return false;
    return node.status !== 'active' && node.status !== 'running';
  };

  const isEdgeDimmed = (edge) => {
    if (currentSnapshot?.executionStatus === 'completed') return false;
    const sourceNode = nodesMap[edge.from];
    const targetNode = nodesMap[edge.to];
    if (!sourceNode || !targetNode) return true;
    
    const isSourceOnStack = sourceNode.status === 'active' || sourceNode.status === 'running';
    const isTargetOnStack = targetNode.status === 'active' || targetNode.status === 'running';
    return !(isSourceOnStack && isTargetOnStack);
  };

  const getNodeStrokeColor = (node) => {
    if (node.id === activeNodeId) return 'var(--text-primary)';
    if (node.status === 'success') return 'var(--color-success)';
    if (node.status === 'active') return 'var(--accent)';
    return 'rgba(255, 255, 255, 0.15)';
  };

  const getNodeFillColor = (node) => {
    if (node.id === activeNodeId) return 'var(--accent)';
    if (node.status === 'success') return 'var(--color-success-bg)';
    return 'var(--bg-panel-header)';
  };

  const getEdgeStrokeColor = (status) => {
    if (status === 'success') return 'var(--color-success)';
    if (status === 'active') return 'var(--accent)';
    return 'rgba(255, 255, 255, 0.08)';
  };

  // Drag handlers for Pan
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const zoomIn = () => setZoom(prev => Math.min(3, prev + 0.15));
  const zoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.15));
  const resetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="panel visualizer-panel">
      <div className="panel-header">
        <div className="panel-title">
          <GitFork size={14} className="panel-title-icon" />
          <span>Recursion Tree Visualizer</span>
        </div>
        <div className="visualization-status-pill">
          <span className="status-badge-live">Live Replay</span>
        </div>
      </div>
      
      <div 
        className="panel-body visualizer-body"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', overflow: 'hidden' }}
      >
        <div className="svg-canvas-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
          {nodes.length === 0 ? (
            <div className="empty-state" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Tree visualization not started
            </div>
          ) : (
            <>
              <svg 
                ref={svgRef}
                viewBox="0 0 600 320" 
                width="100%" 
                height="100%" 
                className="tree-svg"
              >
                <defs>
                  <marker 
                    id="arrow" 
                    viewBox="0 0 10 10" 
                    refX="22" 
                    refY="5" 
                    markerWidth="6" 
                    markerHeight="6" 
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.2)" />
                  </marker>
                  <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Apply Zoom and Pan transform to this group wrapper */}
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
                  {/* Dynamic Connection Edges */}
                  {edges.map((edge, index) => {
                    const source = nodesMap[edge.from];
                    const target = nodesMap[edge.to];
                    if (!source || !target) return null;

                    const isDashed = edge.status === 'pending';
                    const strokeColor = getEdgeStrokeColor(edge.status);
                    
                    return (
                      <line 
                        key={`edge-${index}`}
                        x1={source.cx} 
                        y1={source.cy} 
                        x2={target.cx} 
                        y2={target.cy} 
                        stroke={strokeColor} 
                        strokeWidth={edge.status === 'active' || edge.status === 'success' ? 2 : 1} 
                        strokeDasharray={isDashed ? "3,3" : undefined}
                        markerEnd="url(#arrow)"
                        className={isEdgeDimmed(edge) ? 'dimmed-edge' : ''}
                      />
                    );
                  })}

                  {/* Dynamic Nodes */}
                  {nodes.map((node) => {
                    const isActive = node.id === activeNodeId;
                    const strokeColor = getNodeStrokeColor(node);
                    const fillColor = getNodeFillColor(node);
                    const isDimmed = isNodeDimmed(node);
                    
                    return (
                      <g 
                        key={node.id} 
                        className={`tree-node ${isActive ? 'active-node' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        filter={isActive ? "url(#glow-node)" : undefined}
                      >
                        <circle 
                           cx={node.cx} 
                           cy={node.cy} 
                           r={node.cx === 300 && node.cy === 50 && node.subLabel ? 22 : 18}
                           fill={fillColor} 
                           stroke={strokeColor} 
                           strokeWidth={isActive ? 3.5 : 2} 
                           className={isActive ? "glow-active" : ""}
                        />
                        <text 
                          x={node.cx} 
                          y={node.cy + 4} 
                          textAnchor="middle" 
                          fontSize="9" 
                          fill={isActive ? '#fff' : (node.status === 'success' ? 'var(--color-success)' : 'var(--text-primary)')}
                          fontWeight={isActive || node.status === 'success' ? "bold" : "normal"}
                        >
                          {node.label}
                        </text>
                        {node.subLabel && (
                          <text
                            x={node.cx}
                            y={node.cy + 25}
                            textAnchor="middle"
                            fontSize="8"
                            fill="var(--text-secondary)"
                          >
                            {node.subLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Legend overlay */}
                <g className="tree-legend" transform="translate(15, 290)">
                  <circle cx="10" cy="10" r="5" fill="var(--accent)" />
                  <text x="20" y="13" fontSize="9" fill="var(--text-secondary)">Active</text>

                  <circle cx="75" cy="10" r="5" fill="var(--color-success-bg)" stroke="var(--color-success)" strokeWidth="1.5" />
                  <text x="85" y="13" fontSize="9" fill="var(--text-secondary)">Success / Base</text>

                  <circle cx="170" cy="10" r="5" fill="var(--bg-panel-header)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <text x="180" y="13" fontSize="9" fill="var(--text-secondary)">Pending / Parent</text>
                </g>
              </svg>

              {/* Floating Zoom & Pan Controls */}
              <div 
                className="canvas-zoom-controls" 
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-md)',
                  right: 'var(--space-md)',
                  display: 'flex',
                  gap: 'var(--space-xs)',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px',
                  zIndex: 20
                }}
              >
                <button 
                  onClick={zoomIn} 
                  className="icon-btn" 
                  title="Zoom In"
                  style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ZoomIn size={12} />
                </button>
                <button 
                  onClick={zoomOut} 
                  className="icon-btn" 
                  title="Zoom Out"
                  style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ZoomOut size={12} />
                </button>
                <button 
                  onClick={resetZoomPan} 
                  className="icon-btn" 
                  title="Reset Pan/Zoom"
                  style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
