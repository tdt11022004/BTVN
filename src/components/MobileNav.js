import React from 'react';
import { NavLink } from 'react-router-dom';
import './MobileNav.css';

const navItems = [
  { to: '/',           icon: '⊞',  label: '首頁'     },
  { to: '/tasks',      icon: '📋', label: '作業'     },
  { to: '/todo',       icon: '✅', label: '待辦'     },
  { to: '/documents',  icon: '📁', label: '文件'     },
  { to: '/notes',      icon: '📝', label: '筆記'     },
];

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`
          }
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
