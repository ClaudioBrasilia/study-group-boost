
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data for groups
const MOCK_GROUPS = [
  { id: '1', name: 'Math Masters', members: 8, description: 'Algebra and calculus study group' },
  { id: '2', name: 'Physics Club', members: 5, description: 'For physics enthusiasts' },
  { id: '3', name: 'Literature Circle', members: 12, description: 'Classic literature discussions' },
  { id: '4', name: 'Chemistry Lab', members: 6, description: 'Chemistry theory and practice' },
];

const CreateGroupForm: React.FC<{ onCreateGroup: (name: string, description: string) => void }> = ({ onCreateGroup }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateGroup(name, description);
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Group Name</label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter group name" 
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe your study group"
        />
      </div>
      <Button type="submit" className="w-full">Create Group</Button>
    </form>
  );
};

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleCreateGroup = (name: string, description: string) => {
    const newGroup = {
      id: String(groups.length + 1),
      name,
      description,
      members: 1, // The creator
    };
    
    setGroups([...groups, newGroup]);
    setOpen(false);
    
    // Navigate to the newly created group
    navigate(`/group/${newGroup.id}`);
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="mb-4 flex items-center">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Search groups..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="ml-2 bg-study-primary" size="icon">
              <Plus size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Study Group</DialogTitle>
            </DialogHeader>
            <CreateGroupForm onCreateGroup={handleCreateGroup} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <div 
              key={group.id}
              className="card hover:border-study-primary cursor-pointer transition-colors"
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.description}</p>
              <div className="flex items-center mt-2">
                <Users size={16} className="mr-1 text-gray-400" />
                <span className="text-sm text-gray-500">{group.members} members</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No study groups found</p>
            <Button 
              className="mt-4 bg-study-primary"
              onClick={() => setOpen(true)}
            >
              Create Your First Group
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Groups;

// Add the missing import
import { Users } from "lucide-react";
