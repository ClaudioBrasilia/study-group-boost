
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface Subject {
  id: string;
  name: string;
  selected: boolean;
}

interface GeneratedQuestion {
  id: number;
  question: string;
  options?: string[];
  answer?: string;
}

// API Key storage in localStorage
const OPENAI_API_KEY_STORAGE = 'openai_api_key';

const TestGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedTest, setGeneratedTest] = useState<GeneratedQuestion[] | null>(null);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'portuguese', name: t('groups.subjects.portuguese'), selected: true },
    { id: 'math', name: t('groups.subjects.math'), selected: false },
    { id: 'history', name: t('groups.subjects.history'), selected: false },
    { id: 'geography', name: t('groups.subjects.geography'), selected: false },
    { id: 'physics', name: t('groups.subjects.physics'), selected: false },
    { id: 'chemistry', name: t('groups.subjects.chemistry'), selected: false },
    { id: 'biology', name: t('groups.subjects.biology'), selected: false },
    { id: 'literature', name: t('groups.subjects.literature'), selected: false },
    { id: 'english', name: t('groups.subjects.english'), selected: false },
    { id: 'essay', name: t('groups.subjects.essay'), selected: false },
  ]);

  // Check for saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(OPENAI_API_KEY_STORAGE);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const toggleSubject = (id: string) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, selected: !subject.selected } : subject
    ));
  };
  
  // Check if this is a premium feature and user doesn't have access
  if (user?.plan !== 'premium') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-study-primary mb-4">{t('aiTests.premiumFeature')}</h2>
          <p className="mb-8 text-gray-600">This feature is only available to premium subscribers.</p>
          <Button onClick={() => navigate('/plans')} className="bg-study-primary">
            {t('aiTests.upgrade')}
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim().length > 0) {
      localStorage.setItem(OPENAI_API_KEY_STORAGE, apiKey);
      setApiKeyDialogOpen(false);
      toast.success(t('aiTests.apiKeySaved'));
    }
  };
  
  const generateQuestionsWithAI = async () => {
    const selectedSubjectNames = subjects
      .filter(s => s.selected)
      .map(s => s.name)
      .join(", ");
      
    const prompt = `Crie ${numQuestions} questões de múltipla escolha sobre ${selectedSubjectNames}. 
      As questões devem ser de dificuldade ${difficulty} para estudantes de vestibular. 
      Cada questão deve ter 4 alternativas (A, B, C, D) e uma resposta correta. 
      Retorne apenas um array JSON com objetos no seguinte formato:
      [
        {
          "id": 1,
          "question": "Texto da questão aqui",
          "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
          "answer": "Opção correta aqui"
        }
      ]`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Você é um professor especialista em criar questões de múltipla escolha para vestibular. Crie questões detalhadas e informativas.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      // Extrair o array JSON da resposta
      let parsedQuestions;
      try {
        // Tenta extrair JSON de dentro de blocos de código, se existirem
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         content.match(/\[([\s\S]*)\]/);
                         
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        parsedQuestions = JSON.parse(jsonString);
      } catch (e) {
        console.error("Parsing error:", e, "Raw content:", content);
        throw new Error("Erro ao processar resposta da IA");
      }
      
      // Assegurar que o formato está correto
      const formattedQuestions = Array.isArray(parsedQuestions) ? parsedQuestions.map((q, index) => ({
        id: q.id || index + 1,
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
        answer: q.answer || ''
      })) : [];
      
      return formattedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  };
  
  const handleGenerateTest = async () => {
    const selectedSubjects = subjects.filter(s => s.selected);
    if (selectedSubjects.length === 0) {
      toast.error(t('aiTests.selectAtLeastOne'));
      return;
    }
    
    // Check if API key exists
    const savedApiKey = localStorage.getItem(OPENAI_API_KEY_STORAGE);
    if (!savedApiKey) {
      setApiKeyDialogOpen(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Usar a IA para gerar questões
      const questions = await generateQuestionsWithAI();
      setGeneratedTest(questions);
      toast.success(t('aiTests.generatingSuccess'));
    } catch (error) {
      console.error("Failed to generate test:", error);
      toast.error(t('aiTests.generatingFailed'));
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="py-8 px-4 max-w-3xl mx-auto">
        {!generatedTest ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-study-primary text-center">{t('aiTests.title')}</h1>
            
            <div className="space-y-4">
              <div>
                <Label>{t('aiTests.questionsNumber')}: {numQuestions}</Label>
                <Slider
                  value={[numQuestions]}
                  min={5}
                  max={50}
                  step={5}
                  onValueChange={(value) => setNumQuestions(value[0])}
                  className="my-4"
                />
              </div>
              
              <div>
                <Label className="mb-2 block">{t('aiTests.selectSubjects')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.id}
                        checked={subject.selected}
                        onCheckedChange={() => toggleSubject(subject.id)}
                      />
                      <Label htmlFor={subject.id}>{subject.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">{t('aiTests.difficulty')}</Label>
                <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">{t('aiTests.difficulties.easy')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">{t('aiTests.difficulties.medium')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">{t('aiTests.difficulties.hard')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button
                onClick={handleGenerateTest}
                className="w-full bg-study-primary"
                disabled={isGenerating || subjects.filter(s => s.selected).length === 0}
              >
                {isGenerating ? t('aiTests.generating') : t('aiTests.generate')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-study-primary">{t('aiTests.generatedTest')}</h1>
              <Button 
                onClick={() => setGeneratedTest(null)} 
                variant="outline"
              >
                {t('aiTests.createAnother')}
              </Button>
            </div>
            
            <div className="space-y-4">
              {generatedTest.map((question) => (
                <Card key={question.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">{question.id}. {question.question}</p>
                      </div>
                      
                      {question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input 
                                type="radio" 
                                id={`q${question.id}_opt${index}`}
                                name={`question_${question.id}`}
                                className="h-4 w-4 text-study-primary"
                              />
                              <Label htmlFor={`q${question.id}_opt${index}`}>{option}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">{t('aiTests.saveTest')}</Button>
              <Button className="bg-study-primary">{t('aiTests.submitAnswers')}</Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Dialog para API Key */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('aiTests.apiKeyTitle')}</DialogTitle>
            <DialogDescription>
              {t('aiTests.apiKeyDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('aiTests.apiKeyPlaceholder')}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveApiKey}>
              {t('aiTests.saveApiKey')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TestGenerator;
