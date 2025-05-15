import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Users, Crown, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  isFixed?: boolean;
  isPremium?: boolean;
}

// Schema validation for group creation
const createGroupSchema = z.object({
  name: z.string()
    .min(3, 'Nome do grupo deve ter pelo menos 3 caracteres')
    .max(50, 'Nome do grupo não pode ter mais de 50 caracteres'),
  description: z.string()
    .max(200, 'Descrição não pode ter mais de 200 caracteres')
    .optional()
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const onSubmit = (data: CreateGroupFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Check for duplicate group name
      const isDuplicate = MOCK_GROUPS.some(
        group => group.name.toLowerCase() === data.name.toLowerCase()
      );
      
      if (isDuplicate) {
        setErrorMessage('Já existe um grupo com este nome');
        setIsSubmitting(false);
        return;
      }
      
      onCreateGroup(data.name, data.description || '');
    } catch (error) {
      setErrorMessage('Erro ao criar grupo. Tente novamente.');
      console.error('Error creating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Grupo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o nome do grupo" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Descreva seu grupo de estudo" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-study-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Grupo'}
          </Button>
        </form>
      </Form>
    </div>
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
    toast.success('Grupo criado com sucesso!');
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
