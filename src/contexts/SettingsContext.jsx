import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  theme: 'dark',
  animationSpeed: 1, // multiplier (e.g. 1x, 2x, 0.5x)
  playbackSpeed: 500, // ms per step for auto-play
  treeLayout: 'vertical',
  enableAnimations: true,
  showLineNumbers: true,
  developerMode: false,
  zoomEnabled: true,
  showStats: false
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('recurscope_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to parse settings from local storage");
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('recurscope_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Backwards compatibility for existing toggles
  const toggleTheme = () => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  const toggleStats = () => updateSetting('showStats', !settings.showStats);
  const setZoomEnabled = (val) => updateSetting('zoomEnabled', val);

  return (
    <SettingsContext.Provider value={{ 
      ...settings, 
      updateSetting, 
      resetSettings,
      toggleTheme, 
      toggleStats,
      setZoomEnabled
    }}>
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
