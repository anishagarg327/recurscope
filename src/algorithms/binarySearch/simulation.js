import snapshots from '../../data/algorithms/binarySearch/execution.json';

export function runBinarySearchSimulation(n) {
  // Map eventType to event to ensure consistency across the generic debugger
  return snapshots.map((snap) => ({
    ...snap,
    event: snap.eventType || 'CALL'
  }));
}
