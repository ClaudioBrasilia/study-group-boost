
import React, { useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

// Mock data for leaderboards
const GLOBAL_USERS = [
  { id: '1', name: 'Alex Johnson', points: 1250, rank: 1 },
  { id: '2', name: 'Jamie Smith', points: 980, rank: 2 },
  { id: '3', name: 'Taylor Wilson', points: 870, rank: 3 },
  { id: '4', name: 'Jordan Brown', points: 820, rank: 4 },
  { id: '5', name: 'Casey Miller', points: 750, rank: 5 },
  { id: '6', name: 'Riley Garcia', points: 720, rank: 6 },
  { id: '7', name: 'Morgan Lopez', points: 680, rank: 7 },
  { id: '8', name: 'Drew Martinez', points: 650, rank: 8 },
  { id: '9', name: 'Avery Rodriguez', points: 620, rank: 9 },
  { id: '10', name: 'Quinn Hernandez', points: 590, rank: 10 },
];

const GROUPS = [
  { 
    id: '1', 
    name: 'Math Masters',
    members: [
      { id: '1', name: 'Você', points: 230, rank: 3 },
      { id: '2', name: 'Alex Smith', points: 340, rank: 1 },
      { id: '3', name: 'Jamie Brown', points: 280, rank: 2 },
      { id: '4', name: 'Taylor Wilson', points: 190, rank: 4 },
    ]
  },
  { 
    id: '2', 
    name: 'Physics Club',
    members: [
      { id: '1', name: 'Você', points: 180, rank: 2 },
      { id: '5', name: 'Robin Lee', points: 250, rank: 1 },
      { id: '6', name: 'Morgan Hill', points: 150, rank: 3 },
    ]
  },
  {
    id: '3',
    name: 'Literature Circle',
    members: [
      { id: '1', name: 'Você', points: 310, rank: 1 },
      { id: '7', name: 'Bailey Adams', points: 290, rank: 2 },
      { id: '8', name: 'Jordan Evans', points: 260, rank: 3 },
      { id: '9', name: 'Riley Foster', points: 220, rank: 4 },
      { id: '10', name: 'Casey Kelly', points: 200, rank: 5 },
    ]
  }
];

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('week');
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0].id);
  
  const currentGroup = GROUPS.find(group => group.id === selectedGroup);
  
  // Determine which user list to show based on selected type
  const userList = leaderboardType === 'global' 
    ? GLOBAL_USERS 
    : currentGroup?.members || [];
  
  return (
    <PageLayout>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">{t('leaderboard.title')}</h2>
        
        <div className="flex justify-between items-center mb-4">
          <Tabs value={leaderboardType} onValueChange={setLeaderboardType} className="w-auto">
            <TabsList className="grid grid-cols-2 h-9">
              <TabsTrigger value="global" className="flex items-center">
                <Trophy size={14} className="mr-1" />
                <span>{t('leaderboard.global')}</span>
              </TabsTrigger>
              <TabsTrigger value="group" className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{t('leaderboard.group')}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="week" className="text-xs px-2">{t('leaderboard.week')}</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">{t('leaderboard.month')}</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2">{t('leaderboard.allTime')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {leaderboardType === 'group' && (
          <div className="mb-4">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder={t('leaderboard.selectGroup')} />
              </SelectTrigger>
              <SelectContent>
                {GROUPS.map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {userList.map((user, index) => {
          const isCurrentUser = user.name === 'Você';
          const getRankColor = (rank: number) => {
            if (rank === 1) return 'bg-yellow-500';
            if (rank === 2) return 'bg-gray-400';
            if (rank === 3) return 'bg-amber-700';
            return 'bg-gray-200 text-gray-700';
          };
          
          return (
            <Card key={user.id} className={`${isCurrentUser ? 'border-study-primary border-2' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${getRankColor(user.rank)} flex items-center justify-center text-white font-bold mr-3`}>
                    {user.rank}
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-study-primary text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.name}
                        {isCurrentUser && <span className="text-xs ml-2 text-study-primary">({t('leaderboard.you')})</span>}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.points} {t('leaderboard.points')}
                      </div>
                    </div>
                  </div>
                </div>
                
                {user.rank <= 3 && (
                  <Trophy 
                    size={20} 
                    className={`
                      ${user.rank === 1 ? 'text-yellow-500' : ''}
                      ${user.rank === 2 ? 'text-gray-400' : ''}
                      ${user.rank === 3 ? 'text-amber-700' : ''}
                    `} 
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
