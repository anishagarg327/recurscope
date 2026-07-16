import factorial from '../../algorithms/factorial';
import fibonacci from '../../algorithms/fibonacci';
import binarySearch from '../../algorithms/binarySearch';

class AlgorithmRegistry {
  constructor() {
    this.registry = new Map();
    this.register(factorial);
    this.register(fibonacci);
    this.register(binarySearch);
  }

  register(algo) {
    if (!algo.id) {
      throw new Error('Algorithm must expose a unique ID');
    }
    this.registry.set(algo.id, algo);
  }

  get(id) {
    return this.registry.get(id);
  }

  getAll() {
    return Array.from(this.registry.values());
  }
}

const registryInstance = new AlgorithmRegistry();
export default registryInstance;
