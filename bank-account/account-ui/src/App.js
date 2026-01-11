import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AccountList from './components/AccountList';
import AddAccount from './components/AddAccount';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<AccountList />} />
            <Route path="/add-account" element={<AddAccount />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;