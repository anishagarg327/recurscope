import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  BookOpen, 
  History, 
  Settings, 
  User
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'Playground', icon: Terminal, active: true },
    { name: 'Examples', icon: BookOpen, active: false },
    { name: 'Saved Sessions', icon: History, active: false },
    { name: 'Settings', icon: Settings, active: false }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-dot"></div>
        <span>Recurscope</span>
      </div>
      
      <nav className="sidebar-menu">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index} 
              className={`sidebar-link ${item.active ? 'active' : ''}`}
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="username">Guest Developer</span>
            <span className="user-role">Free Tier</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
