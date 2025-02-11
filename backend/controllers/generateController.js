const { callAiApi } = require('../utils/apiClient');
const rateLimit = require('express-rate-limit');
// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: (req) => `Too many generation requests. Please try again in ${Math.ceil((req.rateLimit.resetTime - Date.now())/1000)} seconds.`,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP ${req.ip}. ${req.rateLimit.remaining} requests remaining. Reset in ${Math.ceil((req.rateLimit.resetTime - Date.now())/1000)} seconds.`);
    res.status(429).json({
      type: 'error',
      message: `Too many generation requests. Please try again in ${Math.ceil((req.rateLimit.resetTime - Date.now())/1000)} seconds.`,
      code: 'MIDDLEWARE_RATE_LIMIT',
      reset: Math.ceil((req.rateLimit.resetTime - Date.now())/1000)
    });
  }
});

const themes = [
  { main: 'trust', subthemes: ['betrayal', 'vulnerability', 'building trust', 'rebuilding after betrayal', 'trusting yourself'] },
  { main: 'friendship', subthemes: ['loyalty', 'support', 'childhood friends', 'forgiveness in friendship', 'long-distance friendships'] },
  { main: 'family', subthemes: ['traditions', 'conflict resolution', 'unconditional love', 'family dynamics', 'parent-child relationships'] },
  { main: 'love', subthemes: ['romantic love', 'self-love', 'unrequited love', 'first love', 'sustaining love over time'] },
  { main: 'change', subthemes: ['adaptation', 'growth', 'resistance to change', 'embracing uncertainty', 'transformative experiences'] },
  { main: 'overcoming_challenges', subthemes: ['resilience', 'problem-solving', 'mental toughness', 'seeking help', 'personal breakthroughs'] },
  { main: 'learning', subthemes: ['lifelong learning', 'learning from failure', 'curiosity', 'mentorship', 'self-directed learning'] },
  { main: 'strengths', subthemes: ['discovering strengths', 'using strengths in adversity', 'building confidence', 'acknowledging weaknesses', 'inner resilience'] },
  { main: 'decisions', subthemes: ['making tough choices', 'regret and hindsight', 'weighing risks', 'intuition in decision-making', 'decisions that changed your life'] },
  { main: 'purpose', subthemes: ['finding meaning', 'career purpose', 'life goals', 'serving others', 'purpose in adversity'] },
  { main: 'success', subthemes: ['defining success', 'achieving goals', 'celebrating milestones', 'sacrifices for success', 'learning from success'] },
  { main: 'beliefs', subthemes: ['challenging beliefs', 'cultural influences', 'core values', 'beliefs about yourself', 'evolving beliefs'] },
  { main: 'passion', subthemes: ['discovering passions', 'pursuing passions', 'balancing passion and responsibility', 'turning passion into purpose', 'reigniting passion'] },
  { main: 'helping_others', subthemes: ['acts of kindness', 'mentorship', 'volunteering', 'making a difference', 'helping in unexpected ways'] },
  { main: 'health_and_well-being', subthemes: ['mental health', 'physical fitness', 'self-care', 'work-life balance', 'recovering from setbacks'] },
  { main: 'creativity', subthemes: ['inspiration', 'creative processes', 'overcoming creative blocks', 'collaborative creativity', 'expressing yourself'] },
  { main: 'cultural_experiences', subthemes: ['travel', 'traditions', 'cross-cultural understanding', 'cultural heritage', 'adapting to new cultures'] },
  { main: 'adventures', subthemes: ['unexpected journeys', 'outdoor exploration', 'adrenaline experiences', 'travel stories', 'overcoming fear in adventures'] },
  { main: 'achievements', subthemes: ['pride in accomplishments', 'overcoming odds', 'team achievements', 'recognition', 'setting new goals'] },
  { main: 'mistakes', subthemes: ['lessons from mistakes', 'forgiving yourself', 'apologising', 'mistakes that shaped you', 'moving forward'] },
  { main: 'transition', subthemes: ['life changes', 'new beginnings', 'endings', 'navigating uncertainty', 'adapting to new roles'] },
  { main: 'hobbies', subthemes: ['pursuing hobbies', 'learning new skills', 'hobbies that bring joy', 'sharing hobbies', 'childhood hobbies'] },
  { main: 'curiosity', subthemes: ['exploring the unknown', 'asking questions', 'curiosity in learning', 'curiosity and creativity', 'childlike wonder'] }
];

const perspectives = [
  'childhood',
  'the past',
  'the present moment',
  'future aspirations',
  'through the eyes of a mentor',
  'from the perspective of a learner',
  'cultural lens',
  'through the lens of gratitude',
  'through the lens of an outsider',
  'through the eyes of a loved one',
  'generational perspective',  
  'milestones in life',
  'a turning point',
  'the perspective of hindsight'
];

const themeStarters = {
  trust: ['how did', 'what experience', 'can you describe', 'why do', 'what led to', 'in what way'],
  friendship: ['what moment', 'how did', 'what does', 'can you recall', 'why is', 'what taught you about'],
  family: ['how has', 'what role', 'how do', 'what is your view on', 'why do you think', 'what example comes to mind'],
  love: ['what taught', 'how did', 'what does', 'in what way', 'why is', 'how can'],
  change: ['how has', 'what inspired', 'can you describe', 'why do you think', 'what made', 'how did it feel when'],
  overcoming_challenges: ['how did', 'what helped', 'what lesson', 'can you describe', 'why was', 'what enabled you to'],
  learning: ['what did', 'how has', 'what moment', 'why do you value', 'can you share', 'how can one'],
  strengths: ['how do', 'what strength', 'in what way', 'can you describe', 'why is', 'what moment revealed'],
  decisions: ['how did', 'what led to', 'why did', 'can you explain', 'what influenced', 'how do you view'],
  purpose: ['what gives', 'how has', 'in what way', 'why do', 'what taught you about', 'can you describe'],
  success: ['what does', 'how has', 'why is', 'what example illustrates', 'can you recall', 'how did it feel'],
  beliefs: ['how have', 'what shaped', 'why do', 'can you explain', 'what moment challenged', 'in what way'],
  passion: ['what inspires', 'how do', 'in what way', 'why do you think', 'what taught you about', 'how has'],
  helping_others: ['how did', 'what motivated', 'why is', 'what example comes to mind', 'in what way', 'how has'],
  health_and_well_being: ['what practice', 'how has', 'why do', 'in what way', 'what role does', 'how did'],
  creativity: ['what inspires', 'how do', 'why is', 'in what way', 'what example', 'how has'],
  cultural_experiences: ['what did', 'how has', 'in what way', 'why do you value', 'what taught', 'can you describe'],
  adventures: ['what was', 'how did', 'why is', 'can you recall', 'what inspired', 'how do you feel about'],
  achievements: ['what does', 'how did', 'why is', 'what example', 'can you recall', 'in what way'],
  mistakes: ['what lesson', 'how did', 'why do', 'can you explain', 'what taught you about', 'in what way'],
  transition: ['how did', 'what led to', 'in what way', 'why do you think', 'what example', 'how do you view'],
  hobbies: ['what hobby', 'how do', 'why do', 'in what way', 'what example', 'how has'],
  curiosity: ['can you share', 'why is', 'how has', 'why do', 'in what way', 'what taught', 'how do you view']
};

const emotionalModifiers = [
  'joyful',
  'challenging',
  'life-changing',
  'unexpected',
  'empowering',
  'heart-warming',
  'bittersweet',
  'reflective',
  'liberating',
  'uplifting',
  'poignant',
  'intense',
  'resilient',
  'grateful',
  'content',
  'nostalgic',
  'hopeful',
  'compassionate',
  'vulnerable',
  'motivating',
  'cathartic',
  'peaceful',
  'euphoric',
  'fateful',
  'transformative',
  'healing',
  'enlightening',
  'melancholic',
  'surreal',
  'arduous',
  'tumultuous',
  'triumphant',
  'serene',
  'raw',
  'haunting',
  'grounding',
  'optimistic',
  'restorative',
  'thought-provoking',
  'inspiring'
];

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Helper function to get random elements from an array with optional filtering
const getRandomElements = (array, count = 2, filter = () => true) => {
  const filteredArray = array.filter(filter);
  return shuffleArray([...filteredArray]).slice(0, count);
};

// Apply rate limiting to the generateQuestion endpoint
const generateQuestionHandler = async (req, res) => {
  try {
    // Select random theme, subtheme, perspective, and starter
    const selectedThemeObj = getRandomElements(themes, 1)[0];
    const selectedTheme = selectedThemeObj.main;
    const selectedSubtheme = getRandomElements(selectedThemeObj.subthemes, 1)[0];
    const randomPerspective = getRandomElements(perspectives, 1)[0];
    const randomStarter = getRandomElements(themeStarters[selectedTheme] || ['how', 'what'], 1)[0];
    const emotionalModifier = getRandomElements(emotionalModifiers, 1)[0];

    // Randomise word limit slightly
    const wordLimit = Math.floor(Math.random() * 9) + 12; // Range: 12-20

    // Build the prompt for the LLM
    const prompt = `Generate a ${emotionalModifier} and thought-provoking open-ended question about the theme: "${selectedTheme}" (subtheme: "${selectedSubtheme}"), from the perspective of "${randomPerspective}". Start the question with "${randomStarter}".

MUST BE:
- Personal and conversational
- Under ${wordLimit} words
- Encourage sharing of a story, experience, insight or opinion
AVOID:
- Trivial or overly simple questions (e.g., "What did you eat today?")
- Abstract or overly philosophical phrasing
- Close-ended questions
- Incorrect grammar
- Addressing to self using words like 'I' and 'My' (e.g., "What memory from my past still influences my beliefs today?")
- Questions that are too broad (e.g., "What was your best adventure?")

Example of a good question:
- What moment from your childhood taught you about trust?`;

    let questionText = null;
    const maxRetries = 1; // Number of retries
    let lastError = null;
    let validQuestionFound = false;

    for (let attempt = 1; attempt <= maxRetries && !validQuestionFound; attempt++) {
      try {
        const response = await Promise.race([
          callAiApi(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('API request timed out')), 6000))
        ]);

        console.log('Full API response:', JSON.stringify(response, null, 2));
        questionText = response.trim();

        if (questionText) {
          // Simplified validation and refinement process
          const refinementPrompt = `Refine this question to improve its quality and to meet all criteria:
          - Personal and conversational          
          - Clear and easy to understand
          - At 8th grade reading level
          - Open-ended (cannot be answered with just 'Yes' or 'No')
          - Correct grammar and punctuation
          - Avoids trivial, vague, overly simple, or abstract questions
          - Encourages sharing of a story, experience, insight, or opinion
          - Uses "you/your" instead of "I/me/my"
          - Avoids compound questions (Asks only one question)
          
          Original question: ${questionText}
          
          Return only the refined question:`;
          
          const refinedQuestion = await callAiApi(refinementPrompt);
          questionText = refinedQuestion.trim();
          console.log('Refined question:', questionText);
          validQuestionFound = true;
          break;
        } else {
          throw new Error('Invalid response format.');
        }
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }

    if (!questionText || !validQuestionFound) {
      console.error('Failed to generate valid question:', lastError);
      
      // Log detailed error information to terminal
      console.error('Rate limit exceeded:', {
        retryAfter: lastError?.retryAfter,
        rateLimit: lastError?.rateLimit,
        headers: lastError?.headers,
        status: lastError?.status
      });
      
      // Return rate limit details to frontend
      return res.status(429).json({
        type: 'error',
        message: "You've exceeded the number of generations. Please try again later.",
        code: 'MIDDLEWARE_RATE_LIMIT',
        reset: Math.ceil((req.rateLimit.resetTime - Date.now())/1000),
        remaining: 0,
        limit: req.rateLimit.limit,
        headers: {
          'X-Middleware-RateLimit-Reset': Math.ceil(req.rateLimit.resetTime.getTime() / 1000),
          'X-Middleware-RateLimit-Remaining': 0,
          'X-Middleware-RateLimit-Limit': req.rateLimit.limit
        }
      });
    }

    // Add middleware rate limit headers to response
    res.setHeader('Access-Control-Expose-Headers', 'X-Middleware-RateLimit-Limit, X-Middleware-RateLimit-Remaining, X-Middleware-RateLimit-Reset');
    res.setHeader('X-Middleware-RateLimit-Limit', req.rateLimit.limit);
    res.setHeader('X-Middleware-RateLimit-Remaining', req.rateLimit.remaining);
    res.setHeader('X-Middleware-RateLimit-Reset', Math.ceil(req.rateLimit.resetTime.getTime() / 1000));
    
    res.status(200).json({
      question: questionText,
      metadata: {
        theme: selectedTheme,
        subtheme: selectedSubtheme,
        perspective: randomPerspective,
        modifier: emotionalModifier
      }
    });
  } catch (error) {
    console.error('Error generating question:', error.message);
    res.status(500).json({
      type: 'error',
      message: "We couldn't generate your question.😢 Please try again.",
      details: error.message,
      code: 'SERVER_ERROR'
    });
  }
};

// Export with rate limiting middleware
exports.generateQuestion = [apiLimiter, generateQuestionHandler];
