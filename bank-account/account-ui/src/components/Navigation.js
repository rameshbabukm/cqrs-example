import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-title">Bank Account Manager</h1>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Account List
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/add-account"
              className={`nav-link ${location.pathname === '/add-account' ? 'active' : ''}`}
            >
              Add Account
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;