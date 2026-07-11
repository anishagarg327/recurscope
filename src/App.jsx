import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CodeEditor from './components/CodeEditor';
import CallStack from './components/CallStack';
import VariableInspector from './components/VariableInspector';
import RecursionTree from './components/RecursionTree';
import Statistics from './components/Statistics';
import ExecutionTimeline from './components/ExecutionTimeline';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <div className="main-body">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Central & Right Columns Workspace Container */}
        <div className="workspace-container">
          {/* Main Grid Panels Area */}
          <div className="workspace-content">
            {/* Left Column: Code Editor & Variable Inspector */}
            <div className="workspace-col-left">
              <CodeEditor />
              
              {/* Visual Row Splitter */}
              <div className="resizer-v"></div>
              
              <VariableInspector />
            </div>

            {/* Visual Column Splitter */}
            <div className="resizer-h"></div>

            {/* Center Column: Recursion Tree Canvas & Statistics Dashboard */}
            <div className="workspace-col-center">
              <RecursionTree />
              
              {/* Visual Row Splitter */}
              <div className="resizer-v"></div>
              
              <Statistics />
            </div>

            {/* Visual Column Splitter */}
            <div className="resizer-h"></div>

            {/* Right Column: Call Stack frames list */}
            <div className="workspace-col-right">
              <CallStack />
            </div>
          </div>

          {/* Bottom Row: Execution Timeline controls */}
          <div className="timeline-row">
            <ExecutionTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
