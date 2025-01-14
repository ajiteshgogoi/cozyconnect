import React, { useState } from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
    setIsAnimating(true);
    
    // Fade out current question
    await new Promise(resolve => setTimeout(resolve, 200));
    setQuestion(null);

    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://easyconnect-red.vercel.app/api/generate'
        : 'http://localhost:5000/api/generate';

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Received question:', data);
      setQuestion(data.question);
      setIsFirstQuestion(false);
    } catch (err) {
      console.error('Error generating question:', err);
      setError(`Failed to generate question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnimating(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Easy Connect</h1>
        <p className="text-2xl text-gray-600 mt-4">Conversation prompts to help you build deeper connections.</p>
      </header>
      <div className="flex flex-col items-center space-y-10 w-full max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full text-gray-800 text-center min-h-[160px] flex items-center justify-center relative overflow-hidden mb-6">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 blur-sm opacity-30"></div>
          <div className="absolute inset-[2px] rounded-lg bg-white"></div>
          <div className="relative z-10">
            <p className={`text-xl font-medium transition-opacity duration-200 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}>
              {isFirstQuestion ? "Click 'Generate a Question' to get started..." : question}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={generateQuestion}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-12"
      >
        Generate a Question
      </button>
      <div className="h-8 mb-8">
        {loading && (
          <p className="text-gray-600 animate-pulse">Generating question...</p>
        )}
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
      <footer className="relative mt-8 w-full text-center">
        <a 
          href="https://ajiteshgogoi.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          © ajitesh gogoi
        </a>
      </footer>
    </div>
  );
};

export default App;
