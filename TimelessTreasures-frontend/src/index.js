import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Wrap your app component with the Router component
const app = (
  <Router>
    <App />
  </Router>
);

// Use createRoot instead of ReactDOM.render
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(app);