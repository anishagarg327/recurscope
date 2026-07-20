import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import registry from '../core/services/AlgorithmRegistry';

const AlgorithmsContext = createContext(null);

export const AlgorithmsProvider = ({ children }) => {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('fibonacci');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCode, setCustomCode] = useState(`function customRecursion(n) {
  if (n <= 1) return n;
  return customRecursion(n - 1) + customRecursion(n - 2);
}`);
  const [customParams, setCustomParams] = useState([{ name: 'n', value: 5 }]);

  const activeAlgorithm = useMemo(() => {
    return registry.get(selectedAlgorithmId);
  }, [selectedAlgorithmId]);

  const allAlgorithms = useMemo(() => {
    return registry.getAll();
  }, []);

  const selectAlgorithm = useCallback((id) => {
    setSelectedAlgorithmId(id);
    setIsCustomMode(false); // Switching back to predefined sets custom to false
  }, []);

  // Parse parameters from custom code using regex for UI bindings
  React.useEffect(() => {
    const match = customCode.match(/function\s+\w+\s*\(([^)]*)\)/);
    if (match) {
      const paramNames = match[1].split(',').map(p => p.trim()).filter(Boolean);
      setCustomParams(prev => {
        return paramNames.map(name => {
          const existing = prev.find(p => p.name === name);
          return { name, value: existing ? existing.value : '' };
        });
      });
    }
  }, [customCode]);

  return (
    <AlgorithmsContext.Provider
      value={{
        selectedAlgorithmId,
        activeAlgorithm,
        allAlgorithms,
        selectAlgorithm,
        isCustomMode,
        setIsCustomMode,
        customCode,
        setCustomCode,
        customParams,
        setCustomParams
      }}
    >
      {children}
    </AlgorithmsContext.Provider>
  );
};

export const useAlgorithms = () => {
  const context = useContext(AlgorithmsContext);
  if (!context) {
    throw new Error('useAlgorithms must be used within an AlgorithmsProvider');
  }
  return context;
};
