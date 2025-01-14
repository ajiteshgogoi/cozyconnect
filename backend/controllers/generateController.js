const { callGroqApi } = require('../utils/apiClient');

const themes = ['relationships', 'personal growth', 'values', 'experiences'];
const perspectives = ['childhood', 'present moment', 'future aspirations'];

exports.generateQuestion = async (req, res) => {
  try {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    
    const prompt = `Generate a single, concise open-ended question about ${randomTheme} from the perspective of ${randomPerspective}. Keep the question simple and easy to understand, focusing on one specific idea. Ensure the question is unique, thought-provoking, and contains only one part (no 'and' or multiple questions). Only respond with the question. Don't add any explanations, descriptions or elaboration.`;
    
    const response = await callGroqApi(prompt);
    console.log('Full Groq API response:', JSON.stringify(response, null, 2));
    
    // Groq response is a string, no need for complex parsing
    const questionText = response;
    res.status(200).json({ question: questionText });
  } catch (error) {
    console.error('Error generating question:', error.message);
    res.status(500).json({ error: 'Failed to generate a question. Please try again.' });
  }
};
