import React from 'react';
import { Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayback } from '../../contexts/PlaybackContext';

export default function CallStack() {
  const { currentSnapshot } = usePlayback();
  const stackFrames = currentSnapshot?.callStack || [];

  const isBaseCaseFrame = (name) => {
    return name.includes('(1)') || name.includes('(0)') || name.includes('3, 3)');
  };

  return (
    <div className="panel stack-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Layers size={14} className="panel-title-icon" />
          <span>Call Stack</span>
        </div>
        <div className="stack-badge">{stackFrames.length} Frames</div>
      </div>
      
      <div className="panel-body stack-body">
        {stackFrames.length === 0 ? (
          <div className="empty-state">No active stack frames</div>
        ) : (
          <div className="stack-frames-list">
            <AnimatePresence initial={false}>
              {stackFrames.map((frame, index) => {
                const isTop = index === 0;
                const isBase = isBaseCaseFrame(frame.name);
                const frameKey = `${frame.name}_${frame.depth}`;
                return (
                  <motion.div 
                    key={frameKey} 
                    className={`stack-frame-card ${isTop ? 'active-frame glow-active' : ''} ${isBase ? 'base-case-frame' : ''}`}
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    layout
                  >
                    <div className="frame-header">
                      <span className="frame-number">#{stackFrames.length - index}</span>
                      <span className="frame-name">{frame.name}</span>
                      {isBase && (
                        <span className="base-case-badge">Base Case</span>
                      )}
                      {isTop && !isBase && (
                        <span className="active-badge">Active</span>
                      )}
                    </div>
                    
                    <div className="frame-meta">
                      <span className="frame-line">{frame.line}</span>
                      <span className="frame-depth">Depth: {frame.depth}</span>
                    </div>
                    
                    <div className="frame-variables">
                      <span className="var-label">Scope:</span>
                      <span className="var-value">{frame.variables}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
