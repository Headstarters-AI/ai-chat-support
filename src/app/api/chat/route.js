import { OpenAI } from 'openai';
import 'dotenv/config'; // Load environment variables from .env file

// Initialize OpenAI with the provided API key
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userMessage } = await req.json(); // Parse the incoming request body

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "The userMessage parameter is required." }), { status: 400 });
    }

    // Create a list of messages to send to OpenAI
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

    // Request a stream of data from the AI model
    const responseStream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
      stream: true,
    });

    // Initialize encoders/decoders for streaming data
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Create a streamable response using ReadableStream
    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of responseStream) {
            const text = decoder.decode(chunk); // Decode the chunk
            controller.enqueue(encoder.encode(text)); // Stream the data to the client
          }
          controller.close(); // Close the stream when done
        }
      }),
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }); // Handle errors gracefully
  }
}
