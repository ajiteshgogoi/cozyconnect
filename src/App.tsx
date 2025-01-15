import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Instructions from './components/Instructions';

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
        ? 'https://cozyconnect.vercel.app/api/generate'
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
          errorMessage = 'Request timed out.😢 Please check your internet connection and try again.';
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
    <Router>
      <div className="bg-orange-50 min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(#e0e0e0_6%,transparent_6%)] bg-[length:24px_24px] md:bg-[radial-gradient(#e0e0e0_12%,transparent_12%)]">
        <Header />

        <Routes>
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/" element={
            <>
              <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
                <div className="w-full max-w-2xl flex justify-center pb-2">
                  <Link 
                    to="/instructions" 
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium underline"
                  >
                    Instructions
                  </Link>
                </div>
                <div className="bg-orange-50 p-8 rounded-lg shadow-xl w-full text-orange-900 text-center min-h-[160px] flex items-center justify-center relative overflow-hidden mb-6">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-200 to-pink-200 blur opacity-40"></div>
                  <div className="absolute inset-[2px] rounded-lg bg-orange-50"></div>
                  <div className="relative z-10 -mt-2">
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

                <div className="w-full max-w-2xl flex justify-center pt-2 pb-4">
                  <p className="text-xs text-gray-500 text-center">
                    <span className="underline">Note:</span> During high demand, question generation may take longer. Thank you for your patience!
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={generateQuestion}
                    className="bg-orange-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 mb-8 text-xl hover:-translate-y-0.5 shadow-md hover:shadow-lg hover:bg-orange-600"
                  >
                    Generate a Question
                  </button>
                </div>
              </div>
            </>
          } />
        </Routes>

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
    </Router>
  );
};

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div 
        onClick={() => window.location.href = '/'}
        className="cursor-pointer"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 pb-2 leading-tight drop-shadow-[0_2px_4px_rgba(255,192,203,0.3)]">
          <span className="mr-3 align-middle">❤️</span>
          Cozy Connect
        </h1>
      </div>
      <div className="bg-orange-900/90 rounded-lg px-8 py-1 w-full max-w-2xl">
        <p className="text-l text-orange-50">Meaningful prompts for heartfelt conversations.</p>
      </div>
    </header>
  );
};

export default App;
