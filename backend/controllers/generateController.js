const { callGroqApi } = require('../utils/apiClient');

const themes = [
  'trust', 'friendship', 'family', 'love', 'change', 'relationship',
  'overcoming challenges', 'learning', 'strengths', 'decisions',
  'purpose', 'success', 'beliefs', 'passion', 'helping others',
  'health and well-being', 'creativity', 'cultural experiences',
  'adventures', 'achievements', 'mistakes', 'transition',
  'hobbies', 'curiosity'
];

const perspectives = ['childhood', 'the past', 'the present moment', 'future aspirations'];

const starters = ['how', 'what'];

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper function to get random elements with filtering
function getRandomElements(array, count = 2, filter = () => true) {
  const filteredArray = array.filter(filter);
  const shuffled = shuffleArray([...filteredArray]);
  return shuffled.slice(0, count);
}

exports.generateQuestion = async (req, res) => {
  try {
    // Select a random theme
    const selectedThemes = getRandomElements(themes, 1);
    const selectedTheme = selectedThemes[0];

    // Select a random perspective
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];

    // Select a random starter
    const randomStarter = starters[Math.floor(Math.random() * starters.length)];

    // Build the prompt for the LLM
    const prompt = `Generate a meaningful and thought-provoking open-ended question about the theme: "${selectedTheme}", from the perspective of "${randomPerspective}". Focus on a specific aspect or subtheme about "${selectedTheme}". Start the question with "${randomStarter}". 
      
MUST BE:
- Personal and conversational
- Under 15 words
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

    let questionText;
    let retries = 3;
    let lastError;

    // Retry mechanism for API call
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
        questionText = response.trim();

        // Validate the response
        if (questionText && questionText.length <= 100) {
          break;
        } else {
          throw new Error('Invalid response format.');
        }
      } catch (apiError) {
        lastError = apiError;
        console.error(`Groq API attempt ${4 - retries} failed:`, apiError.message);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Handle API failure
    if (!questionText) {
      console.error('All API attempts failed');
      return res.status(503).json({
        error: "We couldn’t generate a question right now due to high demand. Please try again later."
      });
    }

    res.status(200).json({
      question: questionText,
      metadata: {
        theme: selectedTheme,
        perspective: randomPerspective
      }
    });
  } catch (error) {
    console.error('Error generating question:', error.message);
    console.error('Request headers:', req.headers);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Failed to generate a question.😢 Please try again.',
      details: error.message 
    });
  }
};
