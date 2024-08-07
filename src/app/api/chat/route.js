import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userMessage } = await req.json();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "The userMessage parameter is required." }), { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
    });

    const assistantMessage = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({ message: assistantMessage }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
