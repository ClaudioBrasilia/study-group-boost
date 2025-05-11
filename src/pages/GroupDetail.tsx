
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Plus, Clock, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

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

const MOCK_MEMBERS = [
  { id: '1', name: 'Alice Silva' },
  { id: '2', name: 'Bruno Santos' },
  { id: '3', name: 'Carlos Oliveira' },
  { id: '4', name: 'Diana Pereira' },
];

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
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

  useEffect(() => {
    // Check if this is the fixed Vestibular Brasil group
    if (groupId === 'vestibular-brasil') {
      setIsVestibularGroup(true);
    }
    
    // Update subjects based on language
    if (i18n.language) {
      setSubjects(MOCK_SUBJECTS.map(subj => ({
        ...subj,
        name: i18n.language === 'en' 
          ? t(`groups.subjects.${subj.id}`)
          : subj.name
      })));
    }
  }, [groupId, i18n.language, t]);

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
    
    if (!newSubject.trim()) return;
    
    const newSubjectObj = {
      id: newSubject.toLowerCase().replace(/\s+/g, '-'),
      name: newSubject
    };
    
    setSubjects([...subjects, newSubjectObj]);
    setNewSubject('');
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-study-primary">
          {isVestibularGroup ? t('groups.fixedGroups.vestibularBrasil') : `Group ${groupId}`}
        </h1>
        
        {isVestibularGroup && (
          <p className="text-gray-500 mt-1">
            Grupo dedicado à preparação para vestibulares brasileiros
          </p>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="subjects" className="flex-1">Subjects</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <Clock size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">User completed a study session</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-2">Group Goals</h3>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <BookOpen size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Read 20 pages daily</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div className="bg-study-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full">Add New Goal</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Available Subjects</h3>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-study-primary">
                    <Plus size={16} className="mr-1" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSubject} className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject Name</Label>
                      <Input
                        id="subject"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Enter subject name"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-study-primary">Add Subject</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="card p-3 cursor-pointer hover:border-study-primary transition-colors">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`subject-${subject.id}`} />
                    <Label htmlFor={`subject-${subject.id}`} className="cursor-pointer">
                      {subject.name}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Group Members ({MOCK_MEMBERS.length})</h3>
              <Button size="sm" className="bg-study-primary">Invite Member</Button>
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
                  
                  {member.id === '1' && (
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
      </Tabs>
    </PageLayout>
  );
};

export default GroupDetail;
