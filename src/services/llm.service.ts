import axios from 'axios';

export type FraudFactors = {
  amount: number;
  currency: string;
  source: string;
  email: string;
  score: number;
};

export async function getFraudExplanation(factors: FraudFactors): Promise<string> {
  // Try Gemini first
  const geminiPrompt = `A payment request was scored for fraud risk.\n\nDetails:\n- Amount: ${factors.amount}\n- Currency: ${factors.currency}\n- Source: ${factors.source}\n- Email: ${factors.email}\n- Fraud Score: ${factors.score}\n\nExplain in plain English why this score was given in a single line.`;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          contents: [
            { parts: [{ text: geminiPrompt }] }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': geminiKey
          }
        }
      );
      const explanation = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (explanation) return explanation.trim() + ' (via Gemini)';
    } catch (error) {
      console.error('Gemini API error, will try OpenAI fallback:', error);
    }
  }

  // Fallback to OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const openaiPrompt = `A payment request was scored for fraud risk.\n\nDetails:\n- Amount: ${factors.amount}\n- Currency: ${factors.currency}\n- Source: ${factors.source}\n- Email: ${factors.email}\n- Fraud Score: ${factors.score}\n\nExplain in plain English why this score was given in a single line.`;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that explains fraud risk scores for payment transactions.' },
            { role: 'user', content: openaiPrompt }
          ],
          max_tokens: 120
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const explanation = response.data.choices?.[0]?.message?.content;
      if (explanation) return explanation.trim() + ' (via OpenAI)';
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  }

  return 'Could not generate explanation due to an error with the LLM APIs.';
} 