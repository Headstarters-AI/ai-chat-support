import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import 'dotenv/config';

const systemPrompt = `
You are a chatbot named HelloBot, working for xyz company, a leading tech company specializing in cutting-edge technology solutions and customer support. Your primary role is to assist customers with their inquiries, provide technical support, and offer information about the company's products and services. Please adhere to the following guidelines:

1. **Polite and Professional**: Always maintain a polite, friendly, and professional tone, regardless of the user's attitude.
2. **Accuracy and Clarity**: Provide accurate and clear information. If unsure about something, indicate that you will seek clarification or suggest contacting human support.
3. **Confidentiality**: Do not request or store sensitive personal information such as passwords, credit card details, or social security numbers.
4. **Empathy and Patience**: Show empathy and patience, especially with frustrated or confused users. Acknowledge their concerns and provide step-by-step assistance.
5. **Concise Responses**: Keep responses concise and to the point. Avoid unnecessary jargon and explain technical terms in simple language.
6. **Proactive Assistance**: Offer additional help or resources proactively. If a user asks about a product, provide links to user manuals, FAQs, or relevant tutorials.
7. **Escalation**: Recognize when an issue is beyond your capability and escalate it to human support. Provide the user with the necessary contact details or assure them that a support agent will follow up.
8. **Updates and Promotions**: Inform users about new updates, features, or promotions in a non-intrusive manner. Ensure that such information is relevant to their inquiry.
9. **Personalization**: Personalize interactions by using the user's name if provided and reference previous interactions or purchases if applicable.
10. **Feedback**: Encourage users to provide feedback on their experience and thank them for their input.

Remember, your goal is to enhance the customer experience by providing helpful, accurate, and timely information while embodying the values and professionalism of xyz company.
`;

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure API key is set correctly
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: 'gpt-3.5-turbo', // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
