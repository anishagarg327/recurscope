import { ExecutionEvent } from './types';

export const computeStatistics = (algorithmId, index, snapshots) => {
  if (!snapshots || snapshots.length === 0) return [];
  
  const currentSnapshot = snapshots[index] || snapshots[0];
  const maxDepth = Math.max(...snapshots.slice(0, index + 1).map((s) => s.depth || 1));
  const activeCalls = currentSnapshot?.callStack?.length || 1;
  
  if (algorithmId === 'factorial') {
    const totalCallsCount = currentSnapshot?.recursionTreeNodes?.length || 1;
    const baseCaseHitsCount = snapshots.slice(0, index + 1).filter((s) => s.event === ExecutionEvent.BASE_CASE).length;
    
    return [
      { label: 'Total Calls', value: `${totalCallsCount}`, icon: 'BarChart3', color: 'info' },
      { label: 'Max Depth', value: `${maxDepth}`, icon: 'Layers3', color: 'accent' },
      { label: 'Current Depth', value: `${activeCalls}`, icon: 'Layers3', color: 'warning' },
      { label: 'Execution Time', value: `${(index * 0.005).toFixed(3)}ms`, icon: 'Hourglass', color: 'success' },
      { label: 'Base Case Hits', value: `${baseCaseHitsCount}`, icon: 'CheckCircle2', color: 'success' },
      { label: 'Repeated Calls', value: '0', icon: 'Copy', color: 'muted' },
      { label: 'Memory Overhead', value: `${(activeCalls * 0.08).toFixed(1)} KB`, icon: 'Cpu', color: 'danger' }
    ];
  } else if (algorithmId === 'fibonacci') {
    const totalCallsCount = Math.max(1, currentSnapshot?.recursionTreeNodes?.length || 1);
    const repeatedCallsCount = Math.max(0, currentSnapshot?.recursionTreeNodes?.filter((n) => n.label === 'f(1)' || n.label === 'f(0)').length - 2);
    const baseCaseHitsCount = currentSnapshot?.recursionTreeNodes?.filter((n) => n.status === 'success' && (n.label === 'f(1)' || n.label === 'f(0)')).length || 0;
    
    return [
      { label: 'Total Calls', value: `${totalCallsCount}`, icon: 'BarChart3', color: 'info' },
      { label: 'Max Depth', value: `${maxDepth}`, icon: 'Layers3', color: 'accent' },
      { label: 'Current Depth', value: `${activeCalls}`, icon: 'Layers3', color: 'warning' },
      { label: 'Execution Time', value: `${(index * 0.008).toFixed(3)}ms`, icon: 'Hourglass', color: 'success' },
      { label: 'Base Case Hits', value: `${baseCaseHitsCount}`, icon: 'CheckCircle2', color: 'success' },
      { label: 'Repeated Calls', value: `${repeatedCallsCount > 0 ? repeatedCallsCount : 0}`, icon: 'Copy', color: repeatedCallsCount > 0 ? 'danger' : 'muted' },
      { label: 'Memory Overhead', value: `${(activeCalls * 0.12).toFixed(1)} KB`, icon: 'Cpu', color: 'danger' }
    ];
  } else {
    // Binary Search
    const totalCallsCount = currentSnapshot?.recursionTreeNodes?.length || 1;
    const baseCaseHitsCount = snapshots.slice(0, index + 1).filter((s) => s.event === ExecutionEvent.BASE_CASE).length;
    
    return [
      { label: 'Total Calls', value: `${totalCallsCount}`, icon: 'BarChart3', color: 'info' },
      { label: 'Max Depth', value: `${maxDepth}`, icon: 'Layers3', color: 'accent' },
      { label: 'Current Depth', value: `${activeCalls}`, icon: 'Layers3', color: 'warning' },
      { label: 'Execution Time', value: `${(index * 0.004).toFixed(3)}ms`, icon: 'Hourglass', color: 'success' },
      { label: 'Base Case Hits', value: `${baseCaseHitsCount}`, icon: 'CheckCircle2', color: 'success' },
      { label: 'Repeated Calls', value: '0', icon: 'Copy', color: 'muted' },
      { label: 'Memory Overhead', value: `${(activeCalls * 0.06).toFixed(1)} KB`, icon: 'Cpu', color: 'danger' }
    ];
  }
};
