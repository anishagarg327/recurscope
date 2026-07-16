import metadata from './metadata';
import source from './source';
import { runBinarySearchSimulation } from './simulation';

export default {
  ...metadata,
  sourceCode: source,
  run: (n) => runBinarySearchSimulation(n)
};
