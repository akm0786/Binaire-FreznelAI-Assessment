import React, { useState, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { FirebaseAuthService } from '../../auth/FirebaseAuthService.js';

export default function SignupScreen({ onAuthenticated }) {
  const authServiceRef = useRef(new FirebaseAuthService());

  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [activeField, setActiveField] = useState('email'); // 'email' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keyboard navigation: Tab ya Up/Down arrow se field switch karein, Ctrl+L se Login/Signup toggle karein
  useInput((input, key) => {
    if (loading) return;
    if (key.tab || key.upArrow || key.downArrow) {
      setActiveField((prev) => (prev === 'email' ? 'password' : 'email'));
    }
    if (key.ctrl && input === 't') {
      setMode((prev) => (prev === 'signup' ? 'login' : 'signup'));
      setError('');
    }
  });

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password (min 6 chars).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user =
        mode === 'signup'
          ? await authServiceRef.current.signUp(email, password)
          : await authServiceRef.current.login(email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Check Firebase console.');
      setLoading(false);
    }
  };

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderStyle="round"
      borderColor="cyan"
      padding={2}
      width={75}
    >
      <Text bold color="cyan">
        ┌─── BINAIRE SYSTEM TASKS & SENSOR VIEWER ───┐
      </Text>
      <Text color="yellow" bold>
        {mode === 'signup' ? 'Firebase Sign-Up Screen' : 'Firebase Login Screen'}
      </Text>
      <Text color="gray">
        (Use Up/Down/Tab to switch fields • Press Enter to submit • Ctrl+T to switch Login/Sign-Up)
      </Text>

      <Box flexDirection="column" marginTop={1} width={55}>
        <Box
          borderStyle="single"
          borderColor={activeField === 'email' ? 'green' : 'gray'}
          paddingX={1}
        >
          <Text color={activeField === 'email' ? 'green' : 'white'}>Email:    </Text>
          {activeField === 'email' ? (
            <TextInput
              value={email}
              onChange={setEmail}
              placeholder="user@example.com"
              onSubmit={() => setActiveField('password')}
            />
          ) : (
            <Text>{email || 'user@example.com'}</Text>
          )}
        </Box>

        <Box
          borderStyle="single"
          borderColor={activeField === 'password' ? 'green' : 'gray'}
          paddingX={1}
          marginTop={1}
        >
          <Text color={activeField === 'password' ? 'green' : 'white'}>Password: </Text>
          {activeField === 'password' ? (
            <TextInput
              value={password}
              onChange={setPassword}
              mask="*"
              placeholder="Min 6 characters"
              onSubmit={handleSubmit}
            />
          ) : (
            <Text>{'*'.repeat(password.length)}</Text>
          )}
        </Box>
      </Box>

      {loading && (
        <Box marginTop={1}>
          <Text color="cyan">Authenticating with Firebase Server...</Text>
        </Box>
      )}

      {error !== '' && (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      )}
    </Box>
  );
}