
import React, { useState } from 'react';
import { Trophy, Book, Calendar, Award, Bell } from 'lucide-react';
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
    { id: '1', name: 'Study Warrior', description: 'Complete 10 study sessions', earned: true },
    { id: '2', name: 'Knowledge Seeker', description: 'Read 100 pages', earned: true },
    { id: '3', name: 'Group Leader', description: 'Create a study group', earned: true },
    { id: '4', name: 'Problem Solver', description: 'Complete 50 exercises', earned: false },
    { id: '5', name: 'Hydration Master', description: 'Track water intake for 7 days', earned: true },
    { id: '6', name: 'Dedication Star', description: 'Study for 10 days in a row', earned: false },
  ]
};

const Profile: React.FC = () => {
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
        <div className="text-gray-500 mb-2">Level {USER.level} Scholar</div>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center">
            <Trophy size={16} className="text-study-primary mr-1" />
            <span>{USER.points} points</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <Award size={16} className="text-study-primary mr-1" />
            <span>Rank #{USER.rank}</span>
          </div>
        </div>
        
        <div className="max-w-xs mx-auto mb-1 flex justify-between text-xs">
          <span>Level {USER.level}</span>
          <span>Level {USER.level + 1}</span>
        </div>
        <div className="max-w-xs mx-auto mb-1">
          <Progress value={USER.progress} className="h-2" />
        </div>
        <div className="text-xs text-gray-500 mb-4">
          {USER.pointsToNextLevel} points to next level
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>Study Stats</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Book size={14} className="mr-1" />
            <span>My Groups ({USER.groups})</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Achievements ({earnedAchievements.length}/{USER.achievements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Earned</h3>
            <div className="grid grid-cols-2 gap-2">
              {earnedAchievements.map(achievement => (
                <div key={achievement.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center mb-1">
                    <Award size={16} className="text-study-primary mr-2" />
                    <span className="font-medium text-sm">{achievement.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {unearnedAchievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Locked</h3>
              <div className="grid grid-cols-2 gap-2">
                {unearnedAchievements.map(achievement => (
                  <div key={achievement.id} className="border rounded-lg p-3 bg-gray-50 opacity-60">
                    <div className="flex items-center mb-1">
                      <Award size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-sm">{achievement.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
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
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-reminders" className="font-medium">Goal Reminders</Label>
                <p className="text-sm text-gray-500">Get daily reminders for your goals</p>
              </div>
              <Switch 
                id="goal-reminders" 
                checked={notifications.goalReminders}
                onCheckedChange={() => handleNotificationChange('goalReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="group-activity" className="font-medium">Group Activity</Label>
                <p className="text-sm text-gray-500">Updates from your study groups</p>
              </div>
              <Switch 
                id="group-activity" 
                checked={notifications.groupActivity}
                onCheckedChange={() => handleNotificationChange('groupActivity')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="achievements" className="font-medium">Achievements</Label>
                <p className="text-sm text-gray-500">Notifications when you earn achievements</p>
              </div>
              <Switch 
                id="achievements" 
                checked={notifications.achievements}
                onCheckedChange={() => handleNotificationChange('achievements')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-report" className="font-medium">Weekly Report</Label>
                <p className="text-sm text-gray-500">Weekly summary of your progress</p>
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
