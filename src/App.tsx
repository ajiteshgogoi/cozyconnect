import React, { useState } from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
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
    } catch (err) {
      console.error('Error generating question:', err);
      setError(`Failed to generate question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min- flex flex-col items-center justify-center p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Easy Connect</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mt-2">Question prompts to build deeper connections.</p>
      </header>
      <button
        onClick={generateQuestion}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Generate a Question
      </button>
      {loading && (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">Generating question...</p>
      )}
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      {question && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-gray-800 dark:text-white text-center">
          <p className="text-xl font-medium">{question}</p>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {document.documentElement.classList.contains('dark') ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.005 9.005 0 003 12h18a9.005 9.005 0 00-4.646-8.646z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default App;