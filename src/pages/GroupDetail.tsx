
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Plus, Clock, BookOpen, X, Trash, File, Upload, Download } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

// Mock data
const MOCK_SUBJECTS = [
  { id: 'portuguese', name: 'Português' },
  { id: 'math', name: 'Matemática' },
  { id: 'history', name: 'História' },
  { id: 'geography', name: 'Geografia' },
  { id: 'physics', name: 'Física' },
  { id: 'chemistry', name: 'Química' },
  { id: 'biology', name: 'Biologia' },
  { id: 'literature', name: 'Literatura' },
  { id: 'english', name: 'Inglês' },
  { id: 'essay', name: 'Redação' },
];

const VESTIBULAR_SUBJECTS = [...MOCK_SUBJECTS];

const MOCK_MEMBERS = [
  { id: '1', name: 'Alice Silva', isAdmin: true },
  { id: '2', name: 'Bruno Santos', isAdmin: false },
  { id: '3', name: 'Carlos Oliveira', isAdmin: false },
  { id: '4', name: 'Diana Pereira', isAdmin: false },
];

// Mock files
const MOCK_FILES = [
  { id: '1', name: 'Material de Matemática.pdf', size: '2.5 MB', uploadedBy: 'Alice Silva', uploadedAt: new Date(Date.now() - 86400000) },
  { id: '2', name: 'Resumo História.docx', size: '1.1 MB', uploadedBy: 'Bruno Santos', uploadedAt: new Date(Date.now() - 172800000) },
];

// Mock goals
const MOCK_GOALS = [
  { id: '1', subject: 'math', type: 'exercises', target: 50, current: 25 },
  { id: '2', subject: 'portuguese', type: 'pages', target: 100, current: 75 },
];

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

interface GoalType {
  id: string;
  subject: string;
  type: 'exercises' | 'pages' | 'time';
  target: number;
  current: number;
}

interface FileType {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: Date;
}

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', userId: '2', userName: 'Bruno Santos', text: 'Olá pessoal, como estão os estudos?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', userId: '3', userName: 'Carlos Oliveira', text: 'Estou revisando física para a prova de amanhã.', timestamp: new Date(Date.now() - 1800000) },
    { id: '3', userId: '4', userName: 'Diana Pereira', text: 'Alguém tem material de revisão de matemática?', timestamp: new Date(Date.now() - 900000) },
  ]);
  
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [newSubject, setNewSubject] = useState('');
  const [isVestibularGroup, setIsVestibularGroup] = useState(false);
  const [files, setFiles] = useState<FileType[]>(MOCK_FILES);
  const [goals, setGoals] = useState<GoalType[]>(MOCK_GOALS);
  const [newGoalSubject, setNewGoalSubject] = useState('');
  const [newGoalType, setNewGoalType] = useState<'exercises' | 'pages' | 'time'>('exercises');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [addVestibularDialogOpen, setAddVestibularDialogOpen] = useState(false);

  useEffect(() => {
    // Check if this is the fixed Vestibular Brasil group
    if (groupId === 'vestibular-brasil') {
      setIsVestibularGroup(true);
    }
    
    // Update subjects based on language
    if (i18n.language) {
      setSubjects(subjects.map(subj => ({
        ...subj,
        name: i18n.language === 'en' 
          ? t(`groups.subjects.${subj.id}`)
          : t(`groups.subjects.${subj.id}`)
      })));
    }

    // Check if current user is an admin
    if (user) {
      const isAdmin = MOCK_MEMBERS.some(member => member.id === user.id && member.isAdmin);
      setCurrentUserIsAdmin(isAdmin);
    }
  }, [groupId, i18n.language, t, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubject.trim() || isVestibularGroup) return;
    
    const newSubjectObj = {
      id: newSubject.toLowerCase().replace(/\s+/g, '-'),
      name: newSubject
    };
    
    setSubjects([...subjects, newSubjectObj]);
    setNewSubject('');
    
    toast.success('Matéria adicionada com sucesso');
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (isVestibularGroup) return;
    
    setSubjectToDelete(subjectId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteSubject = () => {
    if (!subjectToDelete) return;
    
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectToDelete);
    setSubjects(updatedSubjects);
    setDeleteConfirmOpen(false);
    setSubjectToDelete(null);
    
    toast.success('Matéria excluída com sucesso');
  };

  const handleAddVestibularModule = () => {
    if (isVestibularGroup) return;
    
    const existingIds = subjects.map(s => s.id);
    const newVestibularSubjects = VESTIBULAR_SUBJECTS.filter(s => !existingIds.includes(s.id));
    
    setSubjects([...subjects, ...newVestibularSubjects]);
    setAddVestibularDialogOpen(false);
    
    toast.success('Módulo Vestibular adicionado com sucesso');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoalSubject || !newGoalType || !newGoalTarget) return;
    
    const newGoal: GoalType = {
      id: Date.now().toString(),
      subject: newGoalSubject,
      type: newGoalType,
      target: parseInt(newGoalTarget),
      current: 0
    };
    
    setGoals([...goals, newGoal]);
    setNewGoalSubject('');
    setNewGoalType('exercises');
    setNewGoalTarget('');
    
    toast.success('Meta adicionada com sucesso');
  };

  const handleFileUpload = () => {
    if (!newFile) return;
    
    const fileObj: FileType = {
      id: Date.now().toString(),
      name: newFile.name,
      size: `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: user?.name || 'Usuário',
      uploadedAt: new Date()
    };
    
    setFiles([fileObj, ...files]);
    setNewFile(null);
    setUploadDialogOpen(false);
    
    toast.success('Arquivo enviado com sucesso');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleDownloadFile = (fileId: string) => {
    toast.success('Download iniciado');
  };

  const getSubjectNameById = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : id;
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-study-primary">
          {isVestibularGroup ? t('groups.fixedGroups.vestibularBrasil') : `Grupo ${groupId}`}
        </h1>
        
        {isVestibularGroup && (
          <p className="text-gray-500 mt-1">
            Grupo dedicado à preparação para vestibulares brasileiros
          </p>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overview" className="flex-1">Visão Geral</TabsTrigger>
          <TabsTrigger value="subjects" className="flex-1">Matérias</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Membros</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Mensagens</TabsTrigger>
          <TabsTrigger value="files" className="flex-1">Arquivos</TabsTrigger>
          <TabsTrigger value="goals" className="flex-1">Metas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
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
                <Button className="mt-4 w-full" onClick={() => setActiveTab('goals')}>Ver Todas as Metas</Button>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Matérias Disponíveis</h3>
              
              {!isVestibularGroup && currentUserIsAdmin && (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-study-primary">
                        <Plus size={16} className="mr-1" />
                        {t('groups.addSubjects')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Matéria</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddSubject} className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Nome da Matéria</Label>
                          <Input
                            id="subject"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Digite o nome da matéria"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-study-primary">Adicionar Matéria</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={addVestibularDialogOpen} onOpenChange={setAddVestibularDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus size={16} className="mr-1" />
                        {t('groups.addVestibular')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Módulo Vestibular</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-500 mb-4">
                        Isso adicionará todas as matérias padrão do vestibular ao seu grupo.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setAddVestibularDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddVestibularModule} className="bg-study-primary">
                          Confirmar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="card p-3 cursor-pointer hover:border-study-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`subject-${subject.id}`} />
                      <Label htmlFor={`subject-${subject.id}`} className="cursor-pointer">
                        {subject.name}
                      </Label>
                    </div>
                    
                    {!isVestibularGroup && currentUserIsAdmin && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleDeleteSubject(subject.id)}
                        title={t('groups.deleteSubject')}
                      >
                        <Trash size={14} className="text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Confirmação de exclusão de matéria */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Matéria</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Tem certeza que deseja excluir esta matéria? Esta ação não pode ser desfeita.
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={confirmDeleteSubject}>Excluir</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Membros do Grupo ({MOCK_MEMBERS.length})</h3>
              <Button size="sm" className="bg-study-primary">Convidar Membro</Button>
            </div>
            
            <div className="space-y-3">
              {MOCK_MEMBERS.map((member) => (
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
        </TabsContent>
        
        <TabsContent value="messages">
          <div className="flex flex-col h-[calc(100vh-280px)]">
            <h3 className="font-semibold mb-4">{t('groupMessages.messageHistory')}</h3>
            
            <ScrollArea className="flex-1 mb-4 border rounded-md p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.userId === (user?.id || '') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[80%] rounded-lg px-4 py-2
                        ${message.userId === (user?.id || '') 
                          ? 'bg-study-primary text-white' 
                          : 'bg-gray-100 text-gray-800'}
                      `}
                    >
                      {message.userId !== (user?.id || '') && (
                        <p className="text-xs font-semibold mb-1">{message.userName}</p>
                      )}
                      <p>{message.text}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder={t('groupMessages.placeholder')}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-study-primary">
                <Send size={18} />
                <span className="ml-2 hidden sm:inline">{t('groupMessages.send')}</span>
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{t('files.title')}</h3>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-study-primary">
                    <Upload size={16} className="mr-1" />
                    {t('files.upload')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('files.upload')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="file">{t('files.fileName')}</Label>
                      <Input id="file" type="file" onChange={handleFileChange} />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleFileUpload} 
                        disabled={!newFile}
                        className="bg-study-primary"
                      >
                        {t('files.upload')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <File size={24} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.size} • {t('files.uploadedBy')}: {file.uploadedBy} • 
                            {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(file.id)}
                        className="flex items-center gap-1"
                      >
                        <Download size={14} />
                        {t('files.download')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <File className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>{t('files.noFiles')}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals">
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
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default GroupDetail;
