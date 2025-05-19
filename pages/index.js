import { useState } from 'react';
import Router from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      Router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="login">
      <h2>Login to Cron Manager</h2>
      <form onSubmit={login}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
