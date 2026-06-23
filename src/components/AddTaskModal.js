import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';

const SUBJECTS = [
  '人工智慧',
  '軟體工程',
  '資料庫',
  '計算機網路',
  '網頁程式設計',
  '作業系統',
  '資料結構與演算法',
  '離散數學',
  '其他科目',
];

const DEFAULT_FORM = {
  subject: '人工智慧',
  name: '',
  dueDate: '',
  instructions: '',
  notes: '',
};

export default function AddTaskModal({ open, onClose, onSave, editTask }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const isEditing = !!editTask;

  useEffect(() => {
    if (editTask) {
      setForm({
        subject: editTask.subject || '',
        name: editTask.name || '',
        dueDate: editTask.dueDate || '',
        instructions: editTask.instructions || '',
        notes: editTask.notes || '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [editTask, open]);

  if (!open) return null;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{isEditing ? '✏️ 編輯作業' : '➕ 新增作業'}</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Subject */}
            <div className="form-group">
              <label className="form-label">科目 *</label>
              <select
                className="form-select"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Task name */}
            <div className="form-group">
              <label className="form-label">作業名稱 *</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="例：設計 Open Claw 應用案例..."
                required
                autoFocus
              />
            </div>

            {/* Due date */}
            <div className="form-group">
              <label className="form-label">繳交期限</label>
              <input
                className="form-input"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            {/* Instructions */}
            <div className="form-group">
              <label className="form-label">說明 / 描述</label>
              <textarea
                className="form-textarea"
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                placeholder="描述作業要求、參考資料..."
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">個人備註</label>
              <input
                className="form-input"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="例：已完成 50%，需要觀看影片..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? '💾 儲存變更' : '✅ 新增作業'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
