const { callGroqApi } = require('../utils/apiClient');

const themes = [// Relationships
  'trust in relationships', 'vulnerability', 'friendship boundaries', 'family dynamics', 'forgiveness',
  // Personal Growth
  'overcoming fears', 'learning from failure', 'self-discovery', 'habits and routines', 'comfort zones',
  // Values
  'personal ethics', 'life priorities', 'defining success', 'meaningful work', 'impact on others',
  // Experiences
  'turning points', 'lessons learned', 'proud moments', 'regrets', 'defining challenges'

];
const perspectives = ['childhood', 'present', 'future'];
const emotionalContexts = ['joy', 'uncertainty', 'hope', 'curiosity', 'gratitude', 'wonder'];
const questionPatterns = [
  "What moment in {perspective} taught you the most about {theme}?",
  "How has your understanding of {theme} evolved since {perspective}?",
  "When did you first realize the importance of {theme} in your {perspective}?",
  "What experience from your {perspective} shaped your view of {theme}?",
  "How does {theme} influence your {perspective}?",
  "What story about {theme} from your {perspective} would you share?"
];

exports.generateQuestion = async (req, res) => {
  try {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    const randomEmotionalContext = emotionalContexts[Math.floor(Math.random() * emotionalContexts.length)];
    const randomPattern = questionPatterns[Math.floor(Math.random() * questionPatterns.length)];

    // Create example questions based on the pattern
    const exampleQuestion = randomPattern
      .replace('{perspective}', randomPerspective)
      .replace('{theme}', randomTheme);
    
    const prompt = `Generate a single, thought-provoking question about ${randomTheme} from the perspective of ${randomPerspective}, evoking a sense of ${randomEmotionalContext}. The question should:
- Be personal but not invasive
- Encourage storytelling rather than yes/no answers
- Use simple, conversational language
- Focus on experiences rather than opinions
- Avoid potentially traumatic topics
- Be specific enough to spark a clear memory or thought
- Start with words like "What", "How", or "When" rather than "Why"
- Make questions concise, ask only one question and avoid stringing together multiple questions connected by 'and'.

Here's an example pattern you can use as inspiration, but feel free to generate a different question:
${exampleQuestion}

Only respond with the question itself. No additional text.`;
    
    let questionText;
    try {
      const response = await callGroqApi(prompt);
      console.log('Full Groq API response:', JSON.stringify(response, null, 2));
      questionText = response;
    } catch (apiError) {
      console.error('Groq API error:', apiError.message);
      // Fallback to local question generation if API fails
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
      const randomPattern = questionPatterns[Math.floor(Math.random() * questionPatterns.length)];
      questionText = randomPattern
        .replace('{perspective}', randomPerspective)
        .replace('{theme}', randomTheme);
    }
    
    res.status(200).json({ question: questionText });
  } catch (error) {
    console.error('Error generating question:', error.message);
    console.error('Request headers:', req.headers);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Failed to generate a question. Please try again.',
      details: error.message 
    });
  }
};
