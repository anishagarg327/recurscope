import React, { useRef, useEffect } from 'react';
import { Code, Edit3, Lock } from 'lucide-react';
import { useAlgorithms } from '../../contexts/AlgorithmsContext';
import { usePlayback } from '../../contexts/PlaybackContext';
import Editor, { useMonaco } from '@monaco-editor/react';

export default function CodeEditor() {
  const { 
    activeAlgorithm, 
    isCustomMode, 
    setIsCustomMode, 
    customCode, 
    setCustomCode 
  } = useAlgorithms();
  const { currentSnapshot } = usePlayback();

  const sourceCode = activeAlgorithm?.sourceCode || '';
  const activeLine = currentSnapshot?.currentLine || 1;

  const monaco = useMonaco();
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Highlight current executing line
  useEffect(() => {
    if (editorRef.current && monaco) {
      const line = activeLine;
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: 'monaco-active-line-highlight',
              glyphMarginClassName: 'monaco-active-line-glyph'
            }
          }
        ]
      );
      editorRef.current.revealLineInCenter(line);
    }
  }, [activeLine, monaco, currentSnapshot]);

  // Handle mode toggle confirmation
  const toggleMode = (mode) => {
    if (mode === 'predefined' && isCustomMode) {
      if (window.confirm("Switching to Predefined Mode will discard your custom code if you haven't saved it. Proceed?")) {
        setIsCustomMode(false);
      }
    } else if (mode === 'custom' && !isCustomMode) {
      setIsCustomMode(true);
    }
  };

  return (
    <div className="panel editor-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-header" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={14} className="panel-title-icon" style={{ color: 'var(--text-accent)' }} />
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Source Code</span>
        </div>
        
        {/* Mode Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-canvas)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-color)', position: 'relative', zIndex: 999 }}>
          <button 
            type="button"
            onClick={() => { console.log('Clicked predefined'); toggleMode('predefined'); }}
            style={{ 
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: '600', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: !isCustomMode ? 'var(--bg-panel)' : 'transparent',
              color: !isCustomMode ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: !isCustomMode ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={12} />
            Predefined
          </button>
          <button 
            type="button"
            onClick={() => { console.log('Clicked custom'); toggleMode('custom'); }}
            style={{ 
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: '600', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isCustomMode ? 'var(--bg-panel)' : 'transparent',
              color: isCustomMode ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: isCustomMode ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Edit3 size={12} />
            Custom
          </button>
        </div>
      </div>
      
      <div className="editor-file-tab" style={{ zIndex: 10, margin: '8px 20px 0 20px', backgroundColor: 'var(--bg-panel-header)' }}>
        <span className="file-dot active"></span>
        <span className="file-name">{isCustomMode ? 'custom.js' : `${activeAlgorithm?.id}.js`}</span>
      </div>
      
      <div className="panel-body editor-body" style={{ flex: 1, padding: '0 20px 20px 20px', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ height: '100%', border: '1px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark" // We can bind this to the app theme later
            value={isCustomMode ? customCode : sourceCode}
            onChange={(value) => { if (isCustomMode) setCustomCode(value); }}
            options={{
              readOnly: !isCustomMode,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              lineHeight: 22,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              glyphMargin: true,
              lineNumbersMinChars: 1,
              lineDecorationsWidth: 0,
              folding: false
            }}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
    </div>
  );
}
