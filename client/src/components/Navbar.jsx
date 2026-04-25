import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 20px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontWeight: 700,
    fontSize: 20,
    color: '#4f46e5',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    padding: '6px 14px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#4b5563',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  activeLink: {
    background: '#e0e7ff',
    color: '#4f46e5',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutBtn: {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 500,
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.brand}>
          🌍 Language Learner
        </Link>

        <div style={styles.links}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/vocabulary"
            style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}
          >
            Vocabulary
          </NavLink>
          <NavLink
            to="/roadmap"
            style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}
          >
            Roadmap
          </NavLink>
          <NavLink
            to="/resources"
            style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}
          >
            Resources
          </NavLink>
        </div>

        <div style={styles.right}>
          {user && <span style={styles.userName}>Hi, {user.name.split(' ')[0]}</span>}
          <button style={styles.logoutBtn} onClick={handleLogout}
            onMouseEnter={e => e.target.style.background = '#f3f4f6'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
