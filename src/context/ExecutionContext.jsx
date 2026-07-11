import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ExecutionContext = createContext(null);

// ==========================================================================
// 1. Mock Snapshots Dataset for Factorial(5)
// ==========================================================================
const factorialSnapshots = [
  {
    stepNumber: 0,
    currentLine: 2,
    callStack: [
      { name: 'factorial(5)', line: 'factorial.js:2', depth: 0, variables: 'n = 5' }
    ],
    variables: [
      { name: 'n', value: '5', type: 'number' },
      { name: 'result', value: 'undefined', type: 'undefined' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'active', depth: 0 }
    ],
    recursionTreeEdges: [],
    activeFunction: 'factorial',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 1,
    currentLine: 4,
    callStack: [
      { name: 'factorial(5)', line: 'factorial.js:4', depth: 0, variables: 'n = 5' }
    ],
    variables: [
      { name: 'n', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'active', depth: 0 }
    ],
    recursionTreeEdges: [],
    activeFunction: 'factorial',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 2,
    currentLine: 9,
    callStack: [
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 }
    ],
    recursionTreeEdges: [],
    activeFunction: 'factorial',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 3,
    currentLine: 2,
    callStack: [
      { name: 'factorial(4)', line: 'factorial.js:2', depth: 1, variables: 'n = 4' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'active', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 4,
    currentLine: 4,
    callStack: [
      { name: 'factorial(4)', line: 'factorial.js:4', depth: 1, variables: 'n = 4' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'active', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 5,
    currentLine: 9,
    callStack: [
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 6,
    currentLine: 2,
    callStack: [
      { name: 'factorial(3)', line: 'factorial.js:2', depth: 2, variables: 'n = 3' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'active', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 7,
    currentLine: 4,
    callStack: [
      { name: 'factorial(3)', line: 'factorial.js:4', depth: 2, variables: 'n = 3' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'active', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 8,
    currentLine: 9,
    callStack: [
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 9,
    currentLine: 2,
    callStack: [
      { name: 'factorial(2)', line: 'factorial.js:2', depth: 3, variables: 'n = 2' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'active', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_4',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 10,
    currentLine: 4,
    callStack: [
      { name: 'factorial(2)', line: 'factorial.js:4', depth: 3, variables: 'n = 2' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'active', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_4',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 11,
    currentLine: 9,
    callStack: [
      { name: 'factorial(2)', line: 'factorial.js:9', depth: 3, variables: 'n = 2, pending: 2 * f(1)' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'running', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_4',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 12,
    currentLine: 2,
    callStack: [
      { name: 'factorial(1)', line: 'factorial.js:2', depth: 4, variables: 'n = 1' },
      { name: 'factorial(2)', line: 'factorial.js:9', depth: 3, variables: 'n = 2, pending: 2 * f(1)' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'running', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'active', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_5',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 5
  },
  {
    stepNumber: 13,
    currentLine: 4,
    callStack: [
      { name: 'factorial(1)', line: 'factorial.js:4', depth: 4, variables: 'n = 1' },
      { name: 'factorial(2)', line: 'factorial.js:9', depth: 3, variables: 'n = 2, pending: 2 * f(1)' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'running', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'active', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'active' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_5',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 5
  },
  {
    stepNumber: 14,
    currentLine: 5,
    callStack: [
      { name: 'factorial(1)', line: 'factorial.js:5', depth: 4, variables: 'n = 1, returning 1' },
      { name: 'factorial(2)', line: 'factorial.js:9', depth: 3, variables: 'n = 2, pending: 2 * f(1)' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '1', type: 'number' },
      { name: 'returnValue', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'running', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'success', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_5',
    returnValue: 1,
    executionStatus: 'running',
    depth: 5
  },
  {
    stepNumber: 15,
    currentLine: 9,
    callStack: [
      { name: 'factorial(2)', line: 'factorial.js:9', depth: 3, variables: 'n = 2, f(1) = 1, returning 2 * 1' },
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, pending: 3 * f(2)' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' },
      { name: 'f(1) return', value: '1', type: 'number' },
      { name: 'returnValue', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'success', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_4',
    returnValue: 2,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 16,
    currentLine: 9,
    callStack: [
      { name: 'factorial(3)', line: 'factorial.js:9', depth: 2, variables: 'n = 3, f(2) = 2, returning 3 * 2' },
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, pending: 4 * f(3)' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' },
      { name: 'f(2) return', value: '2', type: 'number' },
      { name: 'returnValue', value: '6', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'success', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_3',
    returnValue: 6,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 17,
    currentLine: 9,
    callStack: [
      { name: 'factorial(4)', line: 'factorial.js:9', depth: 1, variables: 'n = 4, f(3) = 6, returning 4 * 6' },
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, pending: 5 * f(4)' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' },
      { name: 'f(3) return', value: '6', type: 'number' },
      { name: 'returnValue', value: '24', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'success', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_2',
    returnValue: 24,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 18,
    currentLine: 9,
    callStack: [
      { name: 'factorial(5)', line: 'factorial.js:9', depth: 0, variables: 'n = 5, f(4) = 24, returning 5 * 24' }
    ],
    variables: [
      { name: 'n', value: '5', type: 'number' },
      { name: 'f(4) return', value: '24', type: 'number' },
      { name: 'returnValue', value: '120', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(5)', cx: 80, cy: 160, status: 'success', depth: 0 },
      { id: 'node_2', label: 'f(4)', cx: 190, cy: 160, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(3)', cx: 300, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(2)', cx: 410, cy: 160, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(1)', cx: 520, cy: 160, status: 'success', depth: 4 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_4', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'factorial',
    activeNodeId: 'node_1',
    returnValue: 120,
    executionStatus: 'completed',
    depth: 1
  }
];

// ==========================================================================
// 2. Mock Snapshots Dataset for Fibonacci(4)
// ==========================================================================
const fibonacciSnapshots = [
  {
    stepNumber: 0,
    currentLine: 2,
    callStack: [{ name: 'fib(4)', line: 'fib.js:2', depth: 0, variables: 'n = 4' }],
    variables: [{ name: 'n', value: '4', type: 'number' }],
    recursionTreeNodes: [{ id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'active', depth: 0 }],
    recursionTreeEdges: [],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 1,
    currentLine: 4,
    callStack: [{ name: 'fib(4)', line: 'fib.js:4', depth: 0, variables: 'n = 4' }],
    variables: [{ name: 'n', value: '4', type: 'number' }],
    recursionTreeNodes: [{ id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'active', depth: 0 }],
    recursionTreeEdges: [],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 2,
    currentLine: 8,
    callStack: [{ name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }],
    variables: [{ name: 'n', value: '4', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 }
    ],
    recursionTreeEdges: [],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 3,
    currentLine: 2,
    callStack: [
      { name: 'fib(3)', line: 'fib.js:2', depth: 1, variables: 'n = 3' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '3', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'active', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 4,
    currentLine: 8,
    callStack: [
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '3', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 5,
    currentLine: 2,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:2', depth: 2, variables: 'n = 2' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '2', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'active', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 6,
    currentLine: 8,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, evaluating fib(1)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '2', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 7,
    currentLine: 2,
    callStack: [
      { name: 'fib(1)', line: 'fib.js:2', depth: 3, variables: 'n = 1' },
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, evaluating fib(1)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '1', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'active', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_4',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 8,
    currentLine: 5,
    callStack: [
      { name: 'fib(1)', line: 'fib.js:5', depth: 3, variables: 'n = 1, returning 1' },
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, evaluating fib(1)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '1', type: 'number' },
      { name: 'returnValue', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_4',
    returnValue: 1,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 9,
    currentLine: 8,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, fib(1) = 1, evaluating fib(0)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' },
      { name: 'fib(1)', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 10,
    currentLine: 2,
    callStack: [
      { name: 'fib(0)', line: 'fib.js:2', depth: 3, variables: 'n = 0' },
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, fib(1) = 1, evaluating fib(0)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '0', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'active', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_5',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 11,
    currentLine: 4,
    callStack: [
      { name: 'fib(0)', line: 'fib.js:4', depth: 3, variables: 'n = 0, returning 0' },
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, fib(1) = 1, evaluating fib(0)' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '0', type: 'number' },
      { name: 'returnValue', value: '0', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'running', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_5',
    returnValue: 0,
    executionStatus: 'running',
    depth: 4
  },
  {
    stepNumber: 12,
    currentLine: 8,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:8', depth: 2, variables: 'n = 2, f(1) = 1, f(0) = 0, returning 1' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, evaluating fib(2)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' },
      { name: 'fib(1)', value: '1', type: 'number' },
      { name: 'fib(0)', value: '0', type: 'number' },
      { name: 'returnValue', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_3',
    returnValue: 1,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 13,
    currentLine: 8,
    callStack: [
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, f(2) = 1, evaluating fib(1)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' },
      { name: 'fib(2) return', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 14,
    currentLine: 2,
    callStack: [
      { name: 'fib(1)', line: 'fib.js:2', depth: 2, variables: 'n = 1' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, f(2) = 1, evaluating fib(1)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [{ name: 'n', value: '1', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'active', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_6',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 15,
    currentLine: 5,
    callStack: [
      { name: 'fib(1)', line: 'fib.js:5', depth: 2, variables: 'n = 1, returning 1' },
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, f(2) = 1, evaluating fib(1)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '1', type: 'number' },
      { name: 'returnValue', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'running', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_6',
    returnValue: 1,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 16,
    currentLine: 8,
    callStack: [
      { name: 'fib(3)', line: 'fib.js:8', depth: 1, variables: 'n = 3, f(2) = 1, f(1) = 1, returning 2' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, evaluating fib(3)' }
    ],
    variables: [
      { name: 'n', value: '3', type: 'number' },
      { name: 'fib(2)', value: '1', type: 'number' },
      { name: 'fib(1)', value: '1', type: 'number' },
      { name: 'returnValue', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_2',
    returnValue: 2,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 17,
    currentLine: 8,
    callStack: [
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, f(3) = 2, evaluating fib(2)' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' },
      { name: 'fib(3) return', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 18,
    currentLine: 2,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:2', depth: 1, variables: 'n = 2' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, f(3) = 2, evaluating fib(2)' }
    ],
    variables: [{ name: 'n', value: '2', type: 'number' }],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 },
      { id: 'node_7', label: 'f(2)', cx: 420, cy: 100, status: 'active', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' },
      { from: 'node_1', to: 'node_7', status: 'active' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_7',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 19,
    currentLine: 8,
    callStack: [
      { name: 'fib(2)', line: 'fib.js:8', depth: 1, variables: 'n = 2, returning 1 (pre-evaluated)' },
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, f(3) = 2, evaluating fib(2)' }
    ],
    variables: [
      { name: 'n', value: '2', type: 'number' },
      { name: 'returnValue', value: '1', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'running', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 },
      { id: 'node_7', label: 'f(2)', cx: 420, cy: 100, status: 'success', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' },
      { from: 'node_1', to: 'node_7', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_7',
    returnValue: 1,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 20,
    currentLine: 8,
    callStack: [
      { name: 'fib(4)', line: 'fib.js:8', depth: 0, variables: 'n = 4, f(3) = 2, f(2) = 1, returning 3' }
    ],
    variables: [
      { name: 'n', value: '4', type: 'number' },
      { name: 'fib(3)', value: '2', type: 'number' },
      { name: 'fib(2)', value: '1', type: 'number' },
      { name: 'returnValue', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'f(4)', cx: 300, cy: 40, status: 'success', depth: 0 },
      { id: 'node_2', label: 'f(3)', cx: 180, cy: 100, status: 'success', depth: 1 },
      { id: 'node_3', label: 'f(2)', cx: 100, cy: 160, status: 'success', depth: 2 },
      { id: 'node_4', label: 'f(1)', cx: 60, cy: 230, status: 'success', depth: 3 },
      { id: 'node_5', label: 'f(0)', cx: 140, cy: 230, status: 'success', depth: 3 },
      { id: 'node_6', label: 'f(1)', cx: 260, cy: 160, status: 'success', depth: 2 },
      { id: 'node_7', label: 'f(2)', cx: 420, cy: 100, status: 'success', depth: 1 }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' },
      { from: 'node_3', to: 'node_4', status: 'success' },
      { from: 'node_3', to: 'node_5', status: 'success' },
      { from: 'node_2', to: 'node_6', status: 'success' },
      { from: 'node_1', to: 'node_7', status: 'success' }
    ],
    activeFunction: 'fibonacci',
    activeNodeId: 'node_1',
    returnValue: 3,
    executionStatus: 'completed',
    depth: 1
  }
];

// ==========================================================================
// 3. Mock Snapshots Dataset for BinarySearch([1,3,5,7,9,11], 7)
// ==========================================================================
const binarySearchSnapshots = [
  {
    stepNumber: 0,
    currentLine: 2,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:2', depth: 0, variables: 'low = 0, high = 5' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: 'undefined', type: 'undefined' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'active', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 1,
    currentLine: 4,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:4', depth: 0, variables: 'low = 0, high = 5' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'active', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 2,
    currentLine: 6,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:6', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '2', type: 'number' },
      { name: 'arr[mid]', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'active', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 3,
    currentLine: 9,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:9', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '2', type: 'number' },
      { name: 'arr[mid]', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'active', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 4,
    currentLine: 12,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:12', depth: 0, variables: 'low = 0, high = 5, mid = 2, checking 5 > 7' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '2', type: 'number' },
      { name: 'arr[mid]', value: '5', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'active', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 5,
    currentLine: 15,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2, calling bs(3, 5)' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '0', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '2', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' }
    ],
    recursionTreeEdges: [],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 1
  },
  {
    stepNumber: 6,
    currentLine: 2,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:2', depth: 1, variables: 'low = 3, high = 5' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: 'undefined', type: 'undefined' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'active', depth: 1, subLabel: '[3, 5]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 7,
    currentLine: 6,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:6', depth: 1, variables: 'low = 3, high = 5, mid = 4' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '4', type: 'number' },
      { name: 'arr[mid]', value: '9', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'active', depth: 1, subLabel: '[3, 5]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 8,
    currentLine: 9,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:9', depth: 1, variables: 'low = 3, high = 5, mid = 4' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '4', type: 'number' },
      { name: 'arr[mid]', value: '9', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'active', depth: 1, subLabel: '[3, 5]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 9,
    currentLine: 12,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:12', depth: 1, variables: 'low = 3, high = 5, mid = 4, checking 9 > 7' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '4', type: 'number' },
      { name: 'arr[mid]', value: '9', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'active', depth: 1, subLabel: '[3, 5]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 10,
    currentLine: 13,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:13', depth: 1, variables: 'low = 3, high = 5, mid = 4, calling bs(3, 3)' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '5', type: 'number' },
      { name: 'mid', value: '4', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'running', depth: 1, subLabel: '[3, 5]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 11,
    currentLine: 2,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 3)', line: 'binarySearch.js:2', depth: 2, variables: 'low = 3, high = 3' },
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:13', depth: 1, variables: 'low = 3, high = 5, mid = 4' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '3', type: 'number' },
      { name: 'mid', value: 'undefined', type: 'undefined' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'running', depth: 1, subLabel: '[3, 5]' },
      { id: 'node_3', label: 'mid: 3', cx: 350, cy: 230, status: 'active', depth: 2, subLabel: '[3, 3]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 12,
    currentLine: 6,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 3)', line: 'binarySearch.js:6', depth: 2, variables: 'low = 3, high = 3, mid = 3' },
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:13', depth: 1, variables: 'low = 3, high = 5, mid = 4' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '3', type: 'number' },
      { name: 'mid', value: '3', type: 'number' },
      { name: 'arr[mid]', value: '7', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'running', depth: 1, subLabel: '[3, 5]' },
      { id: 'node_3', label: 'mid: 3', cx: 350, cy: 230, status: 'active', depth: 2, subLabel: '[3, 3]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'active' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_3',
    returnValue: undefined,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 13,
    currentLine: 9,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 3)', line: 'binarySearch.js:9', depth: 2, variables: 'low = 3, high = 3, mid = 3, target found, returning mid' },
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:13', depth: 1, variables: 'low = 3, high = 5, mid = 4' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'low', value: '3', type: 'number' },
      { name: 'high', value: '3', type: 'number' },
      { name: 'mid', value: '3', type: 'number' },
      { name: 'arr[mid]', value: '7', type: 'number' },
      { name: 'returnValue', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'running', depth: 1, subLabel: '[3, 5]' },
      { id: 'node_3', label: 'mid: 3', cx: 350, cy: 230, status: 'success', depth: 2, subLabel: '[3, 3]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_3',
    returnValue: 3,
    executionStatus: 'running',
    depth: 3
  },
  {
    stepNumber: 14,
    currentLine: 13,
    callStack: [
      { name: 'binarySearch(arr, 7, 3, 5)', line: 'binarySearch.js:13', depth: 1, variables: 'low = 3, high = 5, mid = 4, bs(3,3) returned 3' },
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'returnValue', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'running', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'success', depth: 1, subLabel: '[3, 5]' },
      { id: 'node_3', label: 'mid: 3', cx: 350, cy: 230, status: 'success', depth: 2, subLabel: '[3, 3]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_2',
    returnValue: 3,
    executionStatus: 'running',
    depth: 2
  },
  {
    stepNumber: 15,
    currentLine: 15,
    callStack: [
      { name: 'binarySearch(arr, 7, 0, 5)', line: 'binarySearch.js:15', depth: 0, variables: 'low = 0, high = 5, mid = 2, bs(3,5) returned 3' }
    ],
    variables: [
      { name: 'arr', value: '[1, 3, 5, 7, 9, 11]', type: 'Array(6)' },
      { name: 'target', value: '7', type: 'number' },
      { name: 'returnValue', value: '3', type: 'number' }
    ],
    recursionTreeNodes: [
      { id: 'node_1', label: 'mid: 2', cx: 300, cy: 50, status: 'success', depth: 0, subLabel: '[0, 5]' },
      { id: 'node_2', label: 'mid: 4', cx: 420, cy: 140, status: 'success', depth: 1, subLabel: '[3, 5]' },
      { id: 'node_3', label: 'mid: 3', cx: 350, cy: 230, status: 'success', depth: 2, subLabel: '[3, 3]' }
    ],
    recursionTreeEdges: [
      { from: 'node_1', to: 'node_2', status: 'success' },
      { from: 'node_2', to: 'node_3', status: 'success' }
    ],
    activeFunction: 'binarySearch',
    activeNodeId: 'node_1',
    returnValue: 3,
    executionStatus: 'completed',
    depth: 1
  }
];

// Combine all mock datasets
const mockSnapshotsDatabase = {
  factorial: factorialSnapshots,
  fibonacci: fibonacciSnapshots,
  binarySearch: binarySearchSnapshots
};

// Default Statistics Generator helper based on algorithm & step
const getStatistics = (algorithm, index, totalSteps, snapshots) => {
  const currentSnapshot = snapshots[index];
  const maxDepth = Math.max(...snapshots.slice(0, index + 1).map(s => s.depth || 1));
  const activeCalls = currentSnapshot?.callStack?.length || 1;
  
  // Custom metrics based on algorithm
  if (algorithm === 'factorial') {
    return [
      { label: 'Total Calls', value: `${index >= 12 ? 5 : (index >= 9 ? 4 : (index >= 6 ? 3 : (index >= 3 ? 2 : 1)))}`, icon: 'BarChart3', color: 'info' },
      { label: 'Max Depth', value: `${maxDepth}`, icon: 'Layers3', color: 'accent' },
      { label: 'Current Depth', value: `${activeCalls}`, icon: 'Layers3', color: 'warning' },
      { label: 'Execution Time', value: `${(index * 0.005).toFixed(3)}ms`, icon: 'Hourglass', color: 'success' },
      { label: 'Base Case Hits', value: `${index >= 12 ? 1 : 0}`, icon: 'CheckCircle2', color: 'success' },
      { label: 'Repeated Calls', value: '0', icon: 'Copy', color: 'muted' },
      { label: 'Memory Overhead', value: `${(activeCalls * 0.08).toFixed(1)} KB`, icon: 'Cpu', color: 'danger' }
    ];
  } else if (algorithm === 'fibonacci') {
    const totalCallsCount = Math.max(1, currentSnapshot?.recursionTreeNodes?.length || 1);
    const repeatedCallsCount = Math.max(0, currentSnapshot?.recursionTreeNodes?.filter(n => n.label === 'f(1)' || n.label === 'f(0)').length - 2);
    const baseCaseHitsCount = currentSnapshot?.recursionTreeNodes?.filter(n => n.status === 'success' && (n.label === 'f(1)' || n.label === 'f(0)')).length || 0;
    
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
    return [
      { label: 'Total Calls', value: `${index >= 11 ? 3 : (index >= 6 ? 2 : 1)}`, icon: 'BarChart3', color: 'info' },
      { label: 'Max Depth', value: `${maxDepth}`, icon: 'Layers3', color: 'accent' },
      { label: 'Current Depth', value: `${activeCalls}`, icon: 'Layers3', color: 'warning' },
      { label: 'Execution Time', value: `${(index * 0.004).toFixed(3)}ms`, icon: 'Hourglass', color: 'success' },
      { label: 'Base Case Hits', value: `${index >= 13 ? 1 : 0}`, icon: 'CheckCircle2', color: 'success' },
      { label: 'Repeated Calls', value: '0', icon: 'Copy', color: 'muted' },
      { label: 'Memory Overhead', value: `${(activeCalls * 0.06).toFixed(1)} KB`, icon: 'Cpu', color: 'danger' }
    ];
  }
};

export const ExecutionProvider = ({ children }) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('factorial');
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // Default 1000ms

  const snapshots = mockSnapshotsDatabase[currentAlgorithm] || factorialSnapshots;
  const currentSnapshot = snapshots[currentSnapshotIndex] || snapshots[0];
  const statistics = getStatistics(currentAlgorithm, currentSnapshotIndex, snapshots.length, snapshots);

  // Playback timer ref to prevent stale closures
  const timerRef = useRef(null);

  // Auto-advance snapshots when isPlaying is active
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSnapshotIndex((prevIndex) => {
          if (prevIndex < snapshots.length - 1) {
            return prevIndex + 1;
          } else {
            // Loop back or stop
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, snapshots.length]);

  const setAlgorithm = (algoId) => {
    setIsPlaying(false);
    setCurrentAlgorithm(algoId);
    setCurrentSnapshotIndex(0);
  };

  const nextStep = () => {
    setIsPlaying(false);
    if (currentSnapshotIndex < snapshots.length - 1) {
      setCurrentSnapshotIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setIsPlaying(false);
    if (currentSnapshotIndex > 0) {
      setCurrentSnapshotIndex((prev) => prev - 1);
    }
  };

  const goToStep = (index) => {
    setIsPlaying(false);
    if (index >= 0 && index < snapshots.length) {
      setCurrentSnapshotIndex(index);
    }
  };

  const togglePlay = () => {
    // If we've reached the end, reset to step 0 before playing
    if (!isPlaying && currentSnapshotIndex === snapshots.length - 1) {
      setCurrentSnapshotIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const setSpeed = (speedMs) => {
    setPlaybackSpeed(speedMs);
  };

  return (
    <ExecutionContext.Provider
      value={{
        currentAlgorithm,
        snapshots,
        currentSnapshotIndex,
        currentSnapshot,
        statistics,
        isPlaying,
        playbackSpeed,
        setAlgorithm,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        setSpeed
      }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};

export const useExecution = () => {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error('useExecution must be used within an ExecutionProvider');
  }
  return context;
};
