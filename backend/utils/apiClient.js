const { Groq } = require("groq-sdk");
const AbortController = require('abort-controller');

exports.callGroqApi = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set in environment variables');
    throw new Error('API key not configured');
  }

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    timeout: 30000 // 30 second timeout
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    console.log('Sending prompt to Groq API:', prompt);
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    console.log('Received response from Groq API');
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      console.error('Groq API request timed out');
      throw new Error('Request timed out. Please try again.');
    }
    console.error('Groq API error:', error);
    throw error;
  }
};
