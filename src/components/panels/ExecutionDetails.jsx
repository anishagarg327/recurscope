import React from 'react';
import { 
  Braces, 
  Hash, 
  Layers, 
  Activity, 
  CornerDownLeft, 
  CheckCircle2,
  Tag
} from 'lucide-react';
import { usePlayback } from '../../contexts/PlaybackContext';
import { getTypeColorClass } from '../../core/execution/types';

export default function ExecutionDetails() {
  const { currentSnapshot } = usePlayback();

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
    executionStatus,
    event,
    statusMessage
  } = currentSnapshot;

  const getStatusBadgeClass = (status) => {
    if (status === 'completed') return 'badge-completed';
    if (status === 'running') return 'badge-running';
    return 'badge-idle';
  };

  const detailsList = [
    { label: 'Current Function', value: `${activeFunction}()`, icon: Braces, type: 'code' },
    { label: 'Current Line', value: `line ${currentLine}`, icon: Hash, type: 'number' },
    { label: 'Current Depth', value: `${depth} stack frames`, icon: Layers, type: 'number' },
    { label: 'Debugger Event', value: event, icon: Tag, type: 'event-badge' },
    { label: 'Current Action', value: statusMessage, icon: Activity, type: 'text' },
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
                  ) : item.type === 'event-badge' ? (
                    <span className={`details-badge ${getTypeColorClass(item.value)}`}>
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
