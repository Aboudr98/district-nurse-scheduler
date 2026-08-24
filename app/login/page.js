"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
 <div>
      <h1>Login</h1>
      <form onSubmit={async (e) => {
        try {

        e.preventDefault();
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
      }
      catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
      }
      }}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>  );
}

