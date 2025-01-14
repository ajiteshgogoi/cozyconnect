const { callGroqApi } = require('../utils/apiClient');

const themes = [// Relationships
  'trust in relationships', 'vulnerability', 'friendship boundaries', 'family dynamics', 'forgiveness', 'love',
  // Personal Growth
  'overcoming fears', 'learning from failure', 'self-discovery', 'habits and routines', 'comfort zones',
  // Values
  'personal ethics', 'life priorities', 'defining success', 'meaningful work', 'impact on others',
  // Experiences
  'turning points', 'lessons learned', 'proud moments', 'regrets', 'defining challenges'

];
const perspectives = ['childhood', 'past', 'present', 'future'];
const emotionalContexts = ['joy', 'uncertainty', 'hope', 'curiosity', 'gratitude', 'wonder', 'sadness'];
const questionPatterns = [
  "What moment in {perspective} taught you the most about {theme}?",
  "How has your understanding of {theme} evolved since {perspective}?",
  "When did you first realize the importance of {theme} in your {perspective}?",
  "What experience from your {perspective} shaped your view of {theme}?",
  "How does {theme} influence your {perspective}?",
  "What story about {theme} from your {perspective} would you share?",
  // Childhood patterns (past-focused)
  "What childhood experience first taught you about {theme}?",
  "How did your early experiences with {theme} shape who you are today?",  
  // Present patterns (current-focused)
  "How is {theme} playing a role in your life right now?",
  "What are you currently learning about {theme}?",  
  // Future patterns (forward-looking)
  "How do you hope to develop {theme} in your future?",
  "What goals do you have related to {theme}?"
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
- For 'childhood' and 'past' perspectives: focus on past memories and experiences
- For 'present' perspective: focus on current situations and ongoing experiences
- For 'future' perspective: use forward-looking language about hopes and plans, not looking back from the future

Examples of good temporal alignment:
- Childhood: "What childhood memory taught you the most about trust?"
- Present: "How are you currently approaching personal growth in your life?"
- Future: "What kind of impact do you hope to have on others in the coming years?"

Here's an example pattern you can use as inspiration, but generate a different question which may or may not follow the pattern:
${exampleQuestion}

Always use correct grammar and recheck for grammatical errors.
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
