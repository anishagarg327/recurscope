import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleStats = () => setShowStats((prev) => !prev);

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, zoomEnabled, setZoomEnabled, showStats, toggleStats }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
