const { Groq } = require("groq-sdk");

exports.callGroqApi = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set in environment variables');
    throw new Error('API key not configured');
  }

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    timeout: 30000 // 30 second timeout
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
    // Extract all relevant error information
    const headers = error?.response?.headers || error?.headers || error?.error?.response?.headers || {};
    const status = error.status || error.error?.status || 500;
    const message = error.message || 'API request failed';
    const response = error.response || error.error?.response;
    
    // Create enriched error object
    const apiError = new Error(message);
    apiError.headers = headers;
    apiError.status = status;
    apiError.response = response;
    
    // Add rate limit information if available
    if (status === 429) {
      // Convert retry-after to minutes if available, otherwise use reset time
      const retrySeconds = headers['retry-after'] ? 
        parseInt(headers['retry-after']) : 
        (headers['x-ratelimit-reset-requests'] ? 
          parseTimeStringToSeconds(headers['x-ratelimit-reset-requests']) : 
          900);
      
      apiError.retryAfter = Math.ceil(retrySeconds / 60); // Convert to minutes
      apiError.rateLimit = {
        limit: headers['x-ratelimit-limit-requests'],
        remaining: headers['x-ratelimit-remaining-requests'],
        reset: headers['x-ratelimit-reset-requests']
      };
    }
    
    console.error('Groq API error:', apiError);
    throw apiError;
  }
};

// Helper function to convert time strings like "1h30m" to seconds
function parseTimeStringToSeconds(timeString) {
  if (!timeString) return 900;
  
  // Match hours, minutes, seconds
  const matches = timeString.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (!matches) return 900;
  
  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  const seconds = parseInt(matches[3] || 0);
  
  return (hours * 3600) + (minutes * 60) + seconds;
}
