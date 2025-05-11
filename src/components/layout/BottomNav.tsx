
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart2, Droplet, Award, User } from 'lucide-react';

const navItems = [
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/progress', label: 'Progress', icon: BarChart2 },
  { to: '/water', label: 'Water', icon: Droplet },
  { to: '/leaderboard', label: 'Leaders', icon: Award },
  { to: '/profile', label: 'Profile', icon: User },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        
        return (
          <Link 
            key={item.to}
            to={item.to} 
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
