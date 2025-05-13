
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  
  // If user is already logged in, redirect to groups page
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/groups');
    }
  }, [user, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 p-6">
      <h1 className="text-4xl font-bold text-study-primary mb-6 text-center">
        {t('app.name')}
      </h1>
      <p className="text-lg text-study-secondary mb-12 text-center">
        {t('app.slogan')}
      </p>
      
      <div className="w-64 h-64 rounded-full bg-study-primary bg-opacity-20 flex items-center justify-center mb-12">
        <div className="w-48 h-48 rounded-full bg-study-primary bg-opacity-30 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-study-primary flex items-center justify-center">
            <span className="text-white text-3xl font-bold">SB</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-xs">
        {isLoading ? (
          <Button 
            className="w-full bg-study-primary opacity-50" 
            disabled
          >
            {t('loading')}
          </Button>
        ) : user ? (
          <Button 
            className="w-full bg-study-primary hover:bg-opacity-90" 
            onClick={() => navigate('/groups')}
          >
            {t('navigation.groups')}
          </Button>
        ) : (
          <>
            <Button 
              className="w-full bg-study-primary hover:bg-opacity-90" 
              onClick={() => navigate('/login')}
            >
              {t('login.title')}
            </Button>
            <Button 
              className="w-full bg-white border border-study-primary text-study-primary hover:bg-gray-50" 
              onClick={() => navigate('/register')}
            >
              {t('register.title')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
