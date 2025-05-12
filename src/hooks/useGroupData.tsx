
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Subject, GoalType, FileType, Message } from '@/types/groupTypes';
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
  { id: '1', subject: 'math', type: 'exercises' as const, target: 50, current: 25 },
  { id: '2', subject: 'portuguese', type: 'pages' as const, target: 100, current: 75 },
];

export const useGroupData = (groupId: string | undefined) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
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
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', userId: '2', userName: 'Bruno Santos', text: 'Olá pessoal, como estão os estudos?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', userId: '3', userName: 'Carlos Oliveira', text: 'Estou revisando física para a prova de amanhã.', timestamp: new Date(Date.now() - 1800000) },
    { id: '3', userId: '4', userName: 'Diana Pereira', text: 'Alguém tem material de revisão de matemática?', timestamp: new Date(Date.now() - 900000) },
  ]);
  const [messageText, setMessageText] = useState('');

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
  }, [groupId, i18n.language, t, user, subjects]);

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

  const handleDownloadFile = (fileId: string) => {
    toast.success('Download iniciado');
  };

  const getSubjectNameById = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : id;
  };

  return {
    subjects,
    setSubjects,
    newSubject,
    setNewSubject,
    isVestibularGroup,
    files,
    goals,
    newGoalSubject,
    setNewGoalSubject,
    newGoalType,
    setNewGoalType,
    newGoalTarget,
    setNewGoalTarget,
    uploadDialogOpen,
    setUploadDialogOpen,
    newFile,
    currentUserIsAdmin,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    subjectToDelete,
    addVestibularDialogOpen,
    setAddVestibularDialogOpen,
    messages,
    messageText,
    setMessageText,
    MOCK_MEMBERS,
    handleAddSubject,
    handleDeleteSubject,
    confirmDeleteSubject,
    handleAddVestibularModule,
    handleAddGoal,
    handleFileUpload,
    handleFileChange,
    handleSendMessage,
    handleDownloadFile,
    getSubjectNameById
  };
};
