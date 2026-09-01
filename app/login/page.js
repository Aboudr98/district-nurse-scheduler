"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // On page load, check if a session already exists.
  // If so, redirect straight to the dashboard instead of showing the login form,
  // since a logged-in user shouldn't be shown a login page again.
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          router.push('/dashboard');
        }
        // if not ok (401), do nothing — no session exists, show the login form as normal
      } catch (error) {
        console.error('Error checking existing session:', error);
      }
    };

    checkExistingSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900">Login</h1>
          <form className="flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
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
                alert(`Login failed: ${data.message}`);
              }
            } catch (error) {
              console.error('Error during login:', error);
              alert('An error occurred during login. Please try again.');
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