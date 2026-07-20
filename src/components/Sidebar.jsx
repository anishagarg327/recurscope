import React from 'react';
import { 
  Terminal, 
  GitBranch, 
  BookOpen, 
  GraduationCap, 
  History, 
  Settings, 
  User
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export default function Sidebar() {
  const { currentPage, navigate } = useNavigation();

  const menuItems = [
    { name: 'Playground', icon: Terminal },
    { name: 'Algorithms', icon: GitBranch },
    { name: 'Examples', icon: BookOpen },
    { name: 'Theory', icon: GraduationCap },
    { name: 'Replay Sessions', icon: History },
    { name: 'Settings', icon: Settings }
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
          const isActive = currentPage === item.name;
          return (
            <button 
              key={index} 
              onClick={() => navigate(item.name)}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
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
