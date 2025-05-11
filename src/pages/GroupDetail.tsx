
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, BarChart2, Check, Book, Calendar, Image, Edit } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Mock group data
const MOCK_GROUPS = {
  '1': {
    id: '1',
    name: 'Math Masters',
    description: 'Algebra and calculus study group',
    members: [
      { id: '1', name: 'You', points: 230, isAdmin: true },
      { id: '2', name: 'Alex Smith', points: 180 },
      { id: '3', name: 'Jamie Brown', points: 150 },
      { id: '4', name: 'Taylor Wilson', points: 120 },
    ],
    goals: [
      { id: '1', type: 'Pages', target: 100, current: 68, unit: 'pages' },
      { id: '2', type: 'Time', target: 600, current: 320, unit: 'minutes' },
      { id: '3', type: 'Exercises', target: 50, current: 20, unit: 'exercises' },
    ],
    activities: [
      { id: '1', userId: '2', type: 'Pages', amount: 15, timestamp: 'Today, 10:30 AM', subject: 'Calculus' },
      { id: '2', userId: '1', type: 'Time', amount: 45, timestamp: 'Today, 09:15 AM', subject: 'Linear Algebra' },
      { id: '3', userId: '3', type: 'Exercises', amount: 8, timestamp: 'Yesterday', subject: 'Statistics' },
      { id: '4', userId: '1', type: 'Pages', amount: 23, timestamp: 'Yesterday', subject: 'Geometry' },
    ]
  },
  '2': {
    id: '2',
    name: 'Physics Club',
    description: 'For physics enthusiasts',
    members: [
      { id: '1', name: 'You', points: 120, isAdmin: false },
      { id: '5', name: 'Robin Lee', points: 250, isAdmin: true },
      { id: '6', name: 'Morgan Hill', points: 200 },
    ],
    goals: [
      { id: '1', type: 'Pages', target: 200, current: 120, unit: 'pages' },
      { id: '2', type: 'Time', target: 800, current: 550, unit: 'minutes' },
    ],
    activities: [
      { id: '1', userId: '5', type: 'Time', amount: 60, timestamp: 'Today, 14:20 PM', subject: 'Quantum Mechanics' },
      { id: '2', userId: '1', type: 'Pages', amount: 18, timestamp: 'Yesterday', subject: 'Thermodynamics' },
    ]
  },
};

// Activity Form component
const ActivityForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [activityType, setActivityType] = useState('Pages');
  const [amount, setAmount] = useState('');
  const [subject, setSubject] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: activityType,
      amount: parseInt(amount),
      subject,
      timestamp: 'Just now'
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Activity Type</Label>
        <Select defaultValue={activityType} onValueChange={setActivityType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pages">Pages Read</SelectItem>
            <SelectItem value="Time">Study Time</SelectItem>
            <SelectItem value="Exercises">Exercises</SelectItem>
            <SelectItem value="Subject">Subject Studied</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">
          {activityType === 'Pages' && 'Number of Pages'}
          {activityType === 'Time' && 'Minutes Studied'}
          {activityType === 'Exercises' && 'Exercises Completed'}
          {activityType === 'Subject' && 'Time Spent (mins)'}
        </Label>
        <Input 
          id="amount" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Math, Physics, etc." 
          required
        />
      </div>
      
      <div className="pt-2 flex items-center">
        <Button type="button" variant="outline" className="mr-2">
          <Image size={18} className="mr-1" /> Add Photo
        </Button>
        <Button type="submit" className="flex-1 bg-study-primary">Log Activity</Button>
      </div>
    </form>
  );
};

// Goal Form component
const GoalForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [goalType, setGoalType] = useState('Pages');
  const [target, setTarget] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: goalType,
      target: parseInt(target),
      current: 0,
      unit: goalType === 'Pages' ? 'pages' : goalType === 'Time' ? 'minutes' : 'exercises',
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Goal Type</Label>
        <Select defaultValue={goalType} onValueChange={setGoalType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pages">Pages to Read</SelectItem>
            <SelectItem value="Time">Study Time</SelectItem>
            <SelectItem value="Exercises">Exercises to Complete</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target">Target Amount</Label>
        <Input 
          id="target" 
          type="number" 
          value={target} 
          onChange={(e) => setTarget(e.target.value)}
          min="1"
          placeholder={`Target ${goalType === 'Pages' ? 'pages' : goalType === 'Time' ? 'minutes' : 'exercises'}`}
          required 
        />
      </div>
      
      <Button type="submit" className="w-full bg-study-primary">Add Group Goal</Button>
    </form>
  );
};

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState(MOCK_GROUPS[groupId as keyof typeof MOCK_GROUPS]);
  const [activeTab, setActiveTab] = useState("goals");
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  
  const handleAddActivity = (activityData: any) => {
    const newActivity = {
      id: String(group.activities.length + 1),
      userId: '1', // Current user
      ...activityData,
    };
    
    // Update the related goal's progress if it exists
    let updatedGoals = [...group.goals];
    const goalIndex = updatedGoals.findIndex(goal => goal.type === activityData.type);
    
    if (goalIndex !== -1) {
      const updatedGoal = { ...updatedGoals[goalIndex] };
      updatedGoal.current = Math.min(updatedGoal.current + activityData.amount, updatedGoal.target);
      updatedGoals[goalIndex] = updatedGoal;
    }
    
    // Update the group state
    setGroup({
      ...group,
      activities: [newActivity, ...group.activities],
      goals: updatedGoals,
    });
    
    setActivityDialogOpen(false);
  };
  
  const handleAddGoal = (goalData: any) => {
    const newGoal = {
      id: String(group.goals.length + 1),
      ...goalData,
    };
    
    setGroup({
      ...group,
      goals: [...group.goals, newGoal],
    });
    
    setGoalDialogOpen(false);
  };
  
  // Get the current user (first member for simplicity)
  const currentUser = group.members.find(member => member.id === '1');
  
  return (
    <PageLayout>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <p className="text-sm text-gray-500">{group.description}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Group Goals</h3>
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Add Goal</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Group Goal</DialogTitle>
                </DialogHeader>
                <GoalForm onSubmit={handleAddGoal} />
              </DialogContent>
            </Dialog>
          </div>
          
          {group.goals.length > 0 ? (
            <div className="space-y-3">
              {group.goals.map(goal => (
                <div key={goal.id} className="card">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{goal.type}</span>
                    <span className="text-sm text-gray-500">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No goals set yet</p>
              <Button size="sm" onClick={() => setGoalDialogOpen(true)}>Add First Goal</Button>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-study-primary">
                  <Plus size={18} className="mr-1" />
                  Log Study Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Study Activity</DialogTitle>
                </DialogHeader>
                <ActivityForm onSubmit={handleAddActivity} />
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        
        <TabsContent value="activities">
          <div className="space-y-3">
            {group.activities.map(activity => (
              <div key={activity.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{activity.subject}</h4>
                    <div className="text-sm text-gray-500">
                      {activity.type === 'Pages' && `${activity.amount} pages read`}
                      {activity.type === 'Time' && `${activity.amount} minutes studied`}
                      {activity.type === 'Exercises' && `${activity.amount} exercises completed`}
                      {activity.type === 'Subject' && `${activity.amount} minutes on ${activity.subject}`}
                    </div>
                  </div>
                  {activity.type === 'Pages' && <Book size={18} className="text-study-secondary" />}
                  {activity.type === 'Time' && <Calendar size={18} className="text-study-secondary" />}
                  {activity.type === 'Exercises' && <Check size={18} className="text-study-secondary" />}
                  {activity.type === 'Subject' && <Book size={18} className="text-study-secondary" />}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {activity.timestamp} by {group.members.find(m => m.id === activity.userId)?.name}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-study-primary"
                onClick={() => setActivityDialogOpen(true)}
              >
                <Plus size={18} className="mr-1" />
                Log New Activity
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="space-y-3">
            {group.members.map((member, index) => (
              <div key={member.id} className="card flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-study-primary flex items-center justify-center text-white font-medium mr-3">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <div className="text-xs text-gray-500 flex items-center">
                      {member.isAdmin && <span className="bg-study-primary text-white px-1 rounded text-xs mr-1">Admin</span>}
                      <span>{member.points} points</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default GroupDetail;
