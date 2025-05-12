
import React, { useState } from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

// Mock data for water intake history
const weeklyWaterData = [
  { name: 'Seg', intake: 1800 },
  { name: 'Ter', intake: 2200 },
  { name: 'Qua', intake: 1600 },
  { name: 'Qui', intake: 2000 },
  { name: 'Sex', intake: 2500 },
  { name: 'Sáb', intake: 1900 },
  { name: 'Dom', intake: 2300 },
];

const Water: React.FC = () => {
  const { t } = useTranslation();
  const [waterIntake, setWaterIntake] = useState(1200); // in ml
  const [cupSize, setCupSize] = useState(250); // in ml
  const [unitType, setUnitType] = useState('ml');
  const dailyGoal = 2500; // in ml
  
  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, 5000)); // Cap at 5000ml
  };
  
  const handleRemoveWater = (amount: number) => {
    setWaterIntake(prev => Math.max(prev - amount, 0));
  };
  
  const displayIntake = unitType === 'ml' ? waterIntake : (waterIntake / 1000).toFixed(1);
  const displayGoal = unitType === 'ml' ? dailyGoal : (dailyGoal / 1000).toFixed(1);
  const progressPercentage = (waterIntake / dailyGoal) * 100;
  
  // Convert weekly data based on unit type
  const formattedWeeklyData = weeklyWaterData.map(day => ({
    name: day.name,
    intake: unitType === 'ml' ? day.intake : day.intake / 1000
  }));
  
  return (
    <PageLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('water.title')}</h2>
        
        <Card className="overflow-hidden mb-6">
          <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white">
            <div 
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYzMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMCwzMCBDNjAsMzAgOTAsMCA5MCwwIFMxMjAsMzAgMTgwLDMwIEMxODAsMzAgMjEwLDAgMjEwLDAgUzI0MCwzMCAzMDAsMzAgTDMwMCwxMDAgTDAsMTAwIFoiPjwvcGF0aD4KPC9zdmc+Cg==')] opacity-20"
            ></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-2 text-center">
                <div className="text-xs text-blue-100">{t('water.todaysIntake')}</div>
                <div className="text-3xl font-bold">{displayIntake} {unitType}</div>
                <div className="text-xs text-blue-100">{t('water.goal')}: {displayGoal} {unitType}</div>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-blue-300/50 w-full max-w-52" />
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <Tabs onValueChange={setUnitType} value={unitType} className="w-40">
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="ml" className="text-xs">ml</TabsTrigger>
                  <TabsTrigger value="L" className="text-xs">L</TabsTrigger>
                  <TabsTrigger value="cup" className="text-xs">Copo</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex justify-center gap-3 mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-14 w-14 rounded-full flex flex-col items-center justify-center"
                onClick={() => handleAddWater(cupSize)}
              >
                <Droplet size={18} className="text-blue-500 mb-1" />
                <span className="text-xs">+1 Copo</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-14 w-14 rounded-full flex flex-col items-center justify-center"
                onClick={() => handleAddWater(500)}
              >
                <Droplet size={18} className="text-blue-500 mb-1" />
                <span className="text-xs">+500ml</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-14 w-14 rounded-full flex flex-col items-center justify-center"
                onClick={() => handleRemoveWater(250)}
              >
                <Minus size={18} className="text-red-500 mb-1" />
                <span className="text-xs">-250ml</span>
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleAddWater(250)}
              >
                <Plus size={18} className="mr-1" /> {t('water.addWater')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('water.weeklyIntake')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedWeeklyData} margin={{ top: 20, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}${unitType}`} />
                  <Tooltip 
                    formatter={(value) => [`${value} ${unitType}`, 'Consumo']} 
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="intake" fill="#33C3F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Water;
