import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GitFork, ZoomIn, ZoomOut, RotateCcw, Maximize, Target } from 'lucide-react';
import { usePlayback } from '../../contexts/PlaybackContext';
import { useExecution } from '../../contexts/ExecutionContext';
import { motion, AnimatePresence } from 'framer-motion';

const NODE_W = 280;
const NODE_H = 180; // approximate height for spacing
const H_SPACING = 100;
const V_SPACING = 120;

export default function RecursionTree() {
  const { currentSnapshot, isPlaying, currentStepIndex, goToStep } = usePlayback();
  const { snapshots } = useExecution();
  
  const nodes = currentSnapshot?.recursionTreeNodes || [];
  const edges = currentSnapshot?.recursionTreeEdges || [];
  const activeNodeId = currentSnapshot?.activeNodeId;
  const activeFunction = currentSnapshot?.activeFunction || 'Execution';

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUserPanned, setIsUserPanned] = useState(false);
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Compute Returns and Event specific info
  const nodeInfo = useMemo(() => {
    const info = {};
    if (!snapshots) return info;
    
    // Find call steps
    for (let i = 0; i < snapshots.length; i++) {
       const snap = snapshots[i];
       if (snap.activeNodeId) {
          if (!info[snap.activeNodeId]) {
            info[snap.activeNodeId] = { callStep: i, returnStep: -1, returnValue: undefined, isBaseCase: false, args: snap.variables, event: snap.event };
          }
       }
    }

    // Track returns up to current step
    for (let i = 0; i <= currentStepIndex; i++) {
      const snap = snapshots[i];
      if (!snap || !snap.activeNodeId) continue;
      const nId = snap.activeNodeId;
      if (!info[nId]) info[nId] = { callStep: -1, returnStep: -1, returnValue: undefined, isBaseCase: false, args: null };

      info[nId].event = snap.event;

      if (snap.event === 'BASE_CASE') {
        info[nId].isBaseCase = true;
      }
      
      if ((snap.event === 'RETURN' || snap.event === 'BASE_CASE') && snap.returnValue !== undefined) {
        info[nId].returnValue = snap.returnValue;
        info[nId].returnStep = i;
      }
    }
    return info;
  }, [snapshots, currentStepIndex]);

  // Compute Layout
  const layout = useMemo(() => {
    if (!nodes || nodes.length === 0) return {};

    const childrenMap = {};
    const inDegree = {};
    nodes.forEach(n => {
      childrenMap[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach(e => {
      if (childrenMap[e.from]) {
        childrenMap[e.from].push(e.to);
        inDegree[e.to] = (inDegree[e.to] || 0) + 1;
      }
    });

    let rootId = nodes.length > 0 ? nodes[0].id : null;
    for (const id in inDegree) {
      if (inDegree[id] === 0) {
        rootId = id;
        break;
      }
    }

    const locs = {};

    const getWidth = (id) => {
      const children = childrenMap[id];
      if (!children || children.length === 0) return NODE_W;
      let w = 0;
      for (let c of children) w += getWidth(c);
      w += (children.length - 1) * H_SPACING;
      return Math.max(NODE_W, w);
    };

    const pos = (id, startX, yTop, depth) => {
      const children = childrenMap[id];
      const w = getWidth(id);
      const cx = startX + w / 2;
      locs[id] = { x: cx, y: yTop, depth };

      if (children && children.length > 0) {
        const totalChildrenW = children.reduce((sum, c) => sum + getWidth(c), 0) + (children.length - 1) * H_SPACING;
        let currentX = startX + (w - totalChildrenW) / 2;

        for (let c of children) {
          const cw = getWidth(c);
          pos(c, currentX, yTop + NODE_H + V_SPACING, depth + 1);
          currentX += cw + H_SPACING;
        }
      }
    };

    if (rootId) {
      pos(rootId, 0, 0, 0);
    }
    return locs;
  }, [nodes, edges]);

  // Viewport dimensions
  const getViewportSize = useCallback(() => {
    if (containerRef.current) {
      return { w: containerRef.current.clientWidth, h: containerRef.current.clientHeight };
    }
    return { w: 800, h: 600 };
  }, []);

  const fitView = useCallback(() => {
    if (!nodes || nodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      const pos = layout[n.id];
      if (pos) {
        minX = Math.min(minX, pos.x - NODE_W / 2);
        maxX = Math.max(maxX, pos.x + NODE_W / 2);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + NODE_H);
      }
    });

    if (minX === Infinity) return;

    // Add padding
    minX -= 50; maxX += 50;
    minY -= 50; maxY += 100;

    const width = maxX - minX;
    const height = maxY - minY;

    const { w: vw, h: vh } = getViewportSize();
    const scaleX = vw / width;
    const scaleY = vh / height;
    
    // CRITICAL FIX: Never allow zoom to go below 0.75 so nodes don't look tiny
    const newZoom = Math.max(0.75, Math.min(scaleX, scaleY, 1.5));

    const targetX = (vw / 2) - ((minX + width / 2) * newZoom);
    // If it's very tall, don't center it vertically, align it closer to the top so root is visible
    const targetY = height * newZoom > vh ? 50 : (vh / 2) - ((minY + height / 2) * newZoom);

    setZoom(newZoom);
    setPan({ x: targetX, y: targetY });
    setIsUserPanned(false);
  }, [nodes, layout, getViewportSize]);

  // Initial fit
  useEffect(() => {
    if (nodes.length > 0 && zoom === 1 && pan.x === 0 && pan.y === 0) {
      fitView();
    }
  }, [nodes.length, fitView, zoom, pan]);

  const centerActiveNode = useCallback(() => {
    if (activeNodeId && layout[activeNodeId]) {
      const pos = layout[activeNodeId];
      const { w: vw, h: vh } = getViewportSize();
      const targetX = (vw / 2) - (pos.x * zoom);
      const targetY = (vh / 3) - (pos.y * zoom);
      setPan({ x: targetX, y: targetY });
      setIsUserPanned(false);
    }
  }, [activeNodeId, layout, zoom, getViewportSize]);

  // Auto-pan
  useEffect(() => {
    if (isPlaying && activeNodeId && layout[activeNodeId] && !isUserPanned) {
      centerActiveNode();
    }
  }, [activeNodeId, isPlaying, layout, isUserPanned, centerActiveNode]);

  // Interaction handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setIsUserPanned(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUpOrLeave = () => setIsDragging(false);

  const zoomIn = () => { setZoom(prev => Math.min(3, prev + 0.2)); setIsUserPanned(true); };
  const zoomOut = () => { setZoom(prev => Math.max(0.2, prev - 0.2)); setIsUserPanned(true); };

  const resetZoomPan = () => {
    fitView();
  };

  const handleNodeClick = (nodeId) => {
    const info = nodeInfo[nodeId];
    if (info && info.callStep !== -1) {
      goToStep(info.callStep);
      setIsUserPanned(true);
    }
  };

  const getNodeTheme = (node, info) => {
    const isActive = node.id === activeNodeId;
    if (isActive) return { border: '#3b82f6', bg: 'var(--bg-panel)', text: 'var(--text-primary)', shadow: '0 0 20px rgba(59, 130, 246, 0.4)' };
    if (node.status === 'running') return { border: '#a855f7', bg: 'var(--bg-panel)', text: 'var(--text-primary)', shadow: '0 0 15px rgba(168, 85, 247, 0.3)' };
    if (node.status === 'success') {
       if (info?.isBaseCase) return { border: '#eab308', bg: 'var(--bg-panel)', text: 'var(--text-primary)', shadow: '0 0 10px rgba(234, 179, 8, 0.2)' };
       return { border: '#22c55e', bg: 'var(--bg-panel)', text: 'var(--text-primary)', shadow: '0 0 10px rgba(34, 197, 94, 0.2)' };
    }
    if (node.status === 'error') return { border: '#ef4444', bg: 'var(--bg-panel)', text: 'var(--text-primary)', shadow: '0 0 10px rgba(239, 68, 68, 0.2)' };
    
    return { border: 'var(--border-color)', bg: 'var(--bg-app)', text: 'var(--text-secondary)', shadow: 'none' };
  };

  const currentDepth = layout[activeNodeId]?.depth ?? 0;
  const currentEvent = activeNodeId && nodeInfo[activeNodeId] ? nodeInfo[activeNodeId].event : '';

  // To find canvas bounds for SVG
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  if (nodes.length > 0) {
    minX = Math.min(...nodes.map(n => layout[n.id]?.x || 0)) - NODE_W;
    maxX = Math.max(...nodes.map(n => layout[n.id]?.x || 0)) + NODE_W;
    minY = Math.min(...nodes.map(n => layout[n.id]?.y || 0)) - 100;
    maxY = Math.max(...nodes.map(n => layout[n.id]?.y || 0)) + NODE_H + 200;
  }
  const svgW = Math.max(800, maxX - minX);
  const svgH = Math.max(600, maxY - minY);
  const svgOffsetX = minX < 0 ? Math.abs(minX) : 0;
  const svgOffsetY = minY < 0 ? Math.abs(minY) : 0;

  return (
    <div className="panel visualizer-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <div className="panel-header" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel-header)' }}>
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <GitFork size={16} className="panel-title-icon" style={{ color: '#3b82f6' }} />
          <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>DEBUGGER TREE</span>
          {nodes.length > 0 && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Func: {activeFunction}</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ color: 'var(--text-primary)' }}>Depth: {currentDepth}</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ color: 'var(--text-primary)' }}>Nodes: {nodes.length}</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ color: 'var(--text-primary)' }}>Zoom: {Math.round(zoom * 100)}%</span>
              {currentEvent && (
                <>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{currentEvent}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* CANVAS */}
      <div 
        ref={containerRef}
        className="panel-body visualizer-body"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ 
          flex: 1,
          cursor: isDragging ? 'grabbing' : 'grab', 
          userSelect: 'none', 
          overflow: 'hidden', 
          position: 'relative',
          backgroundColor: 'var(--bg-app)', 
          backgroundImage: 'radial-gradient(circle, var(--text-muted) 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: 0.8
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            transformOrigin: '0 0'
          }}
          animate={{ x: pan.x, y: pan.y, scale: zoom }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        >
          {/* SVG for connections */}
          <svg 
            style={{ position: 'absolute', top: -svgOffsetY, left: -svgOffsetX, width: svgW, height: svgH, pointerEvents: 'none', zIndex: 0 }}
          >
            {edges.map((edge) => {
              const sourcePos = layout[edge.from];
              const targetPos = layout[edge.to];
              if (!sourcePos || !targetPos) return null;

              const sx = sourcePos.x + svgOffsetX;
              const sy = sourcePos.y + NODE_H + svgOffsetY;
              const tx = targetPos.x + svgOffsetX;
              const ty = targetPos.y + svgOffsetY;
              
              const dy = Math.abs(ty - sy);
              const cy1 = sy + dy / 2;
              const cy2 = ty - dy / 2;
              const d = `M ${sx} ${sy} C ${sx} ${cy1} ${tx} ${cy2} ${tx} ${ty}`;

              let strokeColor = 'var(--text-muted)';
              let strokeWidth = 3;
              if (edge.status === 'success') {
                strokeColor = '#22c55e';
                strokeWidth = 4;
              } else if (edge.status === 'active') { 
                strokeColor = '#3b82f6'; 
                strokeWidth = 5; 
              }

              return (
                <motion.path 
                  key={`edge-${edge.from}-${edge.to}`}
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={edge.status === 'pending' ? "8,8" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {nodes.map((node) => {
            const pos = layout[node.id];
            if (!pos) return null;
            const info = nodeInfo[node.id];
            const isActive = node.id === activeNodeId;
            const theme = getNodeTheme(node, info);
            
            const isDimmed = !isActive && currentSnapshot?.executionStatus !== 'completed' && node.status !== 'running';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: isDimmed ? 0.4 : 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: pos.x - NODE_W / 2,
                  top: pos.y,
                  width: NODE_W,
                  backgroundColor: theme.bg,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  boxShadow: theme.shadow,
                  color: 'var(--text-primary)',
                  zIndex: isActive ? 10 : 5,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif'
                }}
              >
                {/* Header */}
                <div style={{ backgroundColor: 'var(--bg-panel-header)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}40` }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '15px', color: theme.text }}>
                    {node.label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Depth: {pos.depth}
                  </span>
                </div>
                
                {/* Body */}
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Args:</span>
                    <span style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 'bold' }}>
                      {info.args ? info.args.map(a => `${a.name}=${a.value}`).join(', ') : 'None'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                    <span style={{ fontWeight: 'bold', color: theme.text, textTransform: 'uppercase' }}>
                      {node.status} {info.isBaseCase && node.status === 'success' && '(BASE CASE)'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Step:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                      {info.callStep !== -1 ? info.callStep : '?'}
                    </span>
                  </div>

                  <AnimatePresence>
                    {info.returnValue !== undefined && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        style={{ borderTop: `1px solid ${theme.border}40`, paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>Return:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '16px', color: '#22c55e', fontWeight: 'bold' }}>
                          {info.returnValue}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        {nodes.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 14px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }}/> ACTIVE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a855f7', boxShadow: '0 0 6px #a855f7' }}/> RUNNING</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }}/> COMPLETED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308', boxShadow: '0 0 6px #eab308' }}/> BASE CASE</div>
          </div>
        )}

        {/* Controls */}
        {nodes.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px',
            zIndex: 20,
            boxShadow: 'var(--shadow-lg)'
          }} onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={zoomIn} className="icon-btn" title="Zoom In" style={btnStyle}><ZoomIn size={18} /></button>
            <button onClick={zoomOut} className="icon-btn" title="Zoom Out" style={btnStyle}><ZoomOut size={18} /></button>
            <div style={{ height: '1px', backgroundColor: '#334155', margin: '4px 0' }} />
            <button onClick={fitView} className="icon-btn" title="Fit View" style={btnStyle}><Maximize size={18} /></button>
            <button onClick={resetZoomPan} className="icon-btn" title="Reset View" style={btnStyle}><RotateCcw size={18} /></button>
            <button onClick={centerActiveNode} className="icon-btn" title="Center Active Node" style={btnStyle}><Target size={18} /></button>
          </div>
        )}

        {/* HOVER TOOLTIP */}
        <AnimatePresence>
          {hoveredNode && nodeInfo[hoveredNode.id] && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                left: mousePos.x + 20,
                top: mousePos.y + 20,
                backgroundColor: 'rgba(10, 15, 28, 0.98)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '16px',
                pointerEvents: 'none',
                zIndex: 100,
                color: 'var(--text-primary)',
                fontSize: '13px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
                minWidth: '220px',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#60a5fa', fontFamily: 'monospace', fontSize: '15px' }}>
                {hoveredNode.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', alignItems: 'center' }}>
                
                <span style={{ color: 'var(--text-muted)' }}>Depth:</span>
                <span style={{ fontWeight: 'bold' }}>{layout[hoveredNode.id]?.depth}</span>
                
                {nodeInfo[hoveredNode.id].args && (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>Args:</span>
                    <span style={{ fontFamily: 'monospace', color: '#93c5fd', fontWeight: 'bold' }}>
                      {nodeInfo[hoveredNode.id].args.map(a => `${a.name}=${a.value}`).join(', ')}
                    </span>
                  </>
                )}
                
                {nodeInfo[hoveredNode.id].returnValue !== undefined && (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>Return:</span>
                    <span style={{ color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>{nodeInfo[hoveredNode.id].returnValue}</span>
                  </>
                )}

                <span style={{ color: 'var(--text-muted)' }}>Created Step:</span>
                <span>{nodeInfo[hoveredNode.id].callStep}</span>
                
                {nodeInfo[hoveredNode.id].returnStep !== -1 && (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>End Step:</span>
                    <span>{nodeInfo[hoveredNode.id].returnStep}</span>
                  </>
                )}

                <span style={{ color: 'var(--text-muted)' }}>Event:</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{nodeInfo[hoveredNode.id].event}</span>

              </div>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                CLICK TO JUMP DEBUGGER
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

const btnStyle = {
  width: '36px', 
  height: '36px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  borderRadius: '6px',
  color: 'var(--text-secondary)',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};
