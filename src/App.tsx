import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Instructions from './components/Instructions';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [questionReceived, setQuestionReceived] = useState(false);

  const generateQuestionInternal = async (retryCount = 0): Promise<void> => {
    // Clear previous state
    setError(null);
    setQuestionReceived(false);
    setIsAnimating(true);
    setLoading(true);
    
    // Fade out current question with slight delay
    await new Promise(resolve => setTimeout(resolve, 150));
    setQuestion(null);

    // Create abort controller for cleanup
    const abortController = new AbortController();
    
    let response: Response | undefined;
    
    try {
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://cozyconnect.vercel.app/api/generate'
        : 'http://localhost:5000/api/generate';

      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          const resetSeconds = errorData.reset;         
          
          const timeDisplay = resetSeconds > 60 
            ? `${Math.ceil(resetSeconds / 60)} minute${Math.ceil(resetSeconds / 60) !== 1 ? 's' : ''}`
            : `${resetSeconds} second${resetSeconds !== 1 ? 's' : ''}`;
            
          throw new Error(`You've reached the limit of 5 questions. Please try again in ${timeDisplay}.`);
        }
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Received question:', data);
      // Set question immediately but keep loading state
      setQuestion(data.question);
      setIsFirstQuestion(false);
      setQuestionReceived(true);
      // Keep loading state with slight overlap
      await new Promise(resolve => setTimeout(resolve, 150));
      setLoading(false);
      // Allow animation to complete before removing animating state
      await new Promise(resolve => setTimeout(resolve, 200));
      setIsAnimating(false);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name !== 'AbortError') {
        let responseText = '';
        console.error('Error generating question:', error);
        
        // Retry logic with exponential backoff
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return generateQuestionInternal(retryCount + 1);
        }

        // Only clear loading state after all retries are exhausted
        await new Promise(resolve => setTimeout(resolve, 150));
        setIsAnimating(false);
        setLoading(false);
        setQuestionReceived(false);

        // Show error messages
        let errorMessage = 'An unexpected error occurred. Please try again.';
        
        // Handle rate limit errors
        if (response?.status === 429) {
          errorMessage = error.message;
        }
        // Handle other API errors
        else if (error.message.includes('No internet connection')) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      }
    } finally {
      // Cleanup
      abortController.abort();
    }
  };

  const generateQuestion: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await generateQuestionInternal();
  };

  return (
    <Router>
<div className="bg-orange-50 min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(rgba(224,224,224,0.3)_12%,transparent_12%)] bg-[length:24px_24px]">
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
                <div className="w-full mb-6">
                  <div className="bg-orange-50 p-8 rounded-lg shadow-xl w-full text-orange-900 text-center h-[200px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-200 to-pink-200 blur opacity-40"></div>
                    <div className="absolute inset-[2px] rounded-lg bg-orange-50"></div>
                    <div className="relative z-10 -mt-2 h-full w-full overflow-y-auto flex items-center justify-center">
                      {loading && !questionReceived ? (
                        <p className="text-orange-700/80 animate-pulse">Generating question...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <p className={`text-l font-medium text-orange-900/90 transition-opacity duration-200 ${
                          isAnimating ? 'opacity-0' : 'opacity-100'
                        }`} style={{ textShadow: isFirstQuestion ? 'none' : '0px 1px 2px rgba(0,0,0,0.1)' }}>
                          {isFirstQuestion ? "Click 'Generate a Question' to get a prompt..." : question}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-2xl flex justify-center pt-2 pb-4">
                  <p className="text-xs text-gray-500 text-center">
                    <span className="underline">Note:</span> To prevent issues from too many generation requests, you're limited to 5 question generations every 10 minutes.
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

                <div className="w-full max-w-2xl flex justify-center pt-2 pb-4">
                  <div className="bg-orange-50 p-4 rounded-lg shadow-md">
                    <a
                      href="https://touchbasepro.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0EA5E9] hover:text-[#0EA5E9]/80 text-sm font-medium"
                    >
                      Stay connected with the people who matter most. Try TouchBase. <span className="text-[#0EA5E9]">💙</span>
                    </a>
                  </div>
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
            © {new Date().getFullYear()} ajitesh gogoi
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
          <span className="mr-3 inline-block align-baseline">❤️</span>
          Cozy Connect
        </h1>
      </div>
      <div className="bg-orange-900/90 rounded-lg px-8 py-1 w-full max-w-2xl mt-1">
        <p className="text-l text-orange-50">Meaningful prompts for heartfelt conversations.</p>
      </div>
    </header>
  );
};

export default App;
