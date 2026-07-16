import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Square, 
  Clock, 
  BarChart3, 
  Sliders,
  Bookmark
} from 'lucide-react';
import { usePlayback } from '../../contexts/PlaybackContext';
import { useExecution } from '../../contexts/ExecutionContext';
import { useAlgorithms } from '../../contexts/AlgorithmsContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getTypeColorClass } from '../../core/execution/types';

export default function ExecutionTimeline() {
  const { 
    currentStepIndex, 
    currentSnapshot, 
    isPlaying, 
    playbackSpeed, 
    bookmarks,
    nextStep, 
    prevStep, 
    goToStep, 
    togglePlay, 
    stop, 
    restart, 
    setSpeed, 
    toggleBookmark 
  } = usePlayback();

  const { snapshots } = useExecution();
  const { activeAlgorithm } = useAlgorithms();
  const { showStats, toggleStats } = useSettings();

  const [hoverIndex, setHoverIndex] = useState(null);

  const totalSteps = snapshots.length - 1;
  const currentStep = currentStepIndex;
  const progressPercentRaw = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const progressPercent = Math.round(progressPercentRaw);

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const step = Math.round(ratio * totalSteps);
    goToStep(step);
  };

  const getBreakpointDescription = () => {
    const activeLine = currentSnapshot?.currentLine || 1;
    if (!activeAlgorithm?.sourceCode) return `Line ${activeLine}`;
    const lines = activeAlgorithm.sourceCode.split('\n');
    const lineText = lines[activeLine - 1] || '';
    return `Line ${activeLine}: ${lineText.trim()}`;
  };

  return (
    <div className="panel timeline-panel" style={{ position: 'relative' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={14} className="panel-title-icon" />
          <span>Playback Timeline</span>
        </div>
        <div className="timeline-meta" style={{ gap: 'var(--space-md)' }}>
          <span className="timeline-step-badge">Step {currentStep} of {totalSteps >= 0 ? totalSteps : 0}</span>
          <span className="timeline-percent-badge">{progressPercent}%</span>
        </div>
      </div>
      
      <div className="panel-body timeline-body" style={{ gap: 'var(--space-sm)', position: 'relative' }}>
        {/* Track Slider Bar */}
        <div className="timeline-container" style={{ position: 'relative' }}>
          <div 
            className="timeline-track-wrapper" 
            onClick={handleTrackClick}
            style={{ cursor: 'pointer', padding: '8px 0', position: 'relative' }}
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

            {/* Hover preview card popup */}
            {hoverIndex !== null && snapshots[hoverIndex] && (
              <div 
                className="timeline-hover-tooltip"
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: `${totalSteps > 0 ? (hoverIndex / totalSteps) * 100 : 0}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--bg-panel-header)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xs)',
                  padding: 'var(--space-xs) var(--space-sm)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                  zIndex: 100,
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '160px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  <span>STEP {hoverIndex}</span>
                  <span className={`badge-text badge-${snapshots[hoverIndex]?.event?.toLowerCase()}`}>
                    {snapshots[hoverIndex]?.event}
                  </span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {snapshots[hoverIndex]?.statusMessage}
                </div>
              </div>
            )}

            {snapshots.map((snap, i) => {
              const tickPos = totalSteps > 0 ? (i / totalSteps) * 100 : 0;
              const isPassed = i <= currentStep;
              const isBookmarked = bookmarks.includes(i);
              return (
                <div 
                  key={i} 
                  className={`timeline-tick ${isPassed ? 'passed' : ''} ${isBookmarked ? 'bookmarked' : ''}`}
                  style={{ left: `${tickPos}%`, top: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(i);
                  }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
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
            {currentSnapshot && (
              <span className={`event-badge ${getTypeColorClass(currentSnapshot.event)}`}>
                {currentSnapshot.event}
              </span>
            )}
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

            <button 
              className={`player-btn ${bookmarks.includes(currentStepIndex) ? 'bookmark-active' : ''}`}
              onClick={() => toggleBookmark(currentStepIndex)}
              title="Toggle Bookmark"
              style={{ color: bookmarks.includes(currentStepIndex) ? 'var(--accent)' : 'inherit' }}
            >
              <Bookmark size={13} fill={bookmarks.includes(currentStepIndex) ? "currentColor" : "none"} />
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
              onClick={toggleStats}
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
