// src/App.jsx
import React, { useState } from 'react';
import SignupScreen from './components/Auth/SignupScreen.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <SignupScreen onAuthenticated={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return <DashboardPage user={user} />;
}