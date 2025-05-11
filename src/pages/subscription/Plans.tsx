
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import PageLayout from '@/components/layout/PageLayout';

const Plans: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth();
  
  const handleSubscribe = (plan: 'free' | 'basic' | 'premium') => {
    if (plan === 'free') {
      updateUserPlan('free');
      toast.success(t('plans.free.name') + ' plan activated');
      navigate('/groups');
      return;
    }
    
    // In a real app, this would redirect to a payment processor
    // For now, we'll just update the user's plan
    if (window.confirm(`This would normally take you to a payment page for the ${plan} plan. Would you like to activate this plan for demo purposes?`)) {
      updateUserPlan(plan);
      toast.success(`${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated`);
      navigate('/groups');
    }
  };
  
  return (
    <PageLayout>
      <div className="py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-study-primary">{t('plans.title')}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className={`border-2 ${user?.plan === 'free' ? 'border-study-primary' : 'border-gray-200'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t('plans.free.name')}</CardTitle>
              <CardDescription className="text-lg font-bold">{t('plans.free.price')}</CardDescription>
              {user?.plan === 'free' && (
                <div className="bg-study-primary text-white text-xs px-2 py-1 rounded-full absolute top-2 right-2">
                  {t('plans.current')}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2">
                {t('plans.free.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-study-primary"
                disabled={user?.plan === 'free'}
                onClick={() => handleSubscribe('free')}
              >
                {user?.plan === 'free' ? t('plans.current') : t('plans.subscribe')}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Basic Plan */}
          <Card className={`border-2 ${user?.plan === 'basic' ? 'border-study-primary' : 'border-gray-200'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t('plans.basic.name')}</CardTitle>
              <CardDescription className="text-lg font-bold">{t('plans.basic.price')}</CardDescription>
              {user?.plan === 'basic' && (
                <div className="bg-study-primary text-white text-xs px-2 py-1 rounded-full absolute top-2 right-2">
                  {t('plans.current')}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2">
                {t('plans.basic.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-study-primary"
                disabled={user?.plan === 'basic'}
                onClick={() => handleSubscribe('basic')}
              >
                {user?.plan === 'basic' ? t('plans.current') : t('plans.subscribe')}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className={`border-2 ${user?.plan === 'premium' ? 'border-study-primary' : 'border-gray-200'}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t('plans.premium.name')}</CardTitle>
              <CardDescription className="text-lg font-bold">{t('plans.premium.price')}</CardDescription>
              {user?.plan === 'premium' && (
                <div className="bg-study-primary text-white text-xs px-2 py-1 rounded-full absolute top-2 right-2">
                  {t('plans.current')}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2">
                {t('plans.premium.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-study-primary"
                disabled={user?.plan === 'premium'}
                onClick={() => handleSubscribe('premium')}
              >
                {user?.plan === 'premium' ? t('plans.current') : t('plans.subscribe')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Plans;
