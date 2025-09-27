import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  earned: boolean;
}

export interface ProfileStats {
  name: string;
  points: number;
  level: number;
  progress: number;
  pointsToNextLevel: number;
  groups: number;
  rank: number;
  achievements: Achievement[];
}

export function useProfileData() {
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    name: '',
    points: 0,
    level: 1,
    progress: 0,
    pointsToNextLevel: 100,
    groups: 0,
    rank: 0,
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      // Fetch total points across all groups
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', user.id);

      const totalPoints = pointsData?.reduce((sum, p) => sum + p.points, 0) || 0;

      // Calculate level and progress
      const level = Math.floor(totalPoints / 100) + 1;
      const pointsInLevel = totalPoints % 100;
      const pointsToNextLevel = 100 - pointsInLevel;

      // Fetch user's groups count
      const { data: groupsData } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const groupsCount = groupsData?.length || 0;

      // Calculate rank (simplified - based on total points)
      const { data: allUsersPoints } = await supabase
        .from('user_points')
        .select('user_id, points');

      const userTotals: { [key: string]: number } = {};
      allUsersPoints?.forEach(up => {
        userTotals[up.user_id] = (userTotals[up.user_id] || 0) + up.points;
      });

      const sortedUsers = Object.entries(userTotals)
        .sort(([, a], [, b]) => b - a);

      const userRank = sortedUsers.findIndex(([userId]) => userId === user.id) + 1;

      // Define achievements based on user stats
      const achievements: Achievement[] = [
        {
          id: '1',
          nameKey: 'studyWarrior',
          descriptionKey: 'studyWarrior',
          earned: totalPoints >= 100
        },
        {
          id: '2',
          nameKey: 'knowledgeSeeker',
          descriptionKey: 'knowledgeSeeker',
          earned: totalPoints >= 500
        },
        {
          id: '3',
          nameKey: 'groupLeader',
          descriptionKey: 'groupLeader',
          earned: groupsCount >= 1
        },
        {
          id: '4',
          nameKey: 'problemSolver',
          descriptionKey: 'problemSolver',
          earned: totalPoints >= 1000
        },
        {
          id: '5',
          nameKey: 'hydrationMaster',
          descriptionKey: 'hydrationMaster',
          earned: false // Will be implemented with water tracking
        },
        {
          id: '6',
          nameKey: 'dedicationStar',
          descriptionKey: 'dedicationStar',
          earned: level >= 10
        }
      ];

      setProfileStats({
        name: profile?.name || 'Usuário',
        points: totalPoints,
        level,
        progress: pointsInLevel,
        pointsToNextLevel,
        groups: groupsCount,
        rank: userRank || 999,
        achievements
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    profileStats,
    loading,
    refreshData: fetchProfileData
  };
}