import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAlgorithms } from './AlgorithmsContext';

const ExecutionContext = createContext(null);

export const ExecutionProvider = ({ children }) => {
  const { activeAlgorithm, selectedAlgorithmId } = useAlgorithms();
  const [factorialInput, setFactorialInput] = useState(5);
  const [snapshots, setSnapshots] = useState([]);

  // Generate the session dynamically based on active algorithm and input values
  const generateSession = useCallback((algo, inputVal) => {
    if (!algo) return [];
    return algo.run(inputVal);
  }, []);

  // Update snapshots when the selected algorithm changes
  useEffect(() => {
    const inputVal = selectedAlgorithmId === 'factorial' ? factorialInput : 5;
    const session = generateSession(activeAlgorithm, inputVal);
    setSnapshots(session);
  }, [selectedAlgorithmId, activeAlgorithm, factorialInput, generateSession]);

  const runAlgorithm = useCallback((inputVal) => {
    if (selectedAlgorithmId === 'factorial') {
      setFactorialInput(inputVal);
    }
    const session = generateSession(activeAlgorithm, inputVal);
    setSnapshots(session);
  }, [selectedAlgorithmId, activeAlgorithm, generateSession]);

  return (
    <ExecutionContext.Provider
      value={{
        snapshots,
        factorialInput,
        runAlgorithm
      }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};

export const useExecution = () => {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error('useExecution must be used within an ExecutionProvider');
  }
  return context;
};
