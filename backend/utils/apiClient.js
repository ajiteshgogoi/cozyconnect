const fetch = require('node-fetch');

// Provider configurations
const providers = {
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    getHeaders: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    envKeyName: 'GROQ_API_KEY',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultTemperature: 0.7,
    handleError: (error) => {
      const headers = error?.response?.headers || {};
      const status = error.status || 500;
      const message = error.message || 'API request failed';
      
      const apiError = new Error(message);
      apiError.status = status;
      
      if (status === 429) {
        apiError.rateLimit = {
          limit: headers['x-ratelimit-limit-requests'],
          remaining: headers['x-ratelimit-remaining-requests'],
          reset: headers['x-ratelimit-reset-requests']
        };
      }
      return apiError;
    }
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    getHeaders: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'https://cozyconnect.vercel.app',
      'X-Title': 'CozyConnect'
    }),
    envKeyName: 'OPENROUTER_API_KEY',
    defaultModel: 'google/gemini-2.0-flash-001',
    defaultTemperature: 0.7,
    handleError: (error) => {
      const headers = error?.response?.headers || {};
      const status = error.status || 500;
      const message = error.message || 'API request failed';
      
      const apiError = new Error(message);
      apiError.status = status;
      
      if (status === 429) {
        apiError.rateLimit = {
          limit: headers['x-ratelimit-limit'],
          remaining: headers['x-ratelimit-remaining'],
          reset: headers['x-ratelimit-reset']
        };
      }
      return apiError;
    }
  }
};

class LLMClient {
  constructor(provider = 'openrouter', model = null, temperature = null) {
    if (!providers[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    this.provider = providers[provider];
    this.model = model || this.provider.defaultModel;
    this.temperature = temperature ?? this.provider.defaultTemperature;
    this.apiKey = process.env[this.provider.envKeyName];

    if (!this.apiKey) {
      throw new Error(`${this.provider.envKeyName} is not set in environment variables`);
    }
  }

  async generateCompletion(prompt) {
    try {
      console.log(`Sending prompt to ${this.provider.endpoint}:`, prompt);
      
      const response = await fetch(this.provider.endpoint, {
        method: 'POST',
        headers: this.provider.getHeaders(this.apiKey),
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: this.model,
          temperature: this.temperature
        })
      });

      if (!response.ok) {
        const error = new Error('API request failed');
        error.status = response.status;
        error.response = response;
        throw error;
      }

      const data = await response.json();
      console.log('Received response from API');
      return data.choices[0].message.content;

    } catch (error) {
      console.error('API error:', error);
      throw this.provider.handleError(error);
    }
  }
}

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

// Export the main client function
exports.callAiApi = async (prompt, providerName = 'openrouter', model = null, temperature = null) => {
  const client = new LLMClient(providerName, model, temperature);
  return client.generateCompletion(prompt);
};
