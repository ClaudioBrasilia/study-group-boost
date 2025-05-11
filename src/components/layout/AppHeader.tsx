
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguagesIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getPageTitle = (pathname: string, t: (key: string) => string): string => {
  switch (pathname) {
    case '/':
      return t('app.name');
    case '/groups':
      return t('navigation.groups');
    case '/progress':
      return t('navigation.progress');
    case '/water':
      return t('navigation.water');
    case '/leaderboard':
      return t('navigation.leaders');
    case '/profile':
      return t('navigation.profile');
    case '/login':
      return t('login.title');
    case '/register':
      return t('register.title');
    case '/plans':
      return t('plans.title');
    case '/generate-test':
      return t('aiTests.title');
    default:
      if (pathname.startsWith('/group/')) {
        return t('groups.title');
      }
      return t('app.name');
  }
};

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  
  const title = getPageTitle(location.pathname, t);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
      <div className="flex-1"></div>
      
      <h1 className="text-xl font-semibold text-center text-study-primary flex-1">{title}</h1>
      
      <div className="flex items-center gap-2 flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <LanguagesIcon size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage('en')}>
              {t('language.english')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('pt')}>
              {t('language.portuguese')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <UserIcon size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                {user.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/plans')}>
                {user.plan === 'free' ? t('plans.free.name') : 
                 user.plan === 'basic' ? t('plans.basic.name') : 
                 t('plans.premium.name')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                logout();
                navigate('/login');
              }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          location.pathname !== '/login' && location.pathname !== '/register' && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )
        )}
      </div>
    </header>
  );
};

export default AppHeader;
