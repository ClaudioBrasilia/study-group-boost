
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, StopCircle, RotateCcw, Clock, Trophy } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for subjects and groups
const mockSubjects = [
  { id: 'portuguese', name: 'Português' },
  { id: 'math', name: 'Matemática' },
  { id: 'history', name: 'História' },
  { id: 'geography', name: 'Geografia' },
  { id: 'physics', name: 'Física' },
  { id: 'chemistry', name: 'Química' },
  { id: 'biology', name: 'Biologia' },
];

const mockGroups = [
  { id: 'vestibular-brasil', name: 'Vestibular Brasil' },
  { id: '1', name: 'Grupo de Estudo 1' },
  { id: '2', name: 'Grupo de Estudo 2' },
];

interface StudySession {
  id: string;
  subject: string;
  group: string;
  duration: number;
  points: number;
  date: Date;
}

// Points per minute of study
const POINTS_PER_MINUTE = 1;

// Key for storing timer state in localStorage
const TIMER_STATE_KEY = 'studyBoostTimerState';

const Timer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  
  // Refs for interval management
  const intervalRef = useRef<number | null>(null);

  // Load saved sessions and timer state from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setStudySessions(parsedSessions);
    }
    
    // Load timer state if it exists
    const savedTimerState = localStorage.getItem(TIMER_STATE_KEY);
    if (savedTimerState) {
      const { seconds: savedSeconds, isRunning: wasRunning, selectedSubject: savedSubject, selectedGroup: savedGroup } = JSON.parse(savedTimerState);
      setSeconds(savedSeconds);
      setSelectedSubject(savedSubject);
      setSelectedGroup(savedGroup);
      
      // Resume timer if it was running
      if (wasRunning) {
        setIsRunning(true);
      }
    }
  }, []);
  
  // Save sessions to localStorage when they change
  useEffect(() => {
    if (studySessions.length > 0) {
      localStorage.setItem('studySessions', JSON.stringify(studySessions));
    }
  }, [studySessions]);
  
  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isRunning || seconds > 0) {
      localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
        seconds,
        isRunning,
        selectedSubject,
        selectedGroup
      }));
    } else if (seconds === 0) {
      localStorage.removeItem(TIMER_STATE_KEY);
    }
  }, [seconds, isRunning, selectedSubject, selectedGroup]);
  
  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);
  
  // Format time display (HH:MM:SS)
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate earned points based on study time
  const calculatePoints = (durationInSeconds: number) => {
    const minutes = durationInSeconds / 60;
    return Math.floor(minutes * POINTS_PER_MINUTE);
  };
  
  // Handler functions for timer controls
  const handleStart = () => {
    if (!selectedSubject || !selectedGroup) {
      toast.error('Por favor, selecione uma matéria e um grupo antes de iniciar');
      return;
    }
    setIsRunning(true);
    toast.success('Cronômetro iniciado');
  };
  
  const handlePause = () => {
    setIsRunning(false);
    toast.info('Cronômetro pausado');
  };
  
  const handleReset = () => {
    // Apenas permitir reiniciar se o cronômetro não estiver em execução
    if (!isRunning) {
      setSeconds(0);
      localStorage.removeItem(TIMER_STATE_KEY);
      toast.info('Cronômetro reiniciado');
    } else {
      toast.error('Pause o cronômetro antes de reiniciar');
    }
  };
  
  const handleStop = () => {
    if (seconds < 60) {
      toast.error('Estude por pelo menos 1 minuto para registrar a sessão');
      return;
    }
    
    setIsRunning(false);
    
    // Find subject and group names
    const subject = mockSubjects.find(s => s.id === selectedSubject)?.name || selectedSubject;
    const group = mockGroups.find(g => g.id === selectedGroup)?.name || selectedGroup;
    
    const points = calculatePoints(seconds);
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject,
      group,
      duration: seconds,
      points,
      date: new Date(),
    };
    
    setStudySessions([newSession, ...studySessions]);
    
    // Remover o estado do cronômetro do localStorage após finalizar a sessão
    localStorage.removeItem(TIMER_STATE_KEY);
    
    // In a real app, you would update the user's points in the backend
    toast.success(`Sessão de estudo concluída! Você ganhou ${points} pontos!`);
    
    // Reset timer
    setSeconds(0);
  };
  
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">{t('timer.title')}</h1>
      
      <div className="flex flex-col gap-6">
        {/* Timer controls and display */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between">
              <span>{t('timer.timeElapsed')}</span>
              <span>{calculatePoints(seconds)} {t('timer.points')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-4">{formatTime(seconds)}</div>
              <p className="text-sm text-gray-500">
                {POINTS_PER_MINUTE} {t('timer.pointsPerMinute')}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('timer.selectSubject')}</label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={isRunning}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('timer.selectSubject')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('timer.selectGroup')}</label>
                <Select
                  value={selectedGroup}
                  onValueChange={setSelectedGroup}
                  disabled={isRunning}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('timer.selectGroup')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-6">
              {!isRunning ? (
                <Button onClick={handleStart} className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
                  <Play size={18} />
                  {seconds === 0 ? t('timer.start') : t('timer.resume')}
                </Button>
              ) : (
                <Button onClick={handlePause} className="bg-amber-500 hover:bg-amber-600 flex items-center gap-2">
                  <Pause size={18} />
                  {t('timer.pause')}
                </Button>
              )}
              
              <Button onClick={handleStop} className="bg-red-500 hover:bg-red-600 flex items-center gap-2" disabled={seconds === 0}>
                <StopCircle size={18} />
                {t('timer.stop')}
              </Button>
              
              <Button variant="outline" onClick={handleReset} disabled={seconds === 0 || isRunning}>
                <RotateCcw size={18} />
                <span className="sr-only">{t('timer.reset')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Study Session History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('timer.history')}</CardTitle>
          </CardHeader>
          <CardContent>
            {studySessions.length > 0 ? (
              <ScrollArea className="h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('timer.subject')}</TableHead>
                      <TableHead>{t('timer.group')}</TableHead>
                      <TableHead>{t('timer.duration')}</TableHead>
                      <TableHead>{t('timer.points')}</TableHead>
                      <TableHead>{t('timer.date')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studySessions.map((session) => {
                      const hours = Math.floor(session.duration / 3600);
                      const minutes = Math.floor((session.duration % 3600) / 60);
                      
                      return (
                        <TableRow key={session.id}>
                          <TableCell>{session.subject}</TableCell>
                          <TableCell>{session.group}</TableCell>
                          <TableCell>
                            {hours > 0 && `${hours}h `}
                            {minutes}m
                          </TableCell>
                          <TableCell>{session.points}</TableCell>
                          <TableCell>
                            {session.date.toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>{t('timer.noSessions')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Timer;
