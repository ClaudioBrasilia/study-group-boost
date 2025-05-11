
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

const Plans: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth();

  const handleSubscribe = (planId: string) => {
    // In a real app, this would connect to a payment processor
    updateUserPlan(planId);
    toast.success(`Subscribed to ${planId} plan!`);
    navigate('/groups');
  };

  const plans = [
    {
      id: 'free',
      name: t('plans.free.name'),
      price: t('plans.free.price'),
      features: t('plans.free.features', { returnObjects: true }) as string[],
      isCurrent: user?.plan === 'free'
    },
    {
      id: 'basic',
      name: t('plans.basic.name'),
      price: t('plans.basic.price'),
      features: t('plans.basic.features', { returnObjects: true }) as string[],
      isCurrent: user?.plan === 'basic'
    },
    {
      id: 'premium',
      name: t('plans.premium.name'),
      price: t('plans.premium.price'),
      features: t('plans.premium.features', { returnObjects: true }) as string[],
      isCurrent: user?.plan === 'premium'
    }
  ];

  return (
    <PageLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{t('plans.title')}</h1>
      </div>

      <div className="space-y-6">
        {/* Free Plan */}
        <Card className={`border-2 ${plans[0].isCurrent ? 'border-study-primary' : 'border-transparent'}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {plans[0].name}
              {plans[0].isCurrent && <Badge className="bg-study-primary">{t('plans.current')}</Badge>}
            </CardTitle>
            <div className="text-2xl font-bold">{plans[0].price}</div>
            <CardDescription>Para começar a estudar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[0].features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={plans[0].isCurrent}
              onClick={() => handleSubscribe('free')}
            >
              {plans[0].isCurrent ? t('plans.current') : t('plans.subscribe')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Basic Plan */}
        <Card className={`border-2 ${plans[1].isCurrent ? 'border-study-primary' : 'border-transparent'}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {plans[1].name}
              {plans[1].isCurrent && <Badge className="bg-study-primary">{t('plans.current')}</Badge>}
            </CardTitle>
            <div className="text-2xl font-bold">{plans[1].price}</div>
            <CardDescription>Para estudantes dedicados</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[1].features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-study-primary" 
              disabled={plans[1].isCurrent}
              onClick={() => handleSubscribe('basic')}
            >
              {plans[1].isCurrent ? t('plans.current') : t('plans.subscribe')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className={`border-2 ${plans[2].isCurrent ? 'border-study-primary' : 'border-transparent'}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {plans[2].name}
              {plans[2].isCurrent && <Badge className="bg-study-primary">{t('plans.current')}</Badge>}
            </CardTitle>
            <div className="text-2xl font-bold">{plans[2].price}</div>
            <CardDescription>Para o máximo desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[2].features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-study-primary" 
              disabled={plans[2].isCurrent}
              onClick={() => handleSubscribe('premium')}
            >
              {plans[2].isCurrent ? t('plans.current') : t('plans.subscribe')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Plans;
