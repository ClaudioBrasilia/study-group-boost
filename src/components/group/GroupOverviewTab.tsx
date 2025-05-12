
import React from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalType } from '@/types/groupTypes';

interface GroupOverviewTabProps {
  goals: GoalType[];
  isVestibularGroup: boolean;
  getSubjectNameById: (id: string) => string;
  onViewAllGoals: () => void;
}

const GroupOverviewTab: React.FC<GroupOverviewTabProps> = ({
  goals,
  isVestibularGroup,
  getSubjectNameById,
  onViewAllGoals
}) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold mb-2">Atividade Recente</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start space-x-3">
              <Clock size={18} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium">Usuário completou uma sessão de estudo</p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3 className="font-semibold mb-2">Metas do Grupo</h3>
        <div className="space-y-3">
          {goals.slice(0, 2).map((goal) => (
            <div key={goal.id} className="flex items-start space-x-3">
              <BookOpen size={18} className="text-gray-400 mt-1" />
              <div className="w-full">
                <p className="text-sm font-medium">
                  {getSubjectNameById(goal.subject)} - 
                  {goal.type === 'exercises' ? ' Exercícios' : 
                    goal.type === 'pages' ? ' Páginas' : ' Tempo (min)'}
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                  <div 
                    className="bg-study-primary h-2 rounded-full" 
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {goal.current} de {goal.target}
                </p>
              </div>
            </div>
          ))}
        </div>
        {!isVestibularGroup && (
          <Button className="mt-4 w-full" onClick={onViewAllGoals}>Ver Todas as Metas</Button>
        )}
      </div>
    </div>
  );
};

export default GroupOverviewTab;
