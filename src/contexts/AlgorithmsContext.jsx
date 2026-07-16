import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import registry from '../core/services/AlgorithmRegistry';

const AlgorithmsContext = createContext(null);

export const AlgorithmsProvider = ({ children }) => {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('factorial');

  const activeAlgorithm = useMemo(() => {
    return registry.get(selectedAlgorithmId);
  }, [selectedAlgorithmId]);

  const allAlgorithms = useMemo(() => {
    return registry.getAll();
  }, []);

  const selectAlgorithm = useCallback((id) => {
    setSelectedAlgorithmId(id);
  }, []);

  return (
    <AlgorithmsContext.Provider
      value={{
        selectedAlgorithmId,
        activeAlgorithm,
        allAlgorithms,
        selectAlgorithm
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
