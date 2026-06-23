import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { to: '/',           icon: '⊞',  label: '儀表板'    },
  { to: '/tasks',      icon: '📋', label: '作業'       },
  { to: '/todo',       icon: '✅', label: '待辦清單'    },
  { to: '/documents',  icon: '📁', label: '文件'       },
  { to: '/notes',      icon: '📝', label: '筆記'       },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🦀</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">TDTapp</span>
            <span className="sidebar-logo-sub">Open Claw</span>
          </div>
          {/* Close button mobile */}
          <button className="sidebar-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">主選單</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">同</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">TDT 同學</span>
              <span className="sidebar-user-role">TSMC</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
