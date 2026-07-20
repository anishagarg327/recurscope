import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useExecution } from '../contexts/ExecutionContext';
import { Play, Trash2, History } from 'lucide-react';

export default function ReplaySessions() {
  const { navigate } = useNavigation();
  const { triggerExecution } = useExecution();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('recurscope_sessions');
      if (saved) {
        setSessions(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load sessions");
    }
  }, []);

  const handleDelete = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('recurscope_sessions', JSON.stringify(updated));
  };

  const handleReplay = (session) => {
    triggerExecution(session.algo, session.args);
    navigate('Playground');
  };

  return (
    <div className="page-container" style={{ padding: '40px', overflowY: 'auto', height: '100%', color: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <History size={28} style={{ color: '#3b82f6' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Replay Sessions</h1>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '16px' }}>
          Review and replay your past execution sessions.
        </p>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed #334155' }}>
            <p style={{ color: '#64748b', fontSize: '16px' }}>No recorded sessions yet.</p>
            <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>Run an algorithm in the Playground to save a session.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sessions.map((session) => (
              <div 
                key={session.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa', textTransform: 'capitalize' }}>
                      {session.algo}
                    </span>
                    <span style={{ fontFamily: 'monospace', color: '#93c5fd', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>
                      Args: {JSON.stringify(session.args)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '13px' }}>
                    <span>Date: {new Date(session.date).toLocaleString()}</span>
                    <span>•</span>
                    <span>{session.steps} Steps</span>
                    <span>•</span>
                    <span>Max Depth: {session.maxDepth}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleReplay(session)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#22c55e',
                      border: '1px solid #22c55e',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)' }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <Play size={16} /> Replay
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(session.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    title="Delete Session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
