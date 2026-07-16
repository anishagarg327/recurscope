import RecursionRecorder from '../../core/recorder/RecursionRecorder';

export function runFactorialSimulation(n) {
  const recorder = new RecursionRecorder('factorial');
  recorder.start();

  function recFactorial(val, parentNodeId = null, depth = 0) {
    const nodeId = `node_${depth + 1}`;
    const label = `f(${val})`;
    const cx = 80 + depth * 110;
    const cy = 160;

    // 1. Function Call entry (Line 2)
    recorder.recordCall({
      currentLine: 2,
      functionName: `factorial(${val})`,
      variables: [
        { name: 'n', value: String(val), type: 'number' }
      ],
      node: { id: nodeId, label, cx, cy, depth, status: 'active' },
      edge: parentNodeId ? { from: parentNodeId, to: nodeId, status: 'active' } : null,
      activeNodeId: nodeId,
      depth: depth + 1,
      statusMessage: `Entering factorial(${val})`
    });

    // 2. Base Case Check (Line 4)
    recorder.recordCall({
      currentLine: 4,
      functionName: `factorial(${val})`,
      variables: [
        { name: 'n', value: String(val), type: 'number' }
      ],
      activeNodeId: nodeId,
      depth: depth + 1,
      statusMessage: `Evaluating base condition n <= 1`
    });

    if (val <= 1) {
      // 3. Base case return (Line 5)
      recorder.recordBaseCase({
        currentLine: 5,
        functionName: `factorial(${val})`,
        variables: [
          { name: 'n', value: String(val), type: 'number' },
          { name: 'returnValue', value: '1', type: 'number' }
        ],
        returnValue: 1,
        activeNodeId: nodeId,
        depth: depth + 1,
        statusMessage: `Reached Base Case`
      });
      return 1;
    }

    // 4. Recursive line call (Line 9 - before recursive call)
    recorder.recordCall({
      currentLine: 9,
      functionName: `factorial(${val})`,
      variables: [
        { name: 'n', value: String(val), type: 'number' }
      ],
      activeNodeId: nodeId,
      depth: depth + 1,
      pendingDescription: `n = ${val}, pending: ${val} * f(${val - 1})`,
      statusMessage: `Calling factorial(${val - 1})`
    });

    // Recurse
    const subResult = recFactorial(val - 1, nodeId, depth + 1);

    const result = val * subResult;

    // 5. Function Return (Line 9 - after recursive call returned)
    recorder.recordReturn({
      currentLine: 9,
      functionName: `factorial(${val})`,
      variables: [
        { name: 'n', value: String(val), type: 'number' },
        { name: `f(${val - 1}) return`, value: String(subResult), type: 'number' },
        { name: 'returnValue', value: String(result), type: 'number' }
      ],
      returnValue: result,
      activeNodeId: nodeId,
      depth: depth + 1,
      pendingDescription: `n = ${val}, f(${val - 1}) = ${subResult}, returning ${val} * ${subResult}`,
      statusMessage: `Returning value ${result}`
    });

    return result;
  }

  recFactorial(n, null, 0);
  recorder.finish();
  return recorder.getExecutionSession();
}
