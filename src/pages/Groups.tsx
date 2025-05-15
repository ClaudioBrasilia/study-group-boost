
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Users, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';

interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  isFixed?: boolean;
  isPremium?: boolean;
}

// Mock data for groups
const MOCK_GROUPS: Group[] = [
  { 
    id: 'vestibular-brasil', 
    name: 'Vestibular Brasil', 
    members: 120, 
    description: 'Grupo oficial para estudantes se preparando para vestibulares brasileiros', 
    isFixed: true,
    isPremium: true  // Marcando o grupo como premium
  },
  { id: '1', name: 'Math Masters', members: 8, description: 'Algebra and calculus study group' },
  { id: '2', name: 'Physics Club', members: 5, description: 'For physics enthusiasts' },
  { id: '3', name: 'Literature Circle', members: 12, description: 'Classic literature discussions' },
  { id: '4', name: 'Chemistry Lab', members: 6, description: 'Chemistry theory and practice' },
];

const CreateGroupForm: React.FC<{ onCreateGroup: (name: string, description: string) => void }> = ({ onCreateGroup }) => {
  const { t } = useTranslation();
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
        <label htmlFor="name" className="text-sm font-medium">Nome do Grupo</label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Digite o nome do grupo" 
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">Descrição (opcional)</label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Descreva seu grupo de estudo"
        />
      </div>
      <Button type="submit" className="w-full">Criar Grupo</Button>
    </form>
  );
};

const Groups: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  // Update group names based on language
  useEffect(() => {
    if (i18n.language) {
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.isFixed) {
            return {
              ...group,
              name: t('groups.fixedGroups.vestibularBrasil')
            };
          }
          return group;
        })
      );
    }
  }, [i18n.language, t]);

  const handleCreateGroup = (name: string, description: string) => {
    // Free users can only join groups, not create them
    if (user && user.plan === 'free') {
      toast.error('Criar grupos requer uma assinatura paga');
      setOpen(false);
      navigate('/plans');
      return;
    }
    
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

  const handleGroupClick = (group: Group) => {
    // Verificar se o grupo é premium e se o usuário tem acesso
    if (group.isPremium && user?.plan !== 'premium') {
      toast.error('Este é um grupo exclusivo para usuários Premium');
      navigate('/plans'); // Redireciona para a página de planos
      return;
    }
    
    navigate(`/group/${group.id}`);
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
            placeholder={t('groups.search')}
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
              <DialogTitle>{t('groups.create')}</DialogTitle>
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
              className={`card hover:border-study-primary cursor-pointer transition-colors ${group.isFixed ? 'border-l-4 border-l-study-primary' : ''}`}
              onClick={() => handleGroupClick(group)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg flex items-center">
                  {group.name}
                  {group.isPremium && (
                    <Crown className="ml-2 h-4 w-4 text-yellow-500" aria-label="Grupo Premium" />
                  )}
                </h3>
                <div className="flex gap-1">
                  {group.isFixed && (
                    <Badge className="bg-study-primary">Grupo Fixo</Badge>
                  )}
                  {group.isPremium && (
                    <Badge className="bg-yellow-500">Premium</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">{group.description}</p>
              <div className="flex items-center mt-2">
                <Users size={16} className="mr-1 text-gray-400" />
                <span className="text-sm text-gray-500">{group.members} {t('groups.members')}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('groups.noGroups')}</p>
            <Button 
              className="mt-4 bg-study-primary"
              onClick={() => setOpen(true)}
            >
              {t('groups.createFirst')}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Groups;
