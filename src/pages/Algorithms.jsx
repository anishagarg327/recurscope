import React from 'react';
import { useAlgorithms } from '../contexts/AlgorithmsContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Code, Clock, HardDrive, Zap } from 'lucide-react';

export default function Algorithms() {
  const { allAlgorithms, selectAlgorithm } = useAlgorithms();
  const { navigate } = useNavigation();

  const handleOpenPlayground = (id) => {
    selectAlgorithm(id);
    navigate('Playground');
  };

  return (
    <div className="page-container" style={{ padding: '40px', overflowY: 'auto', height: '100%', color: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 'bold' }}>Algorithms Registry</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '16px' }}>
          Explore recursive algorithms, understand their complexities, and visualize their call stacks interactively.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {allAlgorithms.map((algo) => (
            <div 
              key={algo.id}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              className="algorithm-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>{algo.name}</h2>
                <span style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  color: '#22c55e', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {algo.difficulty || 'Beginner'}
                </span>
              </div>
              
              <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '24px', flex: 1, lineHeight: '1.5' }}>
                {algo.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '13px', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} style={{ color: '#fbbf24' }} />
                  <span>Time Complexity: </span>
                  <span style={{ fontFamily: 'monospace', color: '#f8fafc' }}>{algo.complexity?.time || 'O(1)'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={14} style={{ color: '#a855f7' }} />
                  <span>Space Complexity: </span>
                  <span style={{ fontFamily: 'monospace', color: '#f8fafc' }}>{algo.complexity?.space || 'O(1)'}</span>
                </div>
              </div>

              <button 
                onClick={() => handleOpenPlayground(algo.id)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  backgroundColor: '#2563eb',
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <Zap size={16} /> Open in Playground
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
