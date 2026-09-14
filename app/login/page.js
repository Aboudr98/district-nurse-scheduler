"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      }
    };

    checkExistingSession();
  }, []);

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50">
    {/* Decorative background shapes — purely visual, no interactive content */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
    <div className="absolute bottom-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-teal-200 rounded-full opacity-30 blur-3xl"></div>

    <div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
      
    
          <h1 className="text-2xl font-semibold mb-6 text-gray-900">Login</h1>

          {feedback && (
            <div className={`mb-4 px-4 py-2 rounded text-sm ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {feedback.text}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setFeedback(null);
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
              });

              const data = await response.json();
              if (response.ok) {
                router.push('/dashboard');
              } else {
                setFeedback({ type: 'error', text: data.message });
              }
            } catch (error) {
              console.error('Error during login:', error);
              setFeedback({ type: 'error', text: 'An error occurred during login. Please try again.' });
            } finally {
              setIsSubmitting(false);
            }
          }}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
