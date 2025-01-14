const { callGroqApi } = require('../utils/apiClient');

const themes = [
  'trust', 'friendship', 'family', 'love', 'connection', 'hope',
  'change', 'challenges', 'learning', 'strengths', 'decisions',
  'purpose', 'success', 'beliefs', 'passion', 'helping others', 'motivation',
  'adventures', 'achievements', 'mistakes', 'surprises', 'transition', 'hobbies'
];

const perspectives = ['childhood', 'past', 'present moment', 'future aspirations'];

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

    // Build the prompt for the LLM
    const prompt = `Generate a clear, engaging question about "${selectedTheme}" from the perspective of "${randomPerspective}". 
      
Must be:
- Natural and conversational
- Under 15 words
- Encouraging a specific story or experience
Avoid:
- Abstract or overly philosophical phrasing
- Incorrect grammar
Example:
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

    // Fallback mechanism
    if (!questionText) {
      console.error('All API attempts failed, using fallback');
      questionText = `What is a memorable experience about ${selectedTheme} from your ${randomPerspective}?`;
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
      error: 'Failed to generate a question. Please try again.',
      details: error.message 
    });
  }
};
