import * as Babel from '@babel/standalone';
import RecursionRecorder from '../recorder/RecursionRecorder';

export function runCustomSimulation(code, argValues) {
  const recorder = new RecursionRecorder('custom');
  recorder.start();

  try {
    // 1. Transpile code to inject tracker
    let mainFuncName = null;
    let paramNames = [];

    const plugin = function(babel) {
      const { types: t } = babel;
      return {
        visitor: {
          Program(path) {
            // Find the first function declaration to use as the main entry point
            path.traverse({
              FunctionDeclaration(fp) {
                if (!mainFuncName) {
                  mainFuncName = fp.node.id.name;
                  paramNames = fp.node.params.map(p => p.name);
                }
              }
            });
          },
          FunctionDeclaration(path) {
            const funcName = path.node.id.name;
            const params = path.node.params.map(p => p.name);
            
            // At the start of the function, inject:
            // __tracer.enter("funcName", { param1: param1, ... });
            const argsObj = t.objectExpression(
              params.map(p => t.objectProperty(t.identifier(p), t.identifier(p)))
            );
            
            const enterCall = t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier('__tracer'), t.identifier('enter')),
                [t.stringLiteral(funcName), argsObj]
              )
            );
            
            // Before every return, inject:
            // __tracer.exit(returnValue);
            path.traverse({
              ReturnStatement(retPath) {
                if (!retPath.node.argument || retPath.node._isTraced) return;
                
                const retVar = retPath.scope.generateUidIdentifier("ret");
                const decl = t.variableDeclaration("const", [
                  t.variableDeclarator(retVar, retPath.node.argument)
                ]);
                
                const exitCall = t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.identifier('__tracer'), t.identifier('exit')),
                    [retVar]
                  )
                );
                
                const newRet = t.returnStatement(retVar);
                newRet._isTraced = true;
                
                retPath.replaceWithMultiple([decl, exitCall, newRet]);
              }
            });
            
            path.get('body').unshiftContainer('body', enterCall);
          }
        }
      };
    };

    const output = Babel.transform(code, {
      plugins: [plugin],
      presets: ['env'] // optional, if we want broad support
    });

    // 2. Setup Tracer runtime
    // The tracer maintains a stack of calls.
    // It calls recorder.recordCall and recorder.recordReturn.
    let callIdCounter = 0;
    const stack = [];

    const __tracer = {
      enter: (fnName, args) => {
        if (stack.length > 500) throw new Error("Maximum recursion depth exceeded (500).");
        
        const depth = stack.length;
        const parentId = depth > 0 ? stack[depth - 1].id : null;
        const id = `node_${++callIdCounter}`;
        
        stack.push({ id, fnName, depth, args });
        
        // Format variables array
        const variables = Object.entries(args).map(([k, v]) => ({
          name: k,
          value: String(v),
          type: typeof v
        }));
        
        recorder.recordCall({
          currentLine: 1, // AST line tracking can be added later
          functionName: `${fnName}(${Object.values(args).join(', ')})`,
          variables: variables,
          node: { id, label: `${fnName}(${Object.values(args).join(', ')})`, cx: 0, cy: 0, depth, status: 'active' }, // Positions are handled by auto-layout now
          edge: parentId ? { from: parentId, to: id, status: 'active' } : null,
          activeNodeId: id,
          depth: depth + 1,
          statusMessage: `Entering ${fnName}`
        });
      },
      exit: (retVal) => {
        const current = stack.pop();
        if (!current) return;
        
        const variables = Object.entries(current.args).map(([k, v]) => ({
          name: k,
          value: String(v),
          type: typeof v
        }));
        
        variables.push({
          name: 'returnValue',
          value: String(retVal),
          type: typeof retVal
        });

        recorder.recordReturn({
          currentLine: 1,
          functionName: current.fnName,
          variables: variables,
          returnValue: retVal,
          activeNodeId: current.id,
          depth: current.depth + 1,
          statusMessage: `Returning ${retVal}`
        });
      }
    };

    // 3. Execute
    const executeFunc = new Function('__tracer', `${output.code}\n return ${mainFuncName};`);
    const userFunc = executeFunc(__tracer);
    
    // Clear any snapshots generated by global function calls in the user's code
    recorder.start();
    
    // Call the function with parsed arguments from the UI
    userFunc(...argValues);

  } catch (err) {
    // Record error as a step
    recorder.recordCall({
      currentLine: 1,
      functionName: `Error`,
      variables: [],
      node: { id: 'error', label: 'Error', cx: 0, cy: 0, depth: 0, status: 'error' },
      edge: null,
      activeNodeId: 'error',
      depth: 0,
      statusMessage: err.message
    });
  }

  recorder.finish();
  return recorder.getExecutionSession();
}
