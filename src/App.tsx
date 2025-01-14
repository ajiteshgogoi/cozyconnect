import React, { useState } from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateQuestionInternal = async (retryCount = 0): Promise<void> => {
    setLoading(true);
    setError(null);
    setIsAnimating(true);
    
    // Fade out current question
    await new Promise(resolve => setTimeout(resolve, 200));
    setQuestion(null);

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://easyconnect-red.vercel.app/api/generate'
        : 'http://localhost:5000/api/generate';

      const controller = new AbortController();
      // Increase timeout to 10 seconds for mobile
      const timeoutDuration = window.innerWidth <= 768 ? 10000 : 5000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
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
      
      // Retry logic with exponential backoff
      if (retryCount < 2 && err instanceof Error && err.name !== 'AbortError') {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateQuestionInternal(retryCount + 1);
      }

      // User-friendly error messages
      let errorMessage = 'Failed to generate question. Please try again.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your internet connection.';
        } else if (err.message.includes('No internet connection')) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnimating(false);
      setLoading(false);
    }
  };

  const generateQuestion: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await generateQuestionInternal();
  };

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 pb-2 leading-tight drop-shadow-[0_2px_4px_rgba(255,192,203,0.3)]">
          <span className="mr-3">❤️</span>
          Easy Connect
        </h1>
        <p className="text-xl text-orange-800/80 mt-4">❤️ Conversation prompts to help you create deeper connections.</p>
      </header>
      <div className="flex flex-col items-center space-y-10 w-full max-w-2xl">
        <div className="bg-orange-50 p-8 rounded-lg shadow-xl w-full text-orange-900 text-center min-h-[160px] flex items-center justify-center relative overflow-hidden mb-6">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-200 to-pink-200 blur opacity-40"></div>
          <div className="absolute inset-[2px] rounded-lg bg-orange-50"></div>
          <div className="relative z-10">
            {loading ? (
              <p className="text-orange-700/80 animate-pulse">Generating question...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className={`text-l font-medium text-orange-900/90 transition-opacity duration-200 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}>
                {isFirstQuestion ? "Click 'Generate a Question' to get a prompt..." : question}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={generateQuestion}
          className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 mb-12 text-lg hover:shadow-lg hover:shadow-orange-200/50"
        >
          Generate a Question
        </button>
      </div>
      <footer className="mt-8 w-full text-center space-y-4">
        <a 
          href="https://ko-fi.com/gogoi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gray-700 text-white font-medium py-1.5 px-3 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <img 
            src="https://storage.ko-fi.com/cdn/cup-border.png" 
            alt="Ko-Fi logo" 
            className="w-4 h-4 mr-1.5"
          />
          Buy Me a Coffee
        </a>
        <div className="text-gray-500 text-sm mt-4">
          © ajitesh gogoi
        </div>
      </footer>
    </div>
  );
};

export default App;
