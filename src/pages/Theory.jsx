import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Layers, Repeat, Zap, Box } from 'lucide-react';

const topics = [
  {
    id: 'what-is-recursion',
    title: 'What is Recursion?',
    icon: <Repeat size={18} style={{ color: '#60a5fa' }}/>,
    content: (
      <>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          Recursion is a programming technique where a function calls itself in order to solve a smaller instance of the same problem. 
          It is particularly useful for problems that can be broken down into identical subproblems, like tree traversals, sorting (Merge Sort, Quick Sort), and mathematical sequences (Fibonacci).
        </p>
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
          <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>
            {`function solve(problem) {
  if (problem is small enough) {
    return solveDirectly(problem);
  }
  // The function calls itself
  return solve(smaller(problem));
}`}
          </pre>
        </div>
      </>
    )
  },
  {
    id: 'base-case',
    title: 'Base Case',
    icon: <Box size={18} style={{ color: '#eab308' }}/>,
    content: (
      <>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          Every recursive function must have a condition that stops the recursion. This is called the <strong>Base Case</strong>. 
          Without a base case, the function would call itself infinitely, leading to a <code>StackOverflowError</code>.
        </p>
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
          <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>
            {`function factorial(n) {
  // BASE CASE
  if (n <= 1) return 1;
  
  return n * factorial(n - 1);
}`}
          </pre>
        </div>
      </>
    )
  },
  {
    id: 'call-stack',
    title: 'The Call Stack & Stack Frames',
    icon: <Layers size={18} style={{ color: '#a855f7' }}/>,
    content: (
      <>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          When a function calls itself, the computer pauses the current execution and pushes a new <strong>Stack Frame</strong> onto the <strong>Call Stack</strong>.
          Each frame contains the function's local variables, arguments, and the exact line of code it paused on.
        </p>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          As base cases are reached, the computer pops these frames off the stack one by one, returning values back to the paused functions.
        </p>
        <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '16px', borderRadius: '8px', color: '#e9d5ff' }}>
          <strong>Tip:</strong> You can visualize this in the Playground by looking at the "Call Stack" panel on the right while stepping through the code!
        </div>
      </>
    )
  },
  {
    id: 'complexity',
    title: 'Time & Space Complexity',
    icon: <Zap size={18} style={{ color: '#22c55e' }}/>,
    content: (
      <>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          <strong>Time Complexity</strong> in recursion is generally calculated by looking at the number of recursive calls made and the work done per call. For example, Fibonacci makes 2 calls for every step, leading to <code>O(2^N)</code> time.
        </p>
        <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
          <strong>Space Complexity</strong> is determined by the maximum depth of the Recursion Tree (the maximum height of the Call Stack). Even if a function doesn't allocate arrays, it still uses <code>O(Depth)</code> auxiliary space for stack frames.
        </p>
      </>
    )
  }
];

export default function Theory() {
  const [openSection, setOpenSection] = useState('what-is-recursion');

  return (
    <div className="page-container" style={{ padding: '40px', overflowY: 'auto', height: '100%', color: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <BookOpen size={28} style={{ color: '#3b82f6' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Theory & Concepts</h1>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '16px' }}>
          Master the fundamental concepts of recursion through interactive explanations.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map((topic) => {
            const isOpen = openSection === topic.id;
            return (
              <div 
                key={topic.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isOpen ? '#3b82f6' : '#334155'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : topic.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isOpen ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#f8fafc',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {topic.icon}
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{topic.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={20} style={{ color: '#64748b' }}/> : <ChevronRight size={20} style={{ color: '#64748b' }}/>}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 20px 20px', color: '#cbd5e1', fontSize: '15px' }}>
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '20px' }}>
                      {topic.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
