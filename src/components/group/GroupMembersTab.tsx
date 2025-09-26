
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types/groupTypes';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/sonner';

interface GroupMembersTabProps {
  members: Member[];
}

const GroupMembersTab: React.FC<GroupMembersTabProps> = ({ members }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{t('group.members')} ({members.length})</h3>
        <Button size="sm" className="bg-study-primary" onClick={() => {
          // TODO: Implement invite functionality
          toast.info('Funcionalidade de convite em desenvolvimento');
        }}>
          {t('group.inviteMember')}
        </Button>
      </div>
      
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="card p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </div>
            
            {member.isAdmin && (
              <Badge>{t('group.admin')}</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembersTab;
