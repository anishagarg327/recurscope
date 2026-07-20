import React, { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Playground from './pages/Playground';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AlgorithmsProvider } from './contexts/AlgorithmsContext';
import { ExecutionProvider } from './contexts/ExecutionContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import './App.css';

// Lazy load other pages to keep the initial bundle clean (optional, but good practice).
// For now, we will import them normally as they are created.
import Algorithms from './pages/Algorithms';
import Examples from './pages/Examples';
import Theory from './pages/Theory';
import ReplaySessions from './pages/ReplaySessions';
import Settings from './pages/Settings';

function PageRouter() {
  const { currentPage } = useNavigation();

  return (
    <div className="main-content" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Playground is always mounted to preserve localized states like Canvas Pan/Zoom */}
      <div style={{ display: currentPage === 'Playground' ? 'block' : 'none', height: '100%' }}>
        <Playground />
      </div>

      {currentPage === 'Algorithms' && <Algorithms />}
      {currentPage === 'Examples' && <Examples />}
      {currentPage === 'Theory' && <Theory />}
      {currentPage === 'Replay Sessions' && <ReplaySessions />}
      {currentPage === 'Settings' && <Settings />}
    </div>
  );
}

function MainLayout() {
  const { theme } = useSettings();

  return (
    <ErrorBoundary>
      <div className={`app-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <div className="main-body">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Central Router Area */}
        <PageRouter />
      </div>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <SettingsProvider>
      <NavigationProvider>
        <AlgorithmsProvider>
          <ExecutionProvider>
            <PlaybackProvider>
              <MainLayout />
            </PlaybackProvider>
          </ExecutionProvider>
        </AlgorithmsProvider>
      </NavigationProvider>
    </SettingsProvider>
  );
}

export default App;
