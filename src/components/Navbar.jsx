import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Moon, 
  ChevronDown, 
  GitCommit
} from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function Navbar() {
  const {
    currentAlgorithm,
    setAlgorithm,
    nextStep,
    prevStep,
    togglePlay,
    isPlaying,
    snapshots,
    currentSnapshotIndex,
    currentSnapshot
  } = useExecution();

  const algorithms = [
    { id: 'factorial', name: 'Factorial (N!)' },
    { id: 'fibonacci', name: 'Fibonacci Sequence' },
    { id: 'binarySearch', name: 'Binary Search' }
  ];

  // Map executionStatus to a user-friendly label and color class
  const getStatusDetails = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', class: 'status-completed' };
      case 'running':
        return { text: 'Running...', class: 'status-running' };
      case 'paused':
      default:
        return { text: 'Debugger Idle', class: 'status-idle' };
    }
  };

  const statusInfo = getStatusDetails(isPlaying ? 'running' : currentSnapshot?.executionStatus);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-badge">
          <GitCommit className="logo-badge-icon" size={18} />
        </div>
        <span className="logo-text">Recurscope</span>
        <span className="logo-version">v0.1.0</span>
      </div>

      <div className="navbar-center">
        {/* Algorithm Selector Dropdown */}
        <div className="dropdown-container">
          <label className="dropdown-label">Algorithm</label>
          <div className="dropdown-select-wrapper">
            <select 
              value={currentAlgorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              className="dropdown-select"
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="controls-group">
          <button 
            className="control-btn" 
            onClick={prevStep}
            disabled={currentSnapshotIndex === 0}
            title="Step Backward"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button 
            className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? "Pause Simulation" : "Run Simulation"}
          >
            {isPlaying ? (
              <>
                <Pause size={14} fill="currentColor" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Run</span>
              </>
            )}
          </button>

          <button 
            className="control-btn" 
            onClick={nextStep}
            disabled={currentSnapshotIndex === snapshots.length - 1}
            title="Step Forward"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {/* Dynamic status indicator */}
        <div className={`status-pill ${statusInfo.class}`}>
          <span className="status-dot"></span>
          <span>{statusInfo.text}</span>
        </div>

        <button className="icon-btn theme-toggle" title="Toggle Theme">
          <Moon size={16} />
        </button>

        <div className="navbar-divider"></div>

        <div className="user-avatar-wrapper">
          <div className="navbar-avatar">
            <span>SD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
