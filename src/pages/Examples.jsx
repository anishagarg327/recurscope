import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useExecution } from '../contexts/ExecutionContext';
import { Play } from 'lucide-react';

export default function Examples() {
  const { navigate } = useNavigation();
  const { triggerExecution } = useExecution();

  const examples = [
    { id: 1, algo: 'factorial', args: [5], title: 'Factorial(5)', steps: 18 },
    { id: 2, algo: 'factorial', args: [8], title: 'Factorial(8)', steps: 30 },
    { id: 3, algo: 'fibonacci', args: [6], title: 'Fibonacci(6)', steps: 41 },
    { id: 4, algo: 'binarySearch', args: [[1, 3, 5, 7, 9], 7], title: 'Binary Search([1,3,5,7,9], 7)', steps: 12 }
  ];

  const handleReplay = (example) => {
    triggerExecution(example.algo, example.args);
    navigate('Playground');
  };

  return (
    <div className="page-container" style={{ padding: '40px', overflowY: 'auto', height: '100%', color: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 'bold' }}>Ready-Made Examples</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '16px' }}>
          Instantly load and visualize common recursive patterns and execution flows.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {examples.map((ex) => (
            <div 
              key={ex.id}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '12px', fontFamily: 'monospace' }}>
                {ex.title}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#94a3b8', fontSize: '14px' }}>
                <span style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px' }}>
                  {ex.steps} Steps
                </span>
              </div>

              <button 
                onClick={() => handleReplay(ex)}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '10px 0',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
              >
                <Play size={16} /> Replay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
