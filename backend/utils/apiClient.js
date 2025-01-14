const { Groq } = require("groq-sdk");

exports.callGroqApi = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set in environment variables');
    throw new Error('API key not configured');
  }

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  try {
    console.log('Sending prompt to Groq API:', prompt);
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    
    console.log('Received response from Groq API');
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
};
