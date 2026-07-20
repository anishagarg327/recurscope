import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAlgorithms } from './AlgorithmsContext';
import { runCustomSimulation } from '../core/sandbox/CustomSandbox';

const ExecutionContext = createContext(null);

export const ExecutionProvider = ({ children }) => {
  const { activeAlgorithm, selectedAlgorithmId, isCustomMode, customCode, customParams } = useAlgorithms();
  const [factorialInput, setFactorialInput] = useState(5);
  const [snapshots, setSnapshots] = useState([]);

  // Generate the session dynamically based on active algorithm and input values
  const generateSession = useCallback((algo, inputVal) => {
    if (isCustomMode) {
      const args = customParams.map(p => isNaN(Number(p.value)) ? p.value : Number(p.value));
      return runCustomSimulation(customCode, args);
    }
    if (!algo) return [];
    return algo.run(inputVal);
  }, [isCustomMode, customCode, customParams]);

  // Update snapshots when the selected algorithm changes
  useEffect(() => {
    const inputVal = selectedAlgorithmId === 'factorial' ? factorialInput : 5;
    const session = generateSession(activeAlgorithm, inputVal);
    setSnapshots(session);
  }, [selectedAlgorithmId, activeAlgorithm, factorialInput, generateSession, isCustomMode, customCode]);

  const runAlgorithm = useCallback((inputVal) => {
    if (selectedAlgorithmId === 'factorial') {
      setFactorialInput(inputVal);
    }
    const session = generateSession(activeAlgorithm, inputVal);
    setSnapshots(session);
  }, [selectedAlgorithmId, activeAlgorithm, generateSession]);

  const triggerExecution = useCallback((algoId, args) => {
    // Force the UI to show this algorithm
    // (Note: selectAlgorithm comes from AlgorithmsContext)
    // But we need to import registry to run it immediately without waiting for React state flush
    import('../core/services/AlgorithmRegistry').then(({ default: registry }) => {
      const algo = registry.get(algoId);
      if (algo) {
        const session = algo.run(...args);
        setSnapshots(session);
        // Also save to history!
        try {
          const saved = JSON.parse(localStorage.getItem('recurscope_sessions') || '[]');
          const newSession = {
            id: Date.now().toString(),
            algo: algoId,
            args: args,
            date: new Date().toISOString(),
            steps: session.length,
            maxDepth: Math.max(...session.map(s => s.depth || 0))
          };
          localStorage.setItem('recurscope_sessions', JSON.stringify([newSession, ...saved]));
        } catch (e) {}
      }
    });
  }, []);

  return (
    <ExecutionContext.Provider
      value={{
        snapshots,
        factorialInput,
        runAlgorithm,
        triggerExecution
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
