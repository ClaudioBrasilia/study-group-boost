
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Target, TrendingUp, Award, Clock, BookOpen, Users } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { useProgressData } from '@/hooks/useProgressData';
import { useParams } from 'react-router-dom';

const ProgressPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [view, setView] = useState<'individual' | 'group'>('individual');
  const { t } = useTranslation();
  const { groupId } = useParams();
  
  const { stats, loading } = useProgressData(view === 'group' ? groupId : undefined);
  
  if (loading) {
    return (
      <PageLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header with view toggle */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('progress.title')}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Tabs value={view} onValueChange={(value) => setView(value as 'individual' | 'group')} className="w-auto">
              <TabsList className="grid grid-cols-2 h-9">
                <TabsTrigger value="individual" className="text-xs flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Individual
                </TabsTrigger>
                {groupId && (
                  <TabsTrigger value="group" className="text-xs flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Grupo
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="week" className="text-xs">{t('leaderboard.week')}</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">{t('leaderboard.month')}</TabsTrigger>
                <TabsTrigger value="year" className="text-xs">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary bg-gradient-to-br from-background to-background/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('progress.pagesRead')}</p>
                  <div className="text-2xl font-bold text-primary">{stats.totalPages}</div>
                </div>
                <BookOpen className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary bg-gradient-to-br from-background to-background/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('progress.studyTime')}</p>
                  <div className="text-2xl font-bold text-secondary">{stats.totalStudyTime} min</div>
                </div>
                <Clock className="h-8 w-8 text-secondary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent bg-gradient-to-br from-background to-background/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('progress.exercises')}</p>
                  <div className="text-2xl font-bold text-accent">{stats.totalExercises}</div>
                </div>
                <Target className="h-8 w-8 text-accent opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive bg-gradient-to-br from-background to-background/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('progress.studyStreak')}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-destructive">{stats.studyStreak}</span>
                    <Calendar className="h-5 w-5 text-destructive" />
                  </div>
                </div>
                <Award className="h-8 w-8 text-destructive opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress (only for group view) */}
        {view === 'group' && stats.goalsProgress.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Progresso das Metas do Grupo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.goalsProgress.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{goal.subject}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({goal.type === 'time' ? 'Tempo' : goal.type === 'pages' ? 'Páginas' : 'Exercícios'})
                      </span>
                    </div>
                    <span className="text-sm font-medium">{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-right">
                    <Badge variant={goal.progress >= 100 ? "default" : "secondary"} className="text-xs">
                      {goal.progress}% completo
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('progress.studyTimeByDay')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}m`}
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} minutos`, t('progress.studyTime')]} 
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="time" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                {t('progress.pagesReadByDay')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} páginas`, t('progress.pagesRead')]} 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="pages" 
                      fill="hsl(var(--secondary))" 
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Subject Distribution */}
        {stats.subjectData.length > 0 && (
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                {t('progress.studyBySubject')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.subjectData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {stats.subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentagem']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  {stats.subjectData.map((subject, index) => (
                    <div key={subject.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject.color }}
                        ></div>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="font-bold"
                        style={{ 
                          backgroundColor: `${subject.color}20`,
                          color: subject.color,
                          borderColor: subject.color
                        }}
                      >
                        {subject.value}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ProgressPage;
