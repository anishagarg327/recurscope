import React from 'react';
import { 
  Braces, 
  Hash, 
  Layers, 
  Activity, 
  CornerDownLeft, 
  CheckCircle2 
} from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function ExecutionDetails() {
  const { currentAlgorithm, currentSnapshot } = useExecution();

  if (!currentSnapshot) {
    return (
      <div className="panel details-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Braces size={14} className="panel-title-icon" />
            <span>Execution Details</span>
          </div>
        </div>
        <div className="panel-body details-body empty-state">
          No execution active.
        </div>
      </div>
    );
  }

  const {
    activeFunction,
    currentLine,
    depth,
    returnValue,
    executionStatus
  } = currentSnapshot;

  // Determine current action based on algorithm and line number
  const getActionText = () => {
    if (currentAlgorithm === 'factorial') {
      if (currentLine === 2) return 'Calling function entry scope';
      if (currentLine === 4) return 'Evaluating condition (n <= 1)';
      if (currentLine === 5) return 'Returning base case value: 1';
      if (currentLine === 9) return returnValue !== undefined ? `Returning resolved stack relation: ${returnValue}` : 'Recurse: computing relation (n * f(n-1))';
    } else if (currentAlgorithm === 'fibonacci') {
      if (currentLine === 2) return 'Calling function entry scope';
      if (currentLine === 4) return 'Evaluating base case (n <= 0)';
      if (currentLine === 5) return 'Evaluating base case (n === 1)';
      if (currentLine === 8) return returnValue !== undefined ? `Combining branches return: ${returnValue}` : 'Spawning child branch execution';
    } else if (currentAlgorithm === 'binarySearch') {
      if (currentLine === 2) return 'Calling array search scope';
      if (currentLine === 4) return 'Evaluating range exhaust condition';
      if (currentLine === 6) return 'Calculating mid-point split index';
      if (currentLine === 9) return returnValue !== undefined ? `Target found at mid-point: index ${returnValue}` : 'Evaluating if target is found';
      if (currentLine === 12) return 'Comparing midpoint element value';
      if (currentLine === 13) return 'Recurse: searching lower left half';
      if (currentLine === 15) return 'Recurse: searching upper right half';
    }
    return 'Processing execution step';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'completed') return 'badge-completed';
    if (status === 'running') return 'badge-running';
    return 'badge-idle';
  };

  const detailsList = [
    { label: 'Current Function', value: `${activeFunction}()`, icon: Braces, type: 'code' },
    { label: 'Current Line', value: `line ${currentLine}`, icon: Hash, type: 'number' },
    { label: 'Current Depth', value: `${depth} stack frames`, icon: Layers, type: 'number' },
    { label: 'Current Action', value: getActionText(), icon: Activity, type: 'text' },
    { label: 'Return Value', value: returnValue !== undefined ? String(returnValue) : 'pending...', icon: CornerDownLeft, type: returnValue !== undefined ? 'success' : 'muted' },
    { label: 'Execution Status', value: executionStatus, icon: CheckCircle2, type: 'badge' }
  ];

  return (
    <div className="panel details-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Braces size={14} className="panel-title-icon" />
          <span>Execution Details</span>
        </div>
        <span className="details-header-badge">Inspector</span>
      </div>
      
      <div className="panel-body details-body">
        <div className="details-list">
          {detailsList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="details-row">
                <div className="details-row-left">
                  <Icon size={13} className="details-row-icon" />
                  <span className="details-label">{item.label}</span>
                </div>
                <div className="details-row-right">
                  {item.type === 'badge' ? (
                    <span className={`details-badge ${getStatusBadgeClass(item.value)}`}>
                      {item.value}
                    </span>
                  ) : item.type === 'code' ? (
                    <code className="details-code-val">{item.value}</code>
                  ) : item.type === 'success' ? (
                    <span className="details-success-val">{item.value}</span>
                  ) : item.type === 'muted' ? (
                    <span className="details-muted-val">{item.value}</span>
                  ) : (
                    <span className="details-text-val">{item.value}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
