import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

export interface StudyActivity {
  id: string;
  group_id: string;
  group_name?: string;
  user_id: string;
  user_name: string;
  subject_id: string | null;
  subject_name?: string;
  description: string;
  photo_path: string;
  photo_url?: string;
  points_earned: number;
  created_at: Date;
  likes_count: number;
  user_liked: boolean;
}

export const useStudyActivities = (groupId?: string) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      if (groupId) {
        fetchGroupActivities();
      } else {
        fetchGlobalActivities();
      }
    }
  }, [user, groupId]);

  const fetchGlobalActivities = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('study_activities')
        .select(`
          *,
          groups!inner(name),
          subjects(name),
          study_activity_likes(id, user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedActivities = await Promise.all(
        (data || []).map(async (activity) => {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', activity.user_id)
            .single();

          const { data: photoUrl } = supabase.storage
            .from('study-activities')
            .getPublicUrl(activity.photo_path);

          const userLiked = activity.study_activity_likes.some(
            (like: any) => like.user_id === user?.id
          );

          return {
            id: activity.id,
            group_id: activity.group_id,
            group_name: activity.groups.name,
            user_id: activity.user_id,
            user_name: profile?.name || 'Usuário',
            subject_id: activity.subject_id,
            subject_name: activity.subjects?.name || 'Matéria Geral',
            description: activity.description,
            photo_path: activity.photo_path,
            photo_url: photoUrl.publicUrl,
            points_earned: activity.points_earned,
            created_at: new Date(activity.created_at),
            likes_count: activity.study_activity_likes.length,
            user_liked: userLiked,
          };
        })
      );

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching global activities:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupActivities = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('study_activities')
        .select(`
          *,
          subjects(name),
          study_activity_likes(id, user_id)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedActivities = await Promise.all(
        (data || []).map(async (activity) => {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', activity.user_id)
            .single();

          const { data: photoUrl } = supabase.storage
            .from('study-activities')
            .getPublicUrl(activity.photo_path);

          const userLiked = activity.study_activity_likes.some(
            (like: any) => like.user_id === user?.id
          );

          return {
            id: activity.id,
            group_id: activity.group_id,
            user_id: activity.user_id,
            user_name: profile?.name || 'Usuário',
            subject_id: activity.subject_id,
            subject_name: activity.subjects?.name || 'Matéria Geral',
            description: activity.description,
            photo_path: activity.photo_path,
            photo_url: photoUrl.publicUrl,
            points_earned: activity.points_earned,
            created_at: new Date(activity.created_at),
            likes_count: activity.study_activity_likes.length,
            user_liked: userLiked,
          };
        })
      );

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching group activities:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const createActivity = async (
    targetGroupId: string,
    photo: File,
    description: string,
    subjectId?: string
  ) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      setUploading(true);

      // Compress image
      const compressedPhoto = await compressImage(photo);

      // Upload to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('study-activities')
        .upload(fileName, compressedPhoto);

      if (uploadError) throw uploadError;

      // Create activity record
      const { data, error } = await supabase
        .from('study_activities')
        .insert({
          group_id: targetGroupId,
          user_id: user.id,
          subject_id: subjectId || null,
          description,
          photo_path: fileName,
          points_earned: 10,
        })
        .select()
        .single();

      if (error) throw error;

      // Add points to user
      await supabase.rpc('add_user_points', {
        p_user_id: user.id,
        p_group_id: targetGroupId,
        p_points: 10,
      });

      toast.success('Atividade criada com sucesso! +10 pontos');

      // Refresh activities
      if (groupId) {
        await fetchGroupActivities();
      } else {
        await fetchGlobalActivities();
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Erro ao criar atividade');
      return { success: false, error: 'Erro ao criar atividade' };
    } finally {
      setUploading(false);
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;

      // Delete photo from storage
      await supabase.storage
        .from('study-activities')
        .remove([activity.photo_path]);

      // Delete activity record
      const { error } = await supabase
        .from('study_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      toast.success('Atividade excluída');
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Erro ao excluir atividade');
    }
  };

  const toggleLike = async (activityId: string) => {
    if (!user) return;

    try {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;

      if (activity.user_liked) {
        // Unlike
        const { error } = await supabase
          .from('study_activity_likes')
          .delete()
          .eq('activity_id', activityId)
          .eq('user_id', user.id);

        if (error) throw error;

        setActivities((prev) =>
          prev.map((a) =>
            a.id === activityId
              ? { ...a, likes_count: a.likes_count - 1, user_liked: false }
              : a
          )
        );
      } else {
        // Like
        const { error } = await supabase
          .from('study_activity_likes')
          .insert({ activity_id: activityId, user_id: user.id });

        if (error) throw error;

        setActivities((prev) =>
          prev.map((a) =>
            a.id === activityId
              ? { ...a, likes_count: a.likes_count + 1, user_liked: true }
              : a
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erro ao curtir atividade');
    }
  };

  return {
    activities,
    loading,
    uploading,
    createActivity,
    deleteActivity,
    toggleLike,
    refreshActivities: groupId ? fetchGroupActivities : fetchGlobalActivities,
  };
};
