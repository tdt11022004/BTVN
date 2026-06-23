import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import './NotesPage.css';

const SAMPLE_NOTES = [
  {
    id: uuidv4(),
    title: 'AI 講義摘要 - 第三章',
    content: '機器學習是 AI 的一個分支，使電腦能夠從資料中學習。\n\n- 監督式學習（Supervised Learning）\n- 非監督式學習（Unsupervised Learning）\n- 強化學習（Reinforcement Learning）',
    subject: '人工智慧',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Open Claw - 主要使用案例',
    content: 'Open Claw 可以：\n1. 自動化瀏覽器操作\n2. 從多個平台收集資訊\n3. 智能任務管理支援\n\n學生應用：管理作業、繳交期限提醒。',
    subject: '軟體工程',
    createdAt: new Date().toISOString(),
  },
];

export default function NotesPage({ tasks }) {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tdtapp_notes')) || SAMPLE_NOTES; }
    catch { return SAMPLE_NOTES; }
  });
  const [filterSubject, setFilterSubject] = useState('all');
  const [editNote, setEditNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', subject: '' });

  const subjects = ['all', ...new Set([...tasks.map(t => t.subject), ...notes.map(n => n.subject)])];

  const filtered = notes.filter(n => filterSubject === 'all' || n.subject === filterSubject);

  function saveNotes(updated) {
    setNotes(updated);
    localStorage.setItem('tdtapp_notes', JSON.stringify(updated));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editNote) {
      saveNotes(notes.map(n => n.id === editNote.id ? { ...n, ...form } : n));
    } else {
      saveNotes([{ id: uuidv4(), ...form, createdAt: new Date().toISOString() }, ...notes]);
    }
    setShowForm(false);
    setEditNote(null);
    setForm({ title: '', content: '', subject: '' });
  }

  function handleEdit(note) {
    setForm({ title: note.title, content: note.content, subject: note.subject });
    setEditNote(note);
    setShowForm(true);
  }

  function handleDelete(id) { saveNotes(notes.filter(n => n.id !== id)); }

  function handleCancel() {
    setShowForm(false);
    setEditNote(null);
    setForm({ title: '', content: '', subject: '' });
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>📝 筆記</h1>
          <p>依科目記錄課堂筆記與知識摘要</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditNote(null); setForm({ title: '', content: '', subject: '' }); }}>
          ＋ 新增筆記
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="note-form card animate-slide-up">
          <h3 style={{ marginBottom: 16 }}>{editNote ? '✏️ 編輯筆記' : '📝 新增筆記'}</h3>
          <div className="flex flex-col gap-3">
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">標題 *</label>
                <input className="form-input" placeholder="筆記標題..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">科目</label>
                <select className="form-select" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  <option value="">選擇科目...</option>
                  {tasks.map(t => t.subject).filter((v, i, a) => a.indexOf(v) === i).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">內容</label>
              <textarea className="form-textarea" rows={8} placeholder="記錄課堂內容、重要知識點..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleSave}>💾 儲存</button>
            <button className="btn btn-secondary" onClick={handleCancel}>取消</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="doc-subject-tabs" style={{ marginBottom: 24 }}>
        {subjects.map(s => (
          <button key={s} className={`filter-btn ${filterSubject === s ? 'filter-btn--active' : ''}`} onClick={() => setFilterSubject(s)}>
            {s === 'all' ? '📚 全部' : s}
          </button>
        ))}
      </div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📓</div>
          <h3>尚無筆記</h3>
          <p>點擊「新增筆記」開始記錄課堂知識</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map(note => (
            <div key={note.id} className="note-card animate-slide-up">
              <div className="note-card-header">
                {note.subject && <span className="note-card-subject">{note.subject}</span>}
                <div className="note-card-actions">
                  <button className="btn btn-icon btn-secondary" onClick={() => handleEdit(note)}>✏️</button>
                  <button className="btn btn-icon btn-danger" onClick={() => handleDelete(note.id)}>🗑️</button>
                </div>
              </div>
              <h3 className="note-card-title">{note.title}</h3>
              <p className="note-card-content">{note.content}</p>
              <span className="note-card-date">
                {format(new Date(note.createdAt), "dd/MM/yyyy", { locale: zhTW })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
