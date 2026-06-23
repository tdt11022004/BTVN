import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import './DocumentsPage.css';

const FILE_ICONS = { pdf: '📄', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊', mp4: '🎬', link: '🔗', img: '🖼️', zip: '📦', other: '📎' };

function getFileIcon(type) { return FILE_ICONS[type] || FILE_ICONS.other; }

const SAMPLE_DOCS = [
  { id: uuidv4(), name: '第三章講義投影片.pdf', type: 'pdf', subject: '人工智慧', addedAt: new Date().toISOString(), url: '#' },
  { id: uuidv4(), name: 'Open Claw 作業說明.docx', type: 'docx', subject: '軟體工程', addedAt: new Date().toISOString(), url: '#' },
  { id: uuidv4(), name: 'Open Claw 介紹影片', type: 'link', subject: '軟體工程', addedAt: new Date().toISOString(), url: 'https://openclaw.ai' },
  { id: uuidv4(), name: 'ERD 範例圖.pdf', type: 'pdf', subject: '資料庫', addedAt: new Date().toISOString(), url: '#' },
  { id: uuidv4(), name: 'TCP/IP 協定文件.pdf', type: 'pdf', subject: '計算機網路', addedAt: new Date().toISOString(), url: '#' },
];

export default function DocumentsPage({ tasks }) {
  const [docs, setDocs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tdtapp_docs')) || SAMPLE_DOCS; }
    catch { return SAMPLE_DOCS; }
  });
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', type: 'pdf', subject: '', url: '' });

  const subjects = ['all', ...new Set([...tasks.map(t => t.subject), ...docs.map(d => d.subject)])];

  const filtered = docs.filter(d => selectedSubject === 'all' || d.subject === selectedSubject);

  function saveAndUpdate(updated) {
    setDocs(updated);
    localStorage.setItem('tdtapp_docs', JSON.stringify(updated));
  }

  function handleAdd() {
    if (!newDoc.name.trim()) return;
    const doc = { id: uuidv4(), ...newDoc, addedAt: new Date().toISOString() };
    saveAndUpdate([doc, ...docs]);
    setNewDoc({ name: '', type: 'pdf', subject: '', url: '' });
    setShowAddForm(false);
  }

  function handleDelete(id) {
    saveAndUpdate(docs.filter(d => d.id !== id));
  }

  // Group by subject
  const grouped = {};
  filtered.forEach(d => {
    if (!grouped[d.subject]) grouped[d.subject] = [];
    grouped[d.subject].push(d);
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>📁 文件</h1>
          <p>依科目管理與分類學習文件</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(v => !v)}>
          ＋ 新增文件
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="doc-add-form card animate-slide-up">
          <h3 style={{ marginBottom: 16 }}>新增文件</h3>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">文件名稱 *</label>
              <input className="form-input" placeholder="例：第三章投影片.pdf" value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">檔案類型</label>
              <select className="form-select" value={newDoc.type} onChange={e => setNewDoc(p => ({ ...p, type: e.target.value }))}>
                {Object.keys(FILE_ICONS).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">科目</label>
              <select className="form-select" value={newDoc.subject} onChange={e => setNewDoc(p => ({ ...p, subject: e.target.value }))}>
                <option value="">選擇科目...</option>
                {tasks.map(t => t.subject).filter((v, i, a) => a.indexOf(v) === i).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">連結／URL（選填）</label>
              <input className="form-input" placeholder="https://..." value={newDoc.url} onChange={e => setNewDoc(p => ({ ...p, url: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleAdd}>✅ 儲存文件</button>
            <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>取消</button>
          </div>
        </div>
      )}

      {/* Subject filter */}
      <div className="doc-subject-tabs">
        {subjects.map(s => (
          <button key={s} className={`filter-btn ${selectedSubject === s ? 'filter-btn--active' : ''}`} onClick={() => setSelectedSubject(s)}>
            {s === 'all' ? '📚 全部' : s}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3>尚無文件</h3>
          <p>點擊「新增文件」開始儲存學習資料</p>
        </div>
      ) : (
        <div className="doc-groups">
          {Object.entries(grouped).map(([subject, docList]) => (
            <div key={subject} className="doc-group">
              <h3 className="doc-group-title">📚 {subject} <span className="doc-group-count">{docList.length} 件文件</span></h3>
              <div className="doc-items">
                {docList.map(doc => (
                  <div key={doc.id} className="doc-item">
                    <span className="doc-item-icon">{getFileIcon(doc.type)}</span>
                    <div className="doc-item-info">
                      <span className="doc-item-name">{doc.name}</span>
                      <span className="doc-item-meta">
                        {doc.type.toUpperCase()} · {format(new Date(doc.addedAt), 'dd/MM/yyyy', { locale: zhTW })}
                      </span>
                    </div>
                    <div className="doc-item-actions">
                      {doc.url && doc.url !== '#' && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🔗 開啟</a>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
