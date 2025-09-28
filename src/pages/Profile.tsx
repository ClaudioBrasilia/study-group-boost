
import React, { useState } from 'react';
import { Trophy, Book, Calendar, Award, Bell, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileData } from '@/hooks/useProfileData';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profileStats, loading } = useProfileData();
  const [notifications, setNotifications] = useState({
    goalReminders: true,
    groupActivity: true,
    achievements: true,
    weeklyReport: false,
  });
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const earnedAchievements = profileStats.achievements.filter(a => a.earned);
  const unearnedAchievements = profileStats.achievements.filter(a => !a.earned);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center mb-8">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-32 mx-auto mb-4" />
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-72 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto mb-4" />
          <div className="flex justify-center space-x-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profileStats.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile/settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={20} />
          </Button>
        </div>
        <h2 className="text-2xl font-bold">{profileStats.name}</h2>
        <div className="text-muted-foreground mb-2">{t('profile.level')} {profileStats.level} {t('profile.scholar')}</div>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center">
            <Trophy size={16} className="text-primary mr-1" />
            <span>{profileStats.points} {t('profile.points')}</span>
          </div>
          <div className="w-1 h-1 bg-muted rounded-full"></div>
          <div className="flex items-center">
            <Award size={16} className="text-primary mr-1" />
            <span>{t('profile.rank')} #{profileStats.rank}</span>
          </div>
        </div>
        
        <div className="max-w-xs mx-auto mb-1 flex justify-between text-xs">
          <span>{t('profile.level')} {profileStats.level}</span>
          <span>{t('profile.level')} {profileStats.level + 1}</span>
        </div>
        <div className="max-w-xs mx-auto mb-1">
          <Progress value={profileStats.progress} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          {profileStats.pointsToNextLevel} {t('profile.toNextLevel')}
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => window.location.href = '/progress'}
          >
            <Calendar size={14} className="mr-1" />
            <span>{t('profile.studyStats')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => window.location.href = '/groups'}
          >
            <Book size={14} className="mr-1" />
            <span>{t('profile.myGroups')} ({profileStats.groups})</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('profile.achievements')} ({earnedAchievements.length}/{profileStats.achievements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('profile.earned')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {earnedAchievements.map(achievement => (
                <div key={achievement.id} className="border rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center mb-1">
                    <Award size={16} className="text-primary mr-2" />
                    <span className="font-medium text-sm">{t(`profile.achievementNames.${achievement.nameKey}`)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t(`profile.achievementDescriptions.${achievement.descriptionKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {unearnedAchievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('profile.locked')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {unearnedAchievements.map(achievement => (
                  <div key={achievement.id} className="border rounded-lg p-3 bg-muted/50 opacity-60">
                    <div className="flex items-center mb-1">
                      <Award size={16} className="text-muted-foreground mr-2" />
                      <span className="font-medium text-sm">{t(`profile.achievementNames.${achievement.nameKey}`)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t(`profile.achievementDescriptions.${achievement.descriptionKey}`)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Bell size={16} className="mr-2" />
            {t('profile.notificationSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-reminders" className="font-medium">{t('profile.goalReminders')}</Label>
                <p className="text-sm text-gray-500">{t('profile.dailyReminders')}</p>
              </div>
              <Switch 
                id="goal-reminders" 
                checked={notifications.goalReminders}
                onCheckedChange={() => handleNotificationChange('goalReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="group-activity" className="font-medium">{t('profile.groupActivity')}</Label>
                <p className="text-sm text-gray-500">{t('profile.groupUpdates')}</p>
              </div>
              <Switch 
                id="group-activity" 
                checked={notifications.groupActivity}
                onCheckedChange={() => handleNotificationChange('groupActivity')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="achievements" className="font-medium">{t('profile.achievementNotifications')}</Label>
                <p className="text-sm text-gray-500">{t('profile.achievementAlerts')}</p>
              </div>
              <Switch 
                id="achievements" 
                checked={notifications.achievements}
                onCheckedChange={() => handleNotificationChange('achievements')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-report" className="font-medium">{t('profile.weeklyReport')}</Label>
                <p className="text-sm text-gray-500">{t('profile.progressSummary')}</p>
              </div>
              <Switch 
                id="weekly-report" 
                checked={notifications.weeklyReport}
                onCheckedChange={() => handleNotificationChange('weeklyReport')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Profile;
