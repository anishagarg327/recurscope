import metadata from './metadata';
import source from './source';
import { runFibonacciSimulation } from './simulation';

export default {
  ...metadata,
  sourceCode: source,
  run: (n) => runFibonacciSimulation(n)
};
