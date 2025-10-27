import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  group_id: string;
  inviter_id: string;
  invitee_email: string;
  invitee_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
  groups?: {
    name: string;
    description: string | null;
  };
}

export const useGroupInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('group_invitations')
        .select(`
          *,
          groups:group_id (
            name,
            description
          )
        `)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvitations((data as any) || []);
      setPendingCount(data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    fetchPendingInvitations();

    // Subscribe to changes in invitations
    const channel = supabase
      .channel('invitations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_invitations',
        },
        () => {
          fetchPendingInvitations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendInvitation = async (groupId: string, email: string) => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      // Check if user with this email exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('group_invitations')
        .insert({
          group_id: groupId,
          inviter_id: user.id,
          invitee_email: email.toLowerCase(),
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Este usuário já foi convidado para este grupo');
        } else {
          throw error;
        }
        return { error };
      }

      toast.success('Convite enviado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error('Erro ao enviar convite');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const getGroupInvitations = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_invitations')
        .select('*')
        .eq('group_id', groupId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error: any) {
      console.error('Error fetching group invitations:', error);
      return { data: [], error };
    }
  };

  const acceptInvitation = async (invitationId: string, groupId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      // Update invitation status
      const { error: updateError } = await supabase
        .from('group_invitations')
        .update({ status: 'accepted', invitee_id: user.id })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Add user to group_members
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          is_admin: false,
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.info('Você já é membro deste grupo');
        } else {
          throw memberError;
        }
      } else {
        toast.success('Você entrou no grupo!');
      }

      await fetchPendingInvitations();
      return { error: null };
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error('Erro ao aceitar convite');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const rejectInvitation = async (invitationId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('group_invitations')
        .update({ status: 'rejected', invitee_id: user.id })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success('Convite rejeitado');
      await fetchPendingInvitations();
      return { error: null };
    } catch (error: any) {
      console.error('Error rejecting invitation:', error);
      toast.error('Erro ao rejeitar convite');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    invitations,
    pendingCount,
    loading,
    sendInvitation,
    getGroupInvitations,
    acceptInvitation,
    rejectInvitation,
    refreshInvitations: fetchPendingInvitations,
  };
};
