
import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Subject, GoalType } from '@/types/groupTypes';
import { useTranslation } from 'react-i18next';

interface GroupGoalsTabProps {
  goals: GoalType[];
  subjects: Subject[];
  isVestibularGroup: boolean;
  newGoalSubject: string;
  setNewGoalSubject: (value: string) => void;
  newGoalType: 'exercises' | 'pages' | 'time';
  setNewGoalType: (value: 'exercises' | 'pages' | 'time') => void;
  newGoalTarget: string;
  setNewGoalTarget: (value: string) => void;
  handleAddGoal: (e: React.FormEvent) => void;
  getSubjectNameById: (id: string) => string;
}

const GroupGoalsTab: React.FC<GroupGoalsTabProps> = ({
  goals,
  subjects,
  isVestibularGroup,
  newGoalSubject,
  setNewGoalSubject,
  newGoalType,
  setNewGoalType,
  newGoalTarget,
  setNewGoalTarget,
  handleAddGoal,
  getSubjectNameById
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{t('goals.title')}</h3>
        
        {!isVestibularGroup && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-study-primary">
                <Plus size={16} className="mr-1" />
                {t('goals.addGoal')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('goals.createGoal')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <Label htmlFor="goalSubject">{t('goals.subject')}</Label>
                  <Select value={newGoalSubject} onValueChange={setNewGoalSubject} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('goals.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goalType">{t('goals.type')}</Label>
                  <Select 
                    value={newGoalType} 
                    onValueChange={(value) => setNewGoalType(value as 'exercises' | 'pages' | 'time')}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('goals.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exercises">{t('goals.types.exercises')}</SelectItem>
                      <SelectItem value="pages">{t('goals.types.pages')}</SelectItem>
                      <SelectItem value="time">{t('goals.types.time')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goalTarget">{t('goals.target')}</Label>
                  <Input
                    id="goalTarget"
                    type="number"
                    min="1"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder={t('goals.enterTarget')}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-study-primary">
                  {t('goals.createGoal')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="card p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{getSubjectNameById(goal.subject)}</h4>
                    <p className="text-sm text-gray-500">
                      {goal.type === 'exercises' ? t('goals.types.exercises') : 
                       goal.type === 'pages' ? t('goals.types.pages') : 
                       t('goals.types.time')}
                    </p>
                  </div>
                  
                  <p className="font-semibold">
                    {goal.current} / {goal.target}
                  </p>
                </div>
                
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div 
                    className="bg-study-primary h-2 rounded-full" 
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button size="sm" variant="outline">
                    {t('goals.updateProgress')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="mx-auto h-12 w-12 opacity-50 mb-2" />
          <p>{t('goals.noGoals')}</p>
        </div>
      )}
    </div>
  );
};

export default GroupGoalsTab;
