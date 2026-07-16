import metadata from './metadata';
import source from './source';
import { runFactorialSimulation } from './simulation';

export default {
  ...metadata,
  sourceCode: source,
  run: (n) => runFactorialSimulation(n)
};
