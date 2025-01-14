const { callGroqApi } = require('../utils/apiClient');

// Restructured themes with compatibility groupings
const themeGroups = {
  relationships: {
    themes: ['trust', 'friendship', 'family', 'love', 'connection'],
    compatibleWith: ['personal_growth', 'life_experiences']
  },
  personal_growth: {
    themes: ['change', 'challenges', 'learning', 'strengths', 'decisions'],
    compatibleWith: ['relationships', 'values', 'life_experiences']
  },
  values: {
    themes: ['purpose', 'success', 'beliefs', 'passion', 'helping others', 'motivation', 'faith'],
    compatibleWith: ['personal_growth', 'life_experiences']
  },
  life_experiences: {
    themes: ['adventures', 'achievements', 'transitions'],
    compatibleWith: ['relationships', 'personal_growth', 'values']
  }
};

// Separate out time-sensitive themes that need special handling
const timeSensitiveThemes = {
  future: ['plans', 'hopes', 'dreams'],
  past: ['memories', 'experiences', 'lessons', 'mistakes'],
  present: ['current challenges', 'ongoing projects', 'daily life']
};

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
    "What moment from your past changed you the most?",
    "What's one of your favorite memories?",
    "What's the most adventurous thing you've done?",
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

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper function to get a compatible theme combination
function getCompatibleThemes() {
  // Get random group
  const groupKeys = Object.keys(themeGroups);
  const primaryGroupKey = groupKeys[Math.floor(Math.random() * groupKeys.length)];
  const primaryGroup = themeGroups[primaryGroupKey];
  
  // Get random theme from primary group
  const primaryTheme = primaryGroup.themes[Math.floor(Math.random() * primaryGroup.themes.length)];
  
  // 30% chance to add compatible theme
  if (Math.random() < 0.3 && primaryGroup.compatibleWith.length > 0) {
    const compatibleGroupKey = primaryGroup.compatibleWith[
      Math.floor(Math.random() * primaryGroup.compatibleWith.length)
    ];
    const compatibleGroup = themeGroups[compatibleGroupKey];
    const secondaryTheme = compatibleGroup.themes[
      Math.floor(Math.random() * compatibleGroup.themes.length)
    ];
    return [primaryTheme, secondaryTheme];
  }
  
  return [primaryTheme];
}

// Helper function to get appropriate time-based theme
function getTimeBasedTheme(perspective) {
  switch(perspective) {
    case 'future aspirations':
      return timeSensitiveThemes.future[Math.floor(Math.random() * timeSensitiveThemes.future.length)];
    case 'past':
    case 'childhood':
      return timeSensitiveThemes.past[Math.floor(Math.random() * timeSensitiveThemes.past.length)];
    case 'present moment':
      return timeSensitiveThemes.present[Math.floor(Math.random() * timeSensitiveThemes.present.length)];
    default:
      return null;
  }
}

exports.generateQuestion = async (req, res) => {
  try {
    // Get random perspective first
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    
    // Get theme(s) based on perspective
    let selectedThemes;
    if (Math.random() < 0.3) {
      // 30% chance to use time-based theme
      const timeTheme = getTimeBasedTheme(randomPerspective);
      selectedThemes = timeTheme ? [timeTheme] : getCompatibleThemes();
    } else {
      selectedThemes = getCompatibleThemes();
    }
    
    const themePhrase = selectedThemes.join(' and ');
    
    // Get patterns specific to the perspective
    const perspectivePatterns = questionPatterns[randomPerspective];
    const shuffledPatterns = shuffleArray([...perspectivePatterns]);
    const basePattern = shuffledPatterns[0];

    const prompt = `Generate a single, natural conversation starter about ${themePhrase} from the perspective of ${randomPerspective}. The question should:

MUST FOLLOW:
- Sound like something a friend would naturally ask
- Be simple and clear (under 15 words)
- Ask about ONE specific thing
- Use correct grammar, paying special attention to:
  * Proper use of "used to" (e.g., "What did you used to believe?" is incorrect)
  * Subject-verb agreement
  * Proper tense consistency
  * Correct preposition usage
- Use British English spelling rules
- Be easy to understand immediately
- Ensure the connection between themes feels natural and logical
- Focus on concrete, specific experiences rather than abstract concepts
${selectedThemes.length > 1 ? '- Make sure both themes are relevant to the question' : ''}

AVOID:
- Abstract or philosophical questions
- Anything that sounds therapeutic or clinical
- Multiple questions or compound questions
- Forced connections between unrelated concepts
- Questions about planning future surprises
- Questions that combine incompatible time periods
- Incorrect verb tenses or agreement

Here's an example of a good, natural question:
${basePattern}

Only respond with the question itself. No additional text.`;
    
    let questionText;
    let retries = 3;
    
    while (retries > 0) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API request timed out')), 8000)
        );
        
        const response = await Promise.race([
          callGroqApi(prompt),
          timeoutPromise
        ]);
        
        console.log('Full Groq API response:', JSON.stringify(response, null, 2));
        questionText = response;
        break;
      } catch (apiError) {
        console.error(`Groq API attempt ${4 - retries} failed:`, apiError.message);
        retries--;
        
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!questionText) {
      console.error('All API attempts failed, using fallback');
      const fallbackPatterns = shuffleArray([...questionPatterns[randomPerspective]]);
      questionText = fallbackPatterns[0];
    }
    
    res.status(200).json({ 
      question: questionText,
      metadata: {
        themes: selectedThemes,
        perspective: randomPerspective
      }
    });
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