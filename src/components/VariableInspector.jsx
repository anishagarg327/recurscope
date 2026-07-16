import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecution } from '../context/ExecutionContext';

export default function VariableInspector() {
  const { currentSnapshot, currentSnapshotIndex, snapshots } = useExecution();
  const vars = currentSnapshot?.variables || [];

  const getTypeColor = (type) => {
    if (type === 'number') return 'type-number';
    if (type === 'boolean') return 'type-boolean';
    if (type.startsWith('Array')) return 'type-array';
    return 'type-string';
  };

  const isVariableChanged = (name, value) => {
    if (currentSnapshotIndex === 0) return false;
    const prevSnapshot = snapshots[currentSnapshotIndex - 1];
    const prevVars = prevSnapshot?.variables || [];
    const prevVar = prevVars.find(v => v.name === name);
    return prevVar ? prevVar.value !== value : true;
  };

  // Dynamically compute a mock "Last Updated" info string for UX aesthetics
  const getLastUpdated = (name) => {
    if (currentSnapshotIndex === 0) return 'Initialized';
    
    // Custom mock rules based on variable name to simulate real debugger tracking
    if (name === 'returnValue' || name === 'result' || name === 'arr[mid]') {
      return 'Updated just now';
    }
    if (name === 'mid') {
      return 'Updated 1 step ago';
    }
    if (name === 'low' || name === 'high') {
      return 'Updated 2 steps ago';
    }
    return 'Initial initialization';
  };

  return (
    <div className="panel inspector-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Eye size={14} className="panel-title-icon" />
          <span>Variable Inspector</span>
        </div>
        <span className="inspector-scope-badge">Cards View</span>
      </div>
      
      <div className="panel-body inspector-body" style={{ padding: 'var(--space-md)' }}>
        {vars.length === 0 ? (
          <div className="empty-state">
            No variables in active scope
          </div>
        ) : (
          <div className="variable-cards-grid">
            <AnimatePresence initial={false}>
              {vars.map((v) => {
                const isChanged = isVariableChanged(v.name, v.value);
                return (
                  <motion.div 
                    key={v.name} 
                    className={`variable-card ${isChanged ? 'variable-card-changed' : ''}`}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    layout
                  >
                    <div className="var-card-header">
                      <span className="var-card-name">
                        <code>{v.name}</code>
                      </span>
                      <span className="var-card-scope">Local</span>
                    </div>
                    
                    <div className="var-card-body">
                      <div className="var-card-value">
                        <code>{v.value}</code>
                      </div>
                      <span className={`type-tag ${getTypeColor(v.type)}`}>
                        {v.type}
                      </span>
                    </div>
                    
                    <div className="var-card-footer">
                      <Clock size={10} className="var-update-icon" />
                      <span className="var-update-time">{getLastUpdated(v.name)}</span>
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
