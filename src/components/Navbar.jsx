import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  GitCommit,
  Moon,
  Play
} from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

export default function Navbar() {
  const {
    currentAlgorithm,
    setAlgorithm,
    isPlaying,
    currentSnapshot,
    factorialInput,
    runAlgorithm
  } = useExecution();

  const [localInput, setLocalInput] = useState(factorialInput);

  useEffect(() => {
    setLocalInput(factorialInput);
  }, [factorialInput]);

  const algorithms = [
    { id: 'factorial', name: 'Factorial (N!)' },
    { id: 'fibonacci', name: 'Fibonacci Sequence' },
    { id: 'binarySearch', name: 'Binary Search' }
  ];

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

  const handleRun = () => {
    runAlgorithm(localInput);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-badge">
          <GitCommit className="logo-badge-icon" size={18} />
        </div>
        <span className="logo-text">Recurscope</span>
        <span className="logo-version">v0.1.0</span>
      </div>

      <div className="navbar-center" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
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

        {currentAlgorithm === 'factorial' && (
          <div className="navbar-run-control" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div className="navbar-divider" style={{ height: '20px', margin: '0' }}></div>
            <div className="input-container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>n =</label>
              <input 
                type="number" 
                value={localInput} 
                onChange={(e) => setLocalInput(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                min="1"
                max="10"
                style={{
                  width: '50px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 6px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>
            <button 
              onClick={handleRun}
              className="player-btn main-play-btn"
              style={{
                height: '26px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                backgroundColor: 'var(--accent-dim)',
                color: 'var(--text-accent)',
                border: '1px solid var(--accent-dim-border)',
                borderRadius: 'var(--radius-xs)',
                transition: 'all 0.15s ease'
              }}
            >
              <Play size={11} fill="currentColor" />
              <span>Run</span>
            </button>
          </div>
        )}
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
