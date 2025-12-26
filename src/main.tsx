import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ייבוא העיצוב הבסיסי כפי שמופיע במבנה התיקיות שלך

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);