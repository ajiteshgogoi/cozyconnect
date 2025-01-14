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
    "What do you hope to achieve with {theme}?",
    "How do you want to approach {theme} going forward?",
    "What goals do you have related to {theme}?",
    "How do you want to develop {theme} in your life?",
    "What changes would you like to make regarding {theme}?"
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

IMPORTANT TIME RULES:
- For childhood perspective: ONLY ask about past experiences and memories
- For present moment: ONLY ask about current situations happening right now
- For future aspirations: ONLY ask about hopes, plans, and goals. NEVER ask about looking back from the future
- NEVER mix time perspectives (e.g., no looking back from the future or remembering future events)

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
