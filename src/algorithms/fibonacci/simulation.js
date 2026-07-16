import snapshots from '../../data/algorithms/fibonacci/execution.json';

export function runFibonacciSimulation(n) {
  // Map eventType to event to ensure consistency across the generic debugger
  return snapshots.map((snap) => ({
    ...snap,
    event: snap.eventType || 'CALL'
  }));
}
