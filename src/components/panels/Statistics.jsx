import React from 'react';
import { 
  BarChart3, 
  Layers3, 
  Hourglass, 
  CheckCircle2, 
  Copy, 
  Cpu 
} from 'lucide-react';
import { useExecution } from '../../contexts/ExecutionContext';
import { usePlayback } from '../../contexts/PlaybackContext';
import { useAlgorithms } from '../../contexts/AlgorithmsContext';
import { computeStatistics } from '../../core/execution/stats';

const iconMap = {
  BarChart3,
  Layers3,
  Hourglass,
  CheckCircle2,
  Copy,
  Cpu
};

export default function Statistics() {
  const { snapshots } = useExecution();
  const { currentStepIndex } = usePlayback();
  const { selectedAlgorithmId } = useAlgorithms();

  const statistics = computeStatistics(selectedAlgorithmId, currentStepIndex, snapshots);

  return (
    <div className="panel stats-panel">
      <div className="panel-header">
        <div className="panel-title">
          <BarChart3 size={14} className="panel-title-icon" />
          <span>Execution Statistics</span>
        </div>
      </div>
      
      <div className="panel-body stats-body">
        <div className="stats-grid">
          {statistics.map((stat, index) => {
            const Icon = iconMap[stat.icon] || BarChart3;
            return (
              <div key={index} className="stat-card">
                <div className="stat-card-left">
                  <div className={`stat-icon-wrapper color-${stat.color}`}>
                    <Icon size={14} />
                  </div>
                </div>
                <div className="stat-card-right">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
