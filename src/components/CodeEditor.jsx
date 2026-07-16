import React, { useRef, useEffect } from 'react';
import { Code } from 'lucide-react';
import { useExecution } from '../context/ExecutionContext';

const codeSnippets = {
  factorial: {
    title: 'factorial.js',
    lines: [
      { text: '// Compute the factorial of a number', type: 'comment' },
      { text: 'function factorial(n) {', type: 'normal', indent: 0 },
      { text: '  // Base case: n reaches 1 or 0', type: 'comment', indent: 1 },
      { text: '  if (n <= 1) {', type: 'normal', indent: 1 },
      { text: '    return 1;', type: 'keyword', indent: 2 },
      { text: '  }', type: 'normal', indent: 1 },
      { text: '  ', type: 'normal', indent: 0 },
      { text: '  // Recursive relation: n * (n-1)!', type: 'comment', indent: 1 },
      { text: '  return n * factorial(n - 1);', type: 'keyword-highlight', indent: 1 },
      { text: '}', type: 'normal', indent: 0 }
    ]
  },
  fibonacci: {
    title: 'fib.js',
    lines: [
      { text: '// Compute the Nth Fibonacci number', type: 'comment' },
      { text: 'function fib(n) {', type: 'normal', indent: 0 },
      { text: '  // Base cases', type: 'comment', indent: 1 },
      { text: '  if (n <= 0) return 0;', type: 'normal', indent: 1 },
      { text: '  if (n === 1) return 1;', type: 'normal', indent: 1 },
      { text: '  ', type: 'normal', indent: 0 },
      { text: '  // Dual recursive branch execution', type: 'comment', indent: 1 },
      { text: '  return fib(n - 1) + fib(n - 2);', type: 'keyword-highlight', indent: 1 },
      { text: '}', type: 'normal', indent: 0 }
    ]
  },
  binarySearch: {
    title: 'binarySearch.js',
    lines: [
      { text: '// Search for a target key in sorted array', type: 'comment' },
      { text: 'function binarySearch(arr, target, low, high) {', type: 'normal', indent: 0 },
      { text: '  // Base Case: Range exhausted', type: 'comment', indent: 1 },
      { text: '  if (low > high) return -1;', type: 'normal', indent: 1 },
      { text: '  ', type: 'normal', indent: 0 },
      { text: '  const mid = Math.floor((low + high) / 2);', type: 'normal', indent: 1 },
      { text: '  ', type: 'normal', indent: 0 },
      { text: '  // Base Case: Target found', type: 'comment', indent: 1 },
      { text: '  if (arr[mid] === target) return mid;', type: 'normal', indent: 1 },
      { text: '  ', type: 'normal', indent: 0 },
      { text: '  // Tail recursive branching', type: 'comment', indent: 1 },
      { text: '  if (arr[mid] > target) {', type: 'normal', indent: 1 },
      { text: '    return binarySearch(arr, target, low, mid - 1);', type: 'keyword-highlight', indent: 2 },
      { text: '  } else {', type: 'normal', indent: 1 },
      { text: '    return binarySearch(arr, target, mid + 1, high);', type: 'keyword-highlight', indent: 2 },
      { text: '  }', type: 'normal', indent: 1 },
      { text: '}', type: 'normal', indent: 0 }
    ]
  }
};

export default function CodeEditor() {
  const { currentAlgorithm, currentSnapshot } = useExecution();
  const codeData = codeSnippets[currentAlgorithm] || codeSnippets.factorial;
  const activeLine = currentSnapshot?.currentLine || 1;
  const activeLineRef = useRef(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLine]);

  const renderHighlightedLine = (line) => {
    const text = line.text;
    
    // Simple lexical highlight parser
    if (line.type === 'comment') {
      return <span className="syntax-comment">{text}</span>;
    }
    
    const keywordRegex = /\b(function|return|if|else|const)\b/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = keywordRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<span key={match.index} className="syntax-keyword">{match[0]}</span>);
      lastIndex = keywordRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    const finalElements = [];
    parts.forEach((part, i) => {
      if (typeof part === 'string') {
        const numRegex = /\b(\d+)\b/g;
        let pLastIndex = 0;
        let pMatch;
        while ((pMatch = numRegex.exec(part)) !== null) {
          if (pMatch.index > pLastIndex) {
            finalElements.push(part.substring(pLastIndex, pMatch.index));
          }
          finalElements.push(<span key={`n-${pMatch.index}`} className="syntax-number">{pMatch[0]}</span>);
          pLastIndex = numRegex.lastIndex;
        }
        if (pLastIndex < part.length) {
          finalElements.push(part.substring(pLastIndex));
        }
      } else {
        finalElements.push(part);
      }
    });

    return finalElements.length > 0 ? finalElements : text;
  };

  return (
    <div className="panel editor-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Code size={14} className="panel-title-icon" />
          <span>Source Code</span>
        </div>
        <div className="editor-file-tab">
          <span className="file-dot active"></span>
          <span className="file-name">{codeData.title}</span>
        </div>
      </div>
      
      <div className="panel-body editor-body">
        <div className="editor-container">
          <div className="editor-gutter">
            {codeData.lines.map((_, index) => (
              <div key={index} className="gutter-number">
                {index + 1}
              </div>
            ))}
          </div>
          
          <pre className="editor-code">
            {codeData.lines.map((line, index) => {
              const isExecuting = activeLine === index + 1;
              return (
                <div 
                  key={index} 
                  ref={isExecuting ? activeLineRef : null}
                  className={`code-line ${isExecuting ? 'active-execution-line glow-active' : ''}`}
                  style={{ paddingLeft: `${(line.indent || 0) * 16}px` }}
                >
                  {renderHighlightedLine(line)}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
