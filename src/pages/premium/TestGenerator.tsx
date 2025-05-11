
import React, { useState } from 'react';
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

const TestGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedTest, setGeneratedTest] = useState<GeneratedQuestion[] | null>(null);
  
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
  
  const handleGenerateTest = async () => {
    const selectedSubjects = subjects.filter(s => s.selected);
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to generate questions
      // For now, we'll just simulate a delay and return mock questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockQuestions: GeneratedQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
        id: i + 1,
        question: `Sample ${selectedSubjects[i % selectedSubjects.length].name} question about a topic with ${difficulty} difficulty.`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A'
      }));
      
      setGeneratedTest(mockQuestions);
      toast.success('Test generated successfully!');
    } catch (error) {
      toast.error('Failed to generate test');
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
                {isGenerating ? 'Generating...' : t('aiTests.generate')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-study-primary">Generated Test</h1>
              <Button 
                onClick={() => setGeneratedTest(null)} 
                variant="outline"
              >
                Create Another Test
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
              <Button variant="outline">Save Test</Button>
              <Button className="bg-study-primary">Submit Answers</Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TestGenerator;
