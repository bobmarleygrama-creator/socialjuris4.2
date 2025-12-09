import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { AuthState, User } from './types';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const handleLoginSuccess = (user: User) => {
    setAuth({
      isAuthenticated: true,
      user,
    });
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  if (auth.isAuthenticated && auth.user) {
    return <Dashboard user={auth.user} onLogout={handleLogout} />;
  }

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}

export default App;