import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ImportPage.css';

export default function ImportPage({ onImport }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [importedTasks, setImportedTasks] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // URLSearchParams auto-decodes + as space, breaking base64.
    // Use raw location.search and parse manually to preserve base64 integrity.
    const raw = location.search;
    const match = raw.match(/[?&]import=([^&]*)/);
    const data = match ? match[1] : null;

    if (!data) {
      setStatus('error');
      setErrorMsg('在 URL 中找不到匯入資料。');
      return;
    }

    try {
      // Restore base64 padding and decode safely (UTF-8 support)
      const base64 = decodeURIComponent(data).replace(/ /g, '+');
      const binaryStr = atob(base64);
      const bytes = Uint8Array.from(binaryStr, c => c.charCodeAt(0));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      const tasks = JSON.parse(decoded);

      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('資料格式無效');
      }

      setImportedTasks(tasks);
      setStatus('preview');
    } catch (e) {
      console.error('[ImportPage] decode error:', e);
      setStatus('error');
      setErrorMsg(`匯入失敗：${e.message}`);
    }
  }, [location.search]);


  function handleConfirm() {
    importedTasks.forEach(task => onImport(task));
    setStatus('success');
    setTimeout(() => navigate('/tasks'), 2000);
  }

  function handleCancel() {
    navigate('/');
  }

  if (status === 'loading') {
    return (
      <div className="import-page">
        <div className="import-card">
          <div className="import-spinner">⏳</div>
          <h2>正在從 Open Claw 讀取資料...</h2>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="import-page">
        <div className="import-card import-card--error">
          <div className="import-icon">❌</div>
          <h2>匯入失敗</h2>
          <p>{errorMsg}</p>
          <button className="btn btn-secondary" onClick={handleCancel}>← 返回首頁</button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="import-page">
        <div className="import-card import-card--success">
          <div className="import-icon import-icon--bounce">✅</div>
          <h2>匯入成功！</h2>
          <p>已從 Open Claw 新增 <strong>{importedTasks.length}</strong> 件作業。</p>
          <p className="import-redirect">正在跳轉至作業頁面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="import-page animate-fade-in">
      <div className="import-card import-card--preview">
        {/* Header */}
        <div className="import-header">
          <div className="import-oc-badge">
            <span className="import-oc-icon">🦀</span>
            <span>Open Claw</span>
          </div>
          <div className="import-arrow">→</div>
          <div className="import-app-badge">📋 TDTapp</div>
        </div>

        <h2 className="import-title">收集到 {importedTasks.length} 件新作業</h2>
        <p className="import-subtitle">確認匯入前請先預覽清單</p>

        {/* Preview list */}
        <div className="import-list">
          {importedTasks.map((task, i) => (
            <div key={i} className="import-item">
              <div className="import-item-num">{i + 1}</div>
              <div className="import-item-info">
                <span className="import-item-subject">{task.subject}</span>
                <span className="import-item-name">{task.name}</span>
                {task.dueDate && (
                  <span className="import-item-due">📅 繳交期限：{task.dueDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="import-actions">
          <button className="btn btn-primary" onClick={handleConfirm}>
            ✅ 確認匯入 {importedTasks.length} 件作業
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
