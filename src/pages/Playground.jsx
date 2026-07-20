import React from 'react';
import CodeEditor from '../components/panels/CodeEditor';
import CallStack from '../components/panels/CallStack';
import VariableInspector from '../components/panels/VariableInspector';
import RecursionTree from '../components/panels/RecursionTree';
import ExecutionDetails from '../components/panels/ExecutionDetails';
import Statistics from '../components/panels/Statistics';
import ExecutionTimeline from '../components/panels/ExecutionTimeline';
import { useSettings } from '../contexts/SettingsContext';

export default function Playground() {
  const { showStats } = useSettings();

  return (
    <div className="workspace-container">
      {/* Main Grid Panels Area */}
      <div className="workspace-content">
        {/* Left Column: Code Editor & Variable Inspector */}
        <div className="workspace-col-left">
          <CodeEditor />
          <div className="resizer-v"></div>
          <VariableInspector />
        </div>

        <div className="resizer-h"></div>

        {/* Center Column: Recursion Tree Canvas */}
        <div className="workspace-col-center">
          <RecursionTree />
        </div>

        <div className="resizer-h"></div>

        {/* Right Column: Call Stack & Execution Details */}
        <div className="workspace-col-right">
          <CallStack />
          <div className="resizer-v"></div>
          <ExecutionDetails />
        </div>
      </div>

      {/* Collapsible Stats Bottom Drawer */}
      <div className={`stats-drawer-container ${showStats ? 'expanded' : 'collapsed'}`}>
        <div className="stats-drawer-content">
          <Statistics />
        </div>
      </div>

      {/* Bottom Row: Execution Timeline controls */}
      <div className="timeline-row">
        <ExecutionTimeline />
      </div>
    </div>
  );
}
