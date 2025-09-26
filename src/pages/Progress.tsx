
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const Progress: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const { t } = useTranslation();

  // Mock data for study stats - using translation keys for day names
  const weeklyData = [
    { name: t('days.mon'), pages: 23, time: 45, exercises: 5 },
    { name: t('days.tue'), pages: 15, time: 30, exercises: 8 },
    { name: t('days.wed'), pages: 30, time: 60, exercises: 12 },
    { name: t('days.thu'), pages: 27, time: 50, exercises: 10 },
    { name: t('days.fri'), pages: 18, time: 40, exercises: 7 },
    { name: t('days.sat'), pages: 35, time: 75, exercises: 15 },
    { name: t('days.sun'), pages: 20, time: 55, exercises: 9 },
  ];

const subjectData = [
  { name: 'Matemática', value: 35 },
  { name: 'Física', value: 25 },
  { name: 'Literatura', value: 20 },
  { name: 'Química', value: 15 },
  { name: 'História', value: 5 },
];

const COLORS = ['#9b87f5', '#7E69AB', '#33C3F0', '#4CAF50', '#FFC107'];


  // Calculate total stats
  const totalPages = weeklyData.reduce((sum, day) => sum + day.pages, 0);
  const totalTime = weeklyData.reduce((sum, day) => sum + day.time, 0);
  const totalExercises = weeklyData.reduce((sum, day) => sum + day.exercises, 0);
  const streakDays = 5;
  
  return (
    <PageLayout>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('progress.title')}</h2>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="week" className="text-xs">{t('leaderboard.week')}</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">{t('leaderboard.month')}</TabsTrigger>
            <TabsTrigger value="year" className="text-xs">{t('progress.title')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{t('progress.pagesRead')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-study-primary">{totalPages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{t('progress.studyTime')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-study-primary">{totalTime} {t('progress.minutes')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{t('progress.exercises')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-study-primary">{totalExercises}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{t('progress.studyStreak')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-center">
              <Calendar size={18} className="text-study-primary mr-1" />
              <span className="text-2xl font-bold text-study-primary">{streakDays} {t('progress.days')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('progress.studyTimeByDay')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}m`} />
                <Tooltip 
                  formatter={(value) => [`${value} minutos`, t('progress.studyTime')]} 
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="time" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('progress.pagesReadByDay')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} páginas`, t('progress.pagesRead')]} />
                <Bar dataKey="pages" fill="#33C3F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('progress.studyBySubject')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {subjectData.map((subject, index) => (
              <Badge key={subject.name} variant="outline" style={{ color: COLORS[index % COLORS.length], borderColor: COLORS[index % COLORS.length] }}>
                {subject.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Progress;
