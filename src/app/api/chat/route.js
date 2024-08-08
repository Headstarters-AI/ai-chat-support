import { OpenAI } from 'openai';
import 'dotenv/config';

// Initialize the OpenAI client with the API key
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userMessage } = await req.json();

    // Validate the incoming request
    if (!userMessage) {
      return new Response(JSON.stringify({ error: "The userMessage parameter is required." }), { status: 400 });
    }

    // Structure the messages for OpenAI API
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

    // Make a call to OpenAI's chat completion endpoint
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
    });

    // Extract and return the assistant's response
    const assistantMessage = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({ message: assistantMessage }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
