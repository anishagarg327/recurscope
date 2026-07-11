import React from 'react';
import { Sliders, Clock } from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function ExecutionTimeline() {
  const {
    currentAlgorithm,
    snapshots,
    currentSnapshotIndex,
    currentSnapshot,
    goToStep,
    playbackSpeed,
    setSpeed,
    isPlaying
  } = useExecution();

  const totalSteps = snapshots.length - 1;
  const currentStep = currentSnapshotIndex;
  
  // Calculate percentage for progress fill
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  // Handle track scrubbing clicks
  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (width > 0) {
      const ratio = Math.max(0, Math.min(1, clickX / width));
      const targetStep = Math.round(ratio * totalSteps);
      goToStep(targetStep);
    }
  };

  // Dynamic breakpoint description based on current snapshot and line
  const activeLine = currentSnapshot?.currentLine || 2;
  const getBreakpointDescription = () => {
    if (currentAlgorithm === 'factorial') {
      if (activeLine === 2) return `Line 2: function factorial(n) {   [n = ${currentSnapshot?.variables[0]?.value}]`;
      if (activeLine === 4) return `Line 4: if (n <= 1) {             [checking ${currentSnapshot?.variables[0]?.value} <= 1]`;
      if (activeLine === 5) return `Line 5: return 1;                  [base case reached]`;
      if (activeLine === 9) return `Line 9: return n * factorial(n - 1);`;
    } else if (currentAlgorithm === 'fibonacci') {
      if (activeLine === 2) return `Line 2: function fib(n) {          [n = ${currentSnapshot?.variables[0]?.value}]`;
      if (activeLine === 4) return `Line 4: if (n <= 0) return 0;      [checking ${currentSnapshot?.variables[0]?.value} <= 0]`;
      if (activeLine === 5) return `Line 5: if (n === 1) return 1;     [checking ${currentSnapshot?.variables[0]?.value} === 1]`;
      if (activeLine === 8) return `Line 8: return fib(n - 1) + fib(n - 2);`;
    } else if (currentAlgorithm === 'binarySearch') {
      const vars = currentSnapshot?.variables || [];
      const low = vars.find(v => v.name === 'low')?.value;
      const high = vars.find(v => v.name === 'high')?.value;
      const mid = vars.find(v => v.name === 'mid')?.value;
      
      if (activeLine === 2) return `Line 2: function binarySearch(arr, target, low, high) { [low=${low}, high=${high}]`;
      if (activeLine === 4) return `Line 4: if (low > high) return -1;  [checking ${low} > ${high}]`;
      if (activeLine === 6) return `Line 6: const mid = Math.floor((low + high) / 2);     [mid = ${mid}]`;
      if (activeLine === 9) return `Line 9: if (arr[mid] === target) return mid;         [checking arr[${mid}] === target]`;
      if (activeLine === 12) return `Line 12: if (arr[mid] > target) {`;
      if (activeLine === 13) return `Line 13: return binarySearch(arr, target, low, mid - 1);`;
      if (activeLine === 15) return `Line 15: return binarySearch(arr, target, mid + 1, high);`;
    }
    return `Line ${activeLine}: executing...`;
  };

  return (
    <div className="panel timeline-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={14} className="panel-title-icon" />
          <span>Execution Timeline</span>
        </div>
        <div className="timeline-meta">
          <span className="timeline-step-badge">Step {currentStep} of {totalSteps}</span>
        </div>
      </div>
      
      <div className="panel-body timeline-body">
        <div className="timeline-container">
          <div 
            className="timeline-track-wrapper" 
            onClick={handleTrackClick}
            style={{ cursor: 'pointer', padding: '8px 0' }}
          >
            {/* The active filling bar */}
            <div 
              className="timeline-progress-fill"
              style={{ width: `${progressPercent}%`, height: '4px', top: '8px' }}
            ></div>
            
            {/* The timeline track */}
            <div className="timeline-track" style={{ height: '4px', top: '8px' }}></div>
            
            {/* The playhead node */}
            <div 
              className={`timeline-playhead ${isPlaying ? 'glow-active' : ''}`}
              style={{ left: `${progressPercent}%`, top: '3px' }}
              title={`Playhead: Step ${currentStep}`}
            >
              <div className="playhead-inner"></div>
            </div>

            {/* Individual step ticks */}
            {Array.from({ length: totalSteps + 1 }).map((_, i) => {
              const tickPos = totalSteps > 0 ? (i / totalSteps) * 100 : 0;
              const isPassed = i <= currentStep;
              return (
                <div 
                  key={i} 
                  className={`timeline-tick ${isPassed ? 'passed' : ''}`}
                  style={{ left: `${tickPos}%`, top: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering track click again
                    goToStep(i);
                  }}
                  title={`Step ${i}`}
                >
                  <span className="tick-label">{i}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="timeline-controls-footer">
          <div className="footer-left">
            <span className="debug-state-tag">
              {isPlaying ? 'Replaying' : (currentSnapshot?.executionStatus === 'completed' ? 'Completed' : 'Paused')}
            </span>
            <span className="debug-code-info">{getBreakpointDescription()}</span>
          </div>

          <div className="footer-right">
            <div className="speed-control">
              <Clock size={12} className="speed-icon" />
              <span>Interval:</span>
              <select 
                className="speed-select" 
                value={playbackSpeed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value={2000}>2.0s (Slow)</option>
                <option value={1000}>1.0s (Normal)</option>
                <option value={500}>0.5s (Fast)</option>
                <option value={250}>0.25s (Super Fast)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
