
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types/groupTypes';
import { useTranslation } from 'react-i18next';

interface GroupMembersTabProps {
  members: Member[];
}

const GroupMembersTab: React.FC<GroupMembersTabProps> = ({ members }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Membros do Grupo ({members.length})</h3>
        <Button size="sm" className="bg-study-primary">Convidar Membro</Button>
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
              <Badge>Admin</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembersTab;
