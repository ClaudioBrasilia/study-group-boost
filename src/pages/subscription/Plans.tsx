
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

// Define the allowed plan types to match what the AuthContext expects
type PlanType = 'free' | 'basic' | 'premium';

const Plans: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth();

  const handleSubscribe = (planId: PlanType) => {
    // In a real app, this would connect to a payment processor
    updateUserPlan(planId);
    toast.success(`Você assinou o plano ${planId}!`);
    navigate('/groups');
  };


  const plans = [
      {
        id: 'free' as PlanType,
        name: 'Free',
        price: 'R$ 0',
        features: [
          'Acesso básico ao app',
          'Timer de estudos',
          'Controle de água',
          'Progresso individual',
          '1 grupo (até 5 membros)',
        ],
        isCurrent: user?.plan === 'free'
      },
      {
        id: 'basic' as PlanType,
        name: 'Basic',
        price: 'R$ 9,90/mês',
        features: [
          'Tudo do plano Free',
          'Criar grupos de estudo',
          'Metas compartilhadas',
          'Ranking de pontos',
          'Notificações prioritárias',
        ],
        isCurrent: user?.plan === 'basic'
      },
      {
        id: 'premium' as PlanType,
        name: 'Premium',
        price: 'R$ 19,90/mês',
        features: [
          'Tudo do plano Basic',
          'Até 50 grupos (20 membros cada)',
          'Upload ilimitado de arquivos',
          'Gerador de Testes com IA',
          'Análises avançadas',
          'Notificações personalizadas',
          'Suporte prioritário',
        ],
        isCurrent: user?.plan === 'premium'
      },
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
              onClick={() => handleSubscribe(plans[0].id)}
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
              onClick={() => handleSubscribe(plans[1].id)}
            >
              {plans[1].isCurrent ? t('plans.current') : t('plans.subscribe')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className={`border-2 ${plans[2].isCurrent ? 'border-study-primary' : 'border-transparent'} relative overflow-hidden`}>
          {/* Decorative badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-yellow-400 text-white text-xs font-bold px-4 py-1 -mr-8 transform rotate-45 translate-x-2 translate-y-3">
            PREMIUM
          </div>
          
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                {plans[2].name}
                <Crown className="ml-2 h-4 w-4 text-yellow-500" />
              </div>
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
              {/* Exclusive features */}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-study-primary" 
              disabled={plans[2].isCurrent}
              onClick={() => handleSubscribe(plans[2].id)}
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
