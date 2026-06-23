import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import './Header.css';

const routeTitles = {
  '/':          { title: '儀表板',   subtitle: '學習總覽'   },
  '/tasks':     { title: '作業',     subtitle: '作業管理'   },
  '/todo':      { title: '待辦清單', subtitle: '待辦事項'   },
  '/documents': { title: '文件',     subtitle: '學習文件'   },
  '/notes':     { title: '筆記',     subtitle: '課堂筆記'   },
};

export default function Header({ onAddTask, onMenuToggle }) {
  const { pathname } = useLocation();
  const { title, subtitle } = routeTitles[pathname] || routeTitles['/'];
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = format(now, "HH:mm");
  const dateStr = format(now, "dd/MM", { locale: zhTW });

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger for mobile */}
        <button
          className="header-hamburger"
          onClick={onMenuToggle}
          aria-label="開啟選單"
          id="btn-hamburger"
        >
          <span /><span /><span />
        </button>

        <div className="header-title-wrap">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {pathname === '/tasks' && (
          <button
            className="btn btn-primary btn-add-task"
            onClick={onAddTask}
            id="btn-add-task"
          >
            <span className="btn-add-icon">＋</span>
            <span className="btn-add-label">新增作業</span>
          </button>
        )}
        <div className="header-datetime">
          <span className="header-time">{timeStr}</span>
          <span className="header-date">{dateStr}</span>
        </div>
      </div>
    </header>
  );
}
