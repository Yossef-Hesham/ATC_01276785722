
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This file is only here to satisfy build requirements
// The actual application uses HTML/CSS/JS files directly
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
