import React from 'react';
import { Link } from 'react-router-dom';

const Instructions: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow-lg w-full md:mx-auto md:max-w-2xl border border-white/20 relative overflow-visible">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">How to Use Cozy Connect</h1>
        
        <div className="space-y-6 text-orange-800">
          <section>
            <h2 className="text-xl font-semibold mb-2">Welcome to Cozy Connect!</h2>
            <p className="text-lg leading-relaxed">
              This is a fun way to have meaningful conversations and get to know someone better. Here's how to make the most of your experience:
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Generating Questions:</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>Click the 'Generate a Question' button.</li>
              <li>Wait a few seconds while we create a unique question for you.</li>
              <li>Read the question and share it with your partner or friend.</li>
              <li>Discuss your answers together.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Tips for Great Conversations:</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>Be open and honest in your responses.</li>
              <li>Listen actively to your partner or friend.</li>
              <li>Don't rush. Take time to reflect.</li>
              <li>Follow up with related questions.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Installation Instructions:</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">iOS:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>On Safari, tap the Share button</li>
                  <li>Select Add to Home Screen</li>
                  <li>Tap Add to install</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Android:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Tap the install prompt when it appears, or</li>
                  <li>Open menu (3 dots) and select</li>
                  <li>Install app or Add to Home screen</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">If You Experience Any Issues:</h2>  
            <ol className="list-decimal list-inside space-y-3">
              <li>Check your internet connection.</li>
              <li>Refresh the page.</li>
              <li>Try again after a few minutes.</li>
            </ol>
          </section>

          <div className="pt-6 pb-6 flex justify-center">
            <Link
              to="/"
              className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 hover:bg-orange-600 inline-block"
            >
              Back to Main Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
