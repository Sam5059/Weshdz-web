/**
 * Point d'entrée principal de l'application React
 *
 * Ce fichier :
 * - Initialise le root React
 * - Active le StrictMode pour détecter les problèmes potentiels
 * - Monte le composant App dans le DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Création du root React et rendu de l'application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
