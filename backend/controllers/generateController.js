const { callGroqApi } = require('../utils/apiClient');

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
  'generational perspective',
  'seasonal moments',
  'milestones in life',
  'community perspective',
  'global view',
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
  curiosity: ['what sparked', 'how has', 'why do', 'in what way', 'what taught', 'how do you view']
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
  'fateful'
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

exports.generateQuestion = async (req, res) => {
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

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await Promise.race([
          callGroqApi(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('API request timed out')), 6000))
        ]);

        console.log('Full Groq API response:', JSON.stringify(response, null, 2));
        questionText = response.trim();

        if (questionText) {
          // Base prompt for validation and refinement
          const validationPromptBase = `Evaluate the following question and confirm if it meets the specified criteria. Provide "valid" or "invalid" as the result. If invalid, provide a refined version that meets the criteria.
        
        Criteria:
        - Personal and conversational
        - Under ${wordLimit} words
        - Encourages sharing of a story, experience, insight, or opinion
        - Avoids trivial, overly simple, or abstract questions
        - Avoids close-ended phrasing and incorrect grammar
        
        Question: "{questionText}"`;
        
          let refinedQuestion = questionText;
          let validationResponse = null;
        
          const extractRefinedQuestion = (validationResult) => {
            const match = validationResult.match(/Refined version:\s*(.+)/);
            return match ? match[1].trim() : null;
          };
        
          for (let validationAttempt = 1; validationAttempt <= maxRetries; validationAttempt++) {
            try {
              // Generate validation prompt
              const validationPrompt = validationPromptBase.replace("{questionText}", refinedQuestion);
              const validationResult = await callGroqApi(validationPrompt);
        
              console.log('Validation Response:', JSON.stringify(validationResult, null, 2));
        
              // Check for validity
              if (/^\s*valid\b(?!\w)/i.test(validationResult)) {
                validationResponse = refinedQuestion;
                break;
              }
        
              // Attempt to extract and refine the question
              const extractedRefinement = extractRefinedQuestion(validationResult);
              if (extractedRefinement) {
                refinedQuestion = extractedRefinement;
              } else {
                throw new Error('Refinement failed: No refined question extracted.');
              }
            } catch (validationError) {
              console.error(`Validation attempt ${validationAttempt} failed:`, validationError.message);
        
              if (validationAttempt === maxRetries) {
                throw new Error('Validation failed after maximum retries.');
              }
        
              // Optional: Add a delay before retrying
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          }
        
          // Ensure a valid response exists after the loop
          if (!validationResponse) {
            throw new Error('Validation process did not result in a valid question.');
          }
        }        
          else {
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

    if (!questionText) {
      console.error('All API attempts failed:', lastError);
      return res.status(503).json({
        error: "We couldn’t generate a question right now due to high demand. Please try again after a few minutes."
      });
    }

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
      error: "We couldn't generate your question at the moment. Please try again.",
      details: error.message
    });
  }
};