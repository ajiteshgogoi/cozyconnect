const { callGroqApi } = require('../utils/apiClient');

const themes = [// Relationships
  'trust in relationships', 'vulnerability', 'friendship boundaries', 'family dynamics', 'forgiveness', 'love',
  // Personal Growth
  'overcoming fears', 'learning from failure', 'self-discovery', 'habits and routines', 'comfort zones',
  // Values
  'personal ethics', 'life priorities', 'defining success', 'meaningful work', 'impact on others',
  // Experiences
  'turning points', 'lessons learned', 'proud moments', 'regrets', 'overcoming challenges'

];
const perspectives = ['childhood', 'present moment', 'future aspirations'];
const emotionalContexts = ['joy', 'uncertainty', 'hope', 'curiosity', 'gratitude', 'wonder', 'sadness'];
const questionPatterns = {
  'childhood': [
    "What childhood memory about {theme} stands out to you?",
    "How did you first learn about {theme} growing up?",
    "What early experience shaped your view of {theme}?",
    "When did you first encounter {theme} in your childhood?",
    "How did your family approach {theme} when you were young?"
  ],
  'present moment': [
    "How does {theme} show up in your life today?",
    "What are you currently discovering about {theme}?",
    "How are you engaging with {theme} in your life right now?",
    "What recent experience made you think about {theme}?",
    "How is {theme} influencing your daily life?"
  ],
  'future aspirations': [
    "What goals do you have related to {theme}?",
    "How would you like to develop your approach to {theme}?",
    "What changes do you want to make regarding {theme}?",
    "How do you plan to engage with {theme} differently?",
    "What impact would you like to have through {theme}?"
  ]
};

exports.generateQuestion = async (req, res) => {
  try {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    const randomEmotionalContext = emotionalContexts[Math.floor(Math.random() * emotionalContexts.length)];
    
    // Get patterns specific to the perspective
    const perspectivePatterns = questionPatterns[randomPerspective];
    const randomPattern = perspectivePatterns[Math.floor(Math.random() * perspectivePatterns.length)];

    // Create example questions based on the pattern
    const exampleQuestion = randomPattern
      .replace('{theme}', randomTheme);
    
    const prompt = `Generate a single, thought-provoking question about ${randomTheme} from the perspective of ${randomPerspective}, evoking a sense of ${randomEmotionalContext}. The question should:
- Be personal but not invasive
- Encourage storytelling rather than yes/no answers
- Use simple, conversational language
- Focus on experiences rather than opinions
- Avoid potentially traumatic topics
- Be specific enough to spark a clear memory or thought
- Start with words like "What", "How", or "When" rather than "Why"

STRICT TIME RULES:
- For childhood perspective: ONLY ask about past experiences and memories (e.g., "What childhood memory...")
- For present moment: ONLY ask about current situations happening right now (e.g., "How are you currently...")
- For future aspirations: ONLY use present tense about hopes and plans (e.g., "What goals do you have..." or "How do you plan to..."). 
  NEVER use phrases like:
  - "what will be..."
  - "when will you..."
  - "looking back from the future..."
  - "what future moment..."
  - Any construction that assumes knowledge of future events

STRICT GRAMMAR RULES:
- Keep the question under 15 words
- Ask about ONE thing only - no compound questions
- Use simple, everyday language
- Avoid complex clauses or nested thoughts
- Be direct and clear

Here's an example pattern for this specific perspective:
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
