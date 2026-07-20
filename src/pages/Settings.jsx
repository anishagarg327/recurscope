import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings as SettingsIcon, Monitor, FastForward, PlayCircle, Eye, Braces, TerminalSquare, RotateCcw } from 'lucide-react';

export default function Settings() {
  const settings = useSettings();
  const { 
    theme, animationSpeed, playbackSpeed, treeLayout, enableAnimations, 
    showLineNumbers, developerMode, updateSetting, resetSettings 
  } = settings;

  const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
          <Icon size={20} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{description}</p>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '40px', overflowY: 'auto', height: '100%', color: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <SettingsIcon size={28} style={{ color: '#3b82f6' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Preferences</h1>
        </div>

        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '12px', padding: '0 24px' }}>
          
          <SettingRow icon={Monitor} title="Appearance" description="Toggle between dark and light themes.">
            <select 
              value={theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '6px' }}
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </SettingRow>

          <SettingRow icon={FastForward} title="Animation Speed" description="Adjust the rendering speed of tree nodes and connections.">
            <select 
              value={animationSpeed}
              onChange={(e) => updateSetting('animationSpeed', parseFloat(e.target.value))}
              style={{ backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', padding: '8px 16px', borderRadius: '6px' }}
            >
              <option value={0.5}>0.5x (Slow)</option>
              <option value={1}>1x (Normal)</option>
              <option value={2}>2x (Fast)</option>
            </select>
          </SettingRow>

          <SettingRow icon={PlayCircle} title="Playback Speed" description="Delay between execution steps during Auto-Play.">
            <select 
              value={playbackSpeed}
              onChange={(e) => updateSetting('playbackSpeed', parseInt(e.target.value))}
              style={{ backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', padding: '8px 16px', borderRadius: '6px' }}
            >
              <option value={1000}>Slow (1000ms)</option>
              <option value={500}>Normal (500ms)</option>
              <option value={200}>Fast (200ms)</option>
            </select>
          </SettingRow>

          <SettingRow icon={Eye} title="Enable Animations" description="Toggle structural CSS/SVG animations globally.">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={enableAnimations}
                onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
              />
            </label>
          </SettingRow>

          <SettingRow icon={Braces} title="Show Line Numbers" description="Display line numbers in the Code Editor view.">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showLineNumbers}
                onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
              />
            </label>
          </SettingRow>

          <SettingRow icon={TerminalSquare} title="Developer Mode" description="Enable advanced logging and raw AST inspection tools.">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={developerMode}
                onChange={(e) => updateSetting('developerMode', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
              />
            </label>
          </SettingRow>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={resetSettings}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RotateCcw size={16} /> Reset Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
