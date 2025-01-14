import React, { useState } from 'react';

interface ApiResponse {
  question: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
    setQuestion(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate');
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
    <div className="bg-gray-100 dark:bg-gray-900 min- flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Easy Connect</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Question prompts to build deeper connections.</p>
      </header>
      <button
        onClick={generateQuestion}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out mb-4"
      >
        Generate a Question
      </button>
      {loading && <p className="text-gray-600 dark:text-gray-400">Generating question...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {question && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl text-gray-800 dark:text-white">
          <p>{question}</p>
        </div>
      )}
    </div>
  );
};

export default App;
