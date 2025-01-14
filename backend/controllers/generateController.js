const { callGroqApi } = require('../utils/apiClient');

const themes = [
  // Relationships (simplified and more concrete)
  'trust', 'friendship', 'family', 'love', 'connection',
  // Personal Growth (more tangible)
  'change', 'challenges', 'learning', 'strengths', 'decisions',
  // Values (clearer)
  'purpose', 'success', 'beliefs', 'passion', 'helping others',
  // Life Experiences (more specific)
  'adventures', 'achievements', 'mistakes', 'surprises', 'transitions'
];
const perspectives = ['childhood', 'past', 'present moment', 'future aspirations'];
const questionPatterns = {
  'childhood': [
    "What games did you love playing as a child?",
    "Who was your favorite person to spend time with growing up?",
    "What made you really happy as a child?",
    "What place did you love visiting in your childhood?",
    "What did you dream about becoming when you were young?"
  ],
  'past': [
    "What's a moment from your past that changed you?",
    "What's one of your favorite memories?",
    "What adventure in your life stands out to you?",
    "What's the best advice someone gave you?",
    "What skill are you glad you learned?"
  ],
  'present moment': [
    "What makes you smile these days?",
    "What are you excited about right now?",
    "What's bringing you joy lately?",
    "What new thing are you learning?",
    "What do you like most about your life right now?"
  ],
  'future aspirations': [
    "What dream would you love to pursue?",
    "What new skill do you want to learn?",
    "Where would you love to travel next?",
    "What positive change do you want to make?",
    "What adventure would you like to experience?"
  ]
};

exports.generateQuestion = async (req, res) => {
  try {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    
    // Get patterns specific to the perspective
    const perspectivePatterns = questionPatterns[randomPerspective];
    const randomPattern = perspectivePatterns[Math.floor(Math.random() * perspectivePatterns.length)];

    // Create example questions based on the pattern
    const exampleQuestion = randomPattern
      .replace('{theme}', randomTheme);
    
    const prompt = `Generate a single, natural conversation starter about ${randomTheme} from the perspective of ${randomPerspective}. The question should:

MUST FOLLOW:
- Sound like something a friend would naturally ask
- Be simple and clear (under 12 words)
- Ask about ONE specific thing
- Be easy to understand immediately
- Focus on positive or neutral topics
- Encourage sharing a story or experience

AVOID:
- Abstract or philosophical questions
- Questions about hardships, comfort, vulnerability
- Anything that sounds therapeutic or clinical
- Complex emotional terms
- Multiple questions or 'and/or' combinations

Here's an example of a good, natural question:
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
