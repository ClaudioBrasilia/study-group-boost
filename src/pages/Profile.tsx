
import React, { useState } from 'react';
import { Trophy, Book, Calendar, Award, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock user data
const USER = {
  name: 'Alex Johnson',
  points: 1250,
  level: 8,
  progress: 65,
  pointsToNextLevel: 350,
  groups: 3,
  rank: 42,
  achievements: [
    { id: '1', nameKey: 'studyWarrior', descriptionKey: 'studyWarrior', earned: true },
    { id: '2', nameKey: 'knowledgeSeeker', descriptionKey: 'knowledgeSeeker', earned: true },
    { id: '3', nameKey: 'groupLeader', descriptionKey: 'groupLeader', earned: true },
    { id: '4', nameKey: 'problemSolver', descriptionKey: 'problemSolver', earned: false },
    { id: '5', nameKey: 'hydrationMaster', descriptionKey: 'hydrationMaster', earned: true },
    { id: '6', nameKey: 'dedicationStar', descriptionKey: 'dedicationStar', earned: false },
  ]
};

const Profile: React.FC = () => {
  const { t } = useTranslation();
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
  
  const earnedAchievements = USER.achievements.filter(a => a.earned);
  const unearnedAchievements = USER.achievements.filter(a => !a.earned);
  
  return (
    <PageLayout>
      <div className="text-center mb-8">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          <AvatarFallback className="bg-study-primary text-white text-xl">
            {USER.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{USER.name}</h2>
        <div className="text-gray-500 mb-2">{t('profile.level')} {USER.level} {t('profile.scholar')}</div>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center">
            <Trophy size={16} className="text-study-primary mr-1" />
            <span>{USER.points} {t('profile.points')}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <Award size={16} className="text-study-primary mr-1" />
            <span>{t('profile.rank')} #{USER.rank}</span>
          </div>
        </div>
        
        <div className="max-w-xs mx-auto mb-1 flex justify-between text-xs">
          <span>{t('profile.level')} {USER.level}</span>
          <span>{t('profile.level')} {USER.level + 1}</span>
        </div>
        <div className="max-w-xs mx-auto mb-1">
          <Progress value={USER.progress} className="h-2" />
        </div>
        <div className="text-xs text-gray-500 mb-4">
          {USER.pointsToNextLevel} {t('profile.toNextLevel')}
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{t('profile.studyStats')}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Book size={14} className="mr-1" />
            <span>{t('profile.myGroups')} ({USER.groups})</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('profile.achievements')} ({earnedAchievements.length}/{USER.achievements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('profile.earned')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {earnedAchievements.map(achievement => (
                <div key={achievement.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center mb-1">
                    <Award size={16} className="text-study-primary mr-2" />
                    <span className="font-medium text-sm">{t(`profile.achievementNames.${achievement.nameKey}`)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t(`profile.achievementDescriptions.${achievement.descriptionKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {unearnedAchievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('profile.locked')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {unearnedAchievements.map(achievement => (
                  <div key={achievement.id} className="border rounded-lg p-3 bg-gray-50 opacity-60">
                    <div className="flex items-center mb-1">
                      <Award size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-sm">{t(`profile.achievementNames.${achievement.nameKey}`)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t(`profile.achievementDescriptions.${achievement.descriptionKey}`)}</p>
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
