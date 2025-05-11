
import React from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'StudyBoost';
    case '/groups':
      return 'Study Groups';
    case '/progress':
      return 'My Progress';
    case '/water':
      return 'Water Tracker';
    case '/leaderboard':
      return 'Leaderboard';
    case '/profile':
      return 'My Profile';
    default:
      if (pathname.startsWith('/group/')) {
        return 'Group Details';
      }
      return 'StudyBoost';
  }
};

const AppHeader: React.FC = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  
  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-center text-study-primary">{title}</h1>
    </header>
  );
};

export default AppHeader;
