
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart2, Droplet, Award, User, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const navItems = [
    { to: '/groups', label: t('navigation.groups'), icon: Users },
    { to: '/progress', label: t('navigation.progress'), icon: BarChart2 },
    { to: '/timer', label: t('navigation.timer'), icon: Clock },
    { to: '/water', label: t('navigation.water'), icon: Droplet },
    { to: '/leaderboard', label: t('navigation.leaders'), icon: Award },
    { to: '/profile', label: t('navigation.profile'), icon: User },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        
        return (
          <Link 
            key={item.to}
            to={item.to} 
            className={`nav-link flex flex-col items-center px-2 py-1 text-xs ${
              isActive ? 'text-study-primary font-medium' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
            <span className="mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
