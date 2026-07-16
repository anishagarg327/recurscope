import React from 'react';
import { 
  Sliders, 
  Clock, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  BarChart3,
  Square,
  RotateCcw
} from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function ExecutionTimeline({ showStats, onToggleStats }) {
  const {
    currentAlgorithm,
    snapshots,
    currentSnapshotIndex,
    currentSnapshot,
    goToStep,
    playbackSpeed,
    setSpeed,
    isPlaying,
    nextStep,
    prevStep,
    togglePlay,
    stop,
    restart
  } = useExecution();

  const totalSteps = snapshots.length - 1;
  const currentStep = currentSnapshotIndex;
  
  // Calculate percentage progress
  const progressPercentRaw = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const progressPercent = Math.round(progressPercentRaw);

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
      if (activeLine === 2) return `Line 2: function factorial(n)`;
      if (activeLine === 4) return `Line 4: if (n <= 1)`;
      if (activeLine === 5) return `Line 5: return 1`;
      if (activeLine === 9) return `Line 9: return n * factorial(n - 1)`;
    } else if (currentAlgorithm === 'fibonacci') {
      if (activeLine === 2) return `Line 2: function fib(n)`;
      if (activeLine === 4) return `Line 4: if (n <= 0) return 0`;
      if (activeLine === 5) return `Line 5: if (n === 1) return 1`;
      if (activeLine === 8) return `Line 8: return fib(n - 1) + fib(n - 2)`;
    } else if (currentAlgorithm === 'binarySearch') {
      const vars = currentSnapshot?.variables || [];
      const low = vars.find(v => v.name === 'low')?.value;
      const high = vars.find(v => v.name === 'high')?.value;
      
      if (activeLine === 2) return `Line 2: function BS [low=${low}, high=${high}]`;
      if (activeLine === 4) return `Line 4: if (low > high)`;
      if (activeLine === 6) return `Line 6: const mid`;
      if (activeLine === 9) return `Line 9: if (arr[mid] === target)`;
      if (activeLine === 12) return `Line 12: if (arr[mid] > target)`;
      if (activeLine === 13) return `Line 13: return BS(left)`;
      if (activeLine === 15) return `Line 15: return BS(right)`;
    }
    return `Line ${activeLine}`;
  };

  return (
    <div className="panel timeline-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={14} className="panel-title-icon" />
          <span>Playback Timeline</span>
        </div>
        <div className="timeline-meta" style={{ gap: 'var(--space-md)' }}>
          <span className="timeline-step-badge">Step {currentStep} of {totalSteps}</span>
          <span className="timeline-percent-badge">{progressPercent}%</span>
        </div>
      </div>
      
      <div className="panel-body timeline-body" style={{ gap: 'var(--space-sm)' }}>
        {/* Track Slider Bar */}
        <div className="timeline-container">
          <div 
            className="timeline-track-wrapper" 
            onClick={handleTrackClick}
            style={{ cursor: 'pointer', padding: '8px 0' }}
          >
            <div 
              className="timeline-progress-fill"
              style={{ width: `${progressPercentRaw}%`, height: '4px', top: '8px' }}
            ></div>
            <div className="timeline-track" style={{ height: '4px', top: '8px' }}></div>
            <div 
              className={`timeline-playhead ${isPlaying ? 'glow-active' : ''}`}
              style={{ left: `${progressPercentRaw}%`, top: '3px' }}
              title={`Playhead: Step ${currentStep}`}
            >
              <div className="playhead-inner"></div>
            </div>

            {Array.from({ length: totalSteps + 1 }).map((_, i) => {
              const tickPos = totalSteps > 0 ? (i / totalSteps) * 100 : 0;
              const isPassed = i <= currentStep;
              return (
                <div 
                  key={i} 
                  className={`timeline-tick ${isPassed ? 'passed' : ''}`}
                  style={{ left: `${tickPos}%`, top: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
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

        {/* Player Buttons & Metadata Controls */}
        <div className="timeline-controls-footer" style={{ marginTop: 'var(--space-sm)', alignItems: 'center' }}>
          <div className="footer-left" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-md)', overflow: 'hidden' }}>
            <span className={`event-badge badge-${currentSnapshot?.eventType?.toLowerCase().replace('_', '-')}`}>
              {currentSnapshot?.eventType}
            </span>
            <span className="status-message-text" style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {currentSnapshot?.statusMessage}
            </span>
            <span className="debug-code-info" style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {getBreakpointDescription()}
            </span>
          </div>

          {/* Center Playback Buttons */}
          <div className="timeline-player-buttons" style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
            <button 
              className="player-btn"
              onClick={restart}
              title="Restart (R)"
            >
              <RotateCcw size={14} />
            </button>

            <button 
              className="player-btn"
              onClick={prevStep}
              disabled={currentStep === 0}
              title="Previous Step (Left Arrow)"
            >
              <SkipBack size={14} />
            </button>

            <button 
              className={`player-btn main-play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>

            <button 
              className="player-btn"
              onClick={stop}
              title="Stop"
            >
              <Square size={13} fill="currentColor" style={{ stroke: 'none' }} />
            </button>

            <button 
              className="player-btn"
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              title="Next Step (Right Arrow)"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Right speed select & statistics toggle */}
          <div className="footer-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div className="speed-control" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Clock size={12} className="speed-icon" />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speed:</span>
              <select 
                className="speed-select" 
                value={playbackSpeed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{ padding: '2px 4px', fontSize: '11px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-panel)' }}
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
              </select>
            </div>

            <div className="navbar-divider" style={{ height: '14px', margin: '0' }}></div>

            <button 
              className={`stats-toggle-btn ${showStats ? 'active' : ''}`}
              onClick={onToggleStats}
              title={showStats ? "Hide Statistics" : "Show Statistics"}
            >
              <BarChart3 size={14} />
              <span>Stats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
