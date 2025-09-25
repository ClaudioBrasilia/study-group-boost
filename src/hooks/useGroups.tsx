import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isFixed?: boolean;
  isPremium?: boolean;
  type: string;
  creator_id: string;
  created_at: string;
  isMember?: boolean;
}

export const useGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      // Fetch all groups with member counts
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description,
          type,
          creator_id,
          created_at
        `)
        .order('created_at');

      if (groupsError) throw groupsError;

      // Fetch member counts for each group
      const groupsWithCounts = await Promise.all(
        (groupsData || []).map(async (group) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          // Check if current user is a member
          const { data: membership } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', group.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...group,
            members: count || 0,
            isFixed: group.id === 'vestibular-brasil',
            isPremium: group.id === 'vestibular-brasil',
            isMember: !!membership
          };
        })
      );

      // Add the fixed Vestibular Brasil group if it doesn't exist
      const hasVestibularGroup = groupsWithCounts.find(g => g.id === 'vestibular-brasil');
      if (!hasVestibularGroup) {
        groupsWithCounts.unshift({
          id: 'vestibular-brasil',
          name: 'Vestibular Brasil',
          description: 'Grupo oficial para estudantes se preparando para vestibulares brasileiros',
          members: 120,
          isFixed: true,
          isPremium: true,
          type: 'vestibular',
          creator_id: 'system',
          created_at: new Date().toISOString(),
          isMember: false
        });
      }

      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string, description: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    // Check if free user is trying to create a group
    if (user.plan === 'free') {
      return { success: false, error: 'Criar grupos requer uma assinatura paga' };
    }

    try {
      // Check for duplicate group name
      const { data: existingGroup } = await supabase
        .from('groups')
        .select('id')
        .eq('name', name)
        .single();

      if (existingGroup) {
        return { success: false, error: 'Já existe um grupo com este nome' };
      }

      // Create the group
      const { data: newGroup, error: createError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          creator_id: user.id,
          type: 'custom'
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          is_admin: true
        });

      if (memberError) throw memberError;

      // Refresh groups list
      await fetchGroups();

      return { success: true, groupId: newGroup.id };
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, error: 'Erro ao criar grupo. Tente novamente.' };
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (existingMembership) {
        return { success: false, error: 'Você já é membro deste grupo' };
      }

      // Add user as member
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          is_admin: false
        });

      if (error) throw error;

      // Refresh groups list
      await fetchGroups();

      return { success: true };
    } catch (error) {
      console.error('Error joining group:', error);
      return { success: false, error: 'Erro ao entrar no grupo. Tente novamente.' };
    }
  };

  return {
    groups,
    loading,
    createGroup,
    joinGroup,
    refreshGroups: fetchGroups
  };
};