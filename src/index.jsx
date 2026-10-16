// src/index.jsx
import React from 'react';
import { render } from 'ink';
import App from './App.jsx';

console.clear();
render(<App />, { patchConsole: true });