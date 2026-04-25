import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMobile } from '../hooks/useMobile';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/roadmap',   label: '🗺️ Roadmap'   },
  { to: '/resources', label: '🔗 Resources' },
  { to: '/vocabulary',label: '📚 Vocabulary' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
    setOpen(false);
  }

  const linkStyle = (isActive) => ({
    display: 'block',
    padding: isMobile ? '12px 20px' : '6px 14px',
    borderRadius: isMobile ? 0 : 6,
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? '#4f46e5' : '#4b5563',
    background: isActive ? (isMobile ? '#f5f3ff' : '#e0e7ff') : 'transparent',
    textDecoration: 'none',
    borderLeft: isMobile && isActive ? '3px solid #4f46e5' : isMobile ? '3px solid transparent' : 'none',
    transition: 'background 0.15s, color 0.15s',
  });

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
    }}>
      {/* Main bar */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 16px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <Link to="/dashboard" style={{
          fontWeight: 700, fontSize: 18, color: '#4f46e5',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          🇯🇵 Language Buddy
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} style={({ isActive }) => linkStyle(isActive)}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Desktop right */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user && <span style={{ fontSize: 13, color: '#6b7280' }}>Hi, {user.name.split(' ')[0]}</span>}
            <button onClick={handleLogout} style={{
              padding: '6px 14px', borderRadius: 6,
              border: '1px solid #d1d5db', background: 'transparent',
              fontSize: 13, fontWeight: 500, color: '#4b5563', cursor: 'pointer',
            }}>
              Logout
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 22, color: '#374151', padding: '4px 8px',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && open && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {/* User greeting */}
          {user && (
            <div style={{
              padding: '12px 20px',
              fontSize: 13, color: '#9ca3af',
              borderBottom: '1px solid #f3f4f6',
            }}>
              Signed in as <strong style={{ color: '#374151' }}>{user.name}</strong>
            </div>
          )}

          {/* Nav links */}
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => linkStyle(isActive)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          {/* Logout */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6' }}>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '10px 0', borderRadius: 8,
              border: '1px solid #e5e7eb', background: '#f9fafb',
              fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
