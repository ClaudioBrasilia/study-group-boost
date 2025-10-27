import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { numQuestions, difficulty, subjects } = await req.json();
    
    if (!subjects || subjects.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Selecione pelo menos uma matéria' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const subjectNames = subjects.join(", ");
    const prompt = `Crie ${numQuestions} questões de múltipla escolha sobre ${subjectNames}. 
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

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um professor especialista em criar questões de múltipla escolha para vestibular. Crie questões detalhadas e informativas. Retorne APENAS o array JSON, sem texto adicional.'
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
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }), 
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Extract JSON from response
    let parsedQuestions;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                       content.match(/\[([\s\S]*)\]/);
                       
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      parsedQuestions = JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parsing error:', e, 'Raw content:', content);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar resposta da IA' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Format questions
    const formattedQuestions = Array.isArray(parsedQuestions) 
      ? parsedQuestions.map((q, index) => ({
          id: q.id || index + 1,
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
          answer: q.answer || ''
        })) 
      : [];

    console.log(`Successfully generated ${formattedQuestions.length} questions`);
    
    return new Response(
      JSON.stringify({ questions: formattedQuestions }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-test-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
