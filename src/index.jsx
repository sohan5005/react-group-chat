import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/dashboard/Dashboard';
import Messenger from './components/messenger/Messenger';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Dashboard>
      <Messenger />
    </Dashboard>
  </React.StrictMode>
);