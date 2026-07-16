import React, { useRef, useEffect } from 'react';
import { Code } from 'lucide-react';
import { useAlgorithms } from '../../contexts/AlgorithmsContext';
import { usePlayback } from '../../contexts/PlaybackContext';

export default function CodeEditor() {
  const { activeAlgorithm } = useAlgorithms();
  const { currentSnapshot } = usePlayback();

  const sourceCode = activeAlgorithm?.sourceCode || '';
  const lines = sourceCode.split('\n').map((lineText) => {
    const trimmed = lineText.trimStart();
    const indent = lineText.length - trimmed.length;
    const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
    return {
      text: lineText,
      type: isComment ? 'comment' : 'normal',
      indent: Math.floor(indent / 2)
    };
  });

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
          <span className="file-name">{activeAlgorithm?.id}.js</span>
        </div>
      </div>
      
      <div className="panel-body editor-body">
        <div className="editor-container">
          <div className="editor-gutter">
            {lines.map((_, index) => (
              <div key={index} className="gutter-number">
                {index + 1}
              </div>
            ))}
          </div>
          
          <pre className="editor-code">
            {lines.map((line, index) => {
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
