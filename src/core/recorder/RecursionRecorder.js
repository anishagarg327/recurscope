import { ExecutionEvent } from '../execution/types';

export default class RecursionRecorder {
  constructor(algorithmName) {
    this.algorithmName = algorithmName;
    this.stepNumber = 0;
    this.callStack = [];
    this.recursionTreeNodes = [];
    this.recursionTreeEdges = [];
    this.snapshots = [];
  }

  start() {
    this.stepNumber = 0;
    this.callStack = [];
    this.recursionTreeNodes = [];
    this.recursionTreeEdges = [];
    this.snapshots = [];
  }

  recordCall({ currentLine, functionName, variables, node, edge, activeNodeId, depth, pendingDescription, statusMessage }) {
    if (node) {
      this.recursionTreeNodes.push(node);
    }
    if (edge) {
      this.recursionTreeEdges.push(edge);
    }

    const nodesCopy = this.recursionTreeNodes.map(n => {
      if (n.id === activeNodeId) {
        return { ...n, status: 'active' };
      }
      return { ...n, status: n.status === 'success' ? 'success' : 'running' };
    });

    const edgesCopy = this.recursionTreeEdges.map(e => {
      const targetNode = nodesCopy.find(n => n.id === e.to);
      if (targetNode?.status === 'success') {
        return { ...e, status: 'success' };
      } else if (targetNode?.status === 'active') {
        return { ...e, status: 'active' };
      }
      return { ...e, status: 'pending' };
    });

    if (currentLine === 2) {
      const varsString = variables.map(v => `${v.name} = ${v.value}`).join(', ');
      this.callStack.unshift({
        name: functionName,
        line: `${this.algorithmName}.js:2`,
        depth: depth - 1,
        variables: varsString
      });
    } else {
      if (pendingDescription && this.callStack.length > 0) {
        this.callStack[0] = {
          ...this.callStack[0],
          line: `${this.algorithmName}.js:${currentLine}`,
          variables: pendingDescription
        };
      } else if (this.callStack.length > 0) {
        this.callStack[0] = {
          ...this.callStack[0],
          line: `${this.algorithmName}.js:${currentLine}`
        };
      }
    }

    const snapshot = {
      stepNumber: this.stepNumber++,
      currentLine,
      callStack: JSON.parse(JSON.stringify(this.callStack)),
      variables: JSON.parse(JSON.stringify(variables)),
      recursionTreeNodes: nodesCopy,
      recursionTreeEdges: edgesCopy,
      activeFunction: this.algorithmName,
      activeNodeId,
      returnValue: undefined,
      executionStatus: 'running',
      depth,
      eventType: ExecutionEvent.CALL,
      event: ExecutionEvent.CALL,
      id: `${this.algorithmName}_snap_${this.stepNumber - 1}`,
      timestamp: Date.now(),
      statusMessage: statusMessage || `Calling ${functionName}`
    };

    this.snapshots.push(snapshot);
  }

  recordBaseCase({ currentLine, functionName, variables, returnValue, activeNodeId, depth, statusMessage }) {
    const node = this.recursionTreeNodes.find(n => n.id === activeNodeId);
    if (node) {
      node.status = 'success';
    }

    const nodesCopy = this.recursionTreeNodes.map(n => {
      if (n.id === activeNodeId) {
        return { ...n, status: 'success' };
      }
      return { ...n, status: n.status === 'success' ? 'success' : 'running' };
    });

    const edgesCopy = this.recursionTreeEdges.map(e => {
      const targetNode = nodesCopy.find(n => n.id === e.to);
      if (targetNode?.status === 'success') {
        return { ...e, status: 'success' };
      }
      return { ...e, status: 'pending' };
    });

    if (this.callStack.length > 0) {
      const varsString = variables.filter(v => v.name !== 'returnValue').map(v => `${v.name} = ${v.value}`).join(', ');
      this.callStack[0] = {
        ...this.callStack[0],
        line: `${this.algorithmName}.js:${currentLine}`,
        variables: `${varsString}, returning ${returnValue}`
      };
    }

    const snapshot = {
      stepNumber: this.stepNumber++,
      currentLine,
      callStack: JSON.parse(JSON.stringify(this.callStack)),
      variables: JSON.parse(JSON.stringify(variables)),
      recursionTreeNodes: nodesCopy,
      recursionTreeEdges: edgesCopy,
      activeFunction: this.algorithmName,
      activeNodeId,
      returnValue,
      executionStatus: 'running',
      depth,
      eventType: ExecutionEvent.BASE_CASE,
      event: ExecutionEvent.BASE_CASE,
      id: `${this.algorithmName}_snap_${this.stepNumber - 1}`,
      timestamp: Date.now(),
      statusMessage: statusMessage || 'Reached Base Case'
    };

    this.snapshots.push(snapshot);
  }

  recordReturn({ currentLine, functionName, variables, returnValue, activeNodeId, depth, pendingDescription, statusMessage }) {
    const node = this.recursionTreeNodes.find(n => n.id === activeNodeId);
    if (node) {
      node.status = 'success';
    }

    const nodesCopy = this.recursionTreeNodes.map(n => {
      if (n.id === activeNodeId) {
        return { ...n, status: 'success' };
      }
      return { ...n, status: n.status === 'success' ? 'success' : 'running' };
    });

    const edgesCopy = this.recursionTreeEdges.map(e => {
      const targetNode = nodesCopy.find(n => n.id === e.to);
      if (targetNode?.status === 'success') {
        return { ...e, status: 'success' };
      }
      return { ...e, status: 'pending' };
    });

    if (this.callStack.length > 0) {
      this.callStack[0] = {
        ...this.callStack[0],
        line: `${this.algorithmName}.js:${currentLine}`,
        variables: pendingDescription
      };
    }

    const snapshot = {
      stepNumber: this.stepNumber++,
      currentLine,
      callStack: JSON.parse(JSON.stringify(this.callStack)),
      variables: JSON.parse(JSON.stringify(variables)),
      recursionTreeNodes: nodesCopy,
      recursionTreeEdges: edgesCopy,
      activeFunction: this.algorithmName,
      activeNodeId,
      returnValue,
      executionStatus: 'running',
      depth,
      eventType: ExecutionEvent.RETURN,
      event: ExecutionEvent.RETURN,
      id: `${this.algorithmName}_snap_${this.stepNumber - 1}`,
      timestamp: Date.now(),
      statusMessage: statusMessage || `Returning value ${returnValue}`
    };

    this.snapshots.push(snapshot);
    this.callStack.shift();
  }

  finish() {
    if (this.snapshots.length > 0) {
      const lastSnap = this.snapshots[this.snapshots.length - 1];
      lastSnap.executionStatus = 'completed';
      lastSnap.eventType = ExecutionEvent.COMPLETE;
      lastSnap.event = ExecutionEvent.COMPLETE;
    }
  }

  getExecutionSession() {
    return this.snapshots.map((snap) => {
      let statusMessage = snap.statusMessage;
      if (snap.event === ExecutionEvent.COMPLETE) {
        statusMessage = 'Execution Completed';
      }
      return {
        ...snap,
        statusMessage
      };
    });
  }
}
