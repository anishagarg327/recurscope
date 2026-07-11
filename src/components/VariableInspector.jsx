import React from 'react';
import { Eye } from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function VariableInspector() {
  const { currentSnapshot } = useExecution();
  const vars = currentSnapshot?.variables || [];

  const getTypeColor = (type) => {
    if (type === 'number') return 'type-number';
    if (type === 'boolean') return 'type-boolean';
    if (type.startsWith('Array')) return 'type-array';
    return 'type-string';
  };

  return (
    <div className="panel inspector-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Eye size={14} className="panel-title-icon" />
          <span>Variable Inspector</span>
        </div>
        <span className="inspector-scope-badge">Local Scope</span>
      </div>
      
      <div className="panel-body inspector-body">
        {vars.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
            No variables in active scope
          </div>
        ) : (
          <table className="inspector-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {vars.map((v, index) => (
                <tr key={index}>
                  <td className="var-name">
                    <span className="var-indicator"></span>
                    <code>{v.name}</code>
                  </td>
                  <td className="var-value-col">
                    <code>{v.value}</code>
                  </td>
                  <td className="var-type">
                    <span className={`type-tag ${getTypeColor(v.type)}`}>
                      {v.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
