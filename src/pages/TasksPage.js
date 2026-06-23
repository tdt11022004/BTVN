import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import './TasksPage.css';

const STATUS_FILTERS = [
  { value: 'all',         label: '全部'   },
  { value: 'pending',     label: '未完成' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed',   label: '已完成' },
];

export default function TasksPage({ tasks, onAdd, onUpdate, onDelete, onStatusChange, openModal, setOpenModal }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [editTask, setEditTask] = useState(null);

  const subjects = ['all', ...new Set(tasks.map(t => t.subject))];

  const filtered = tasks.filter(t => {
    const matchStatus  = filterStatus === 'all'  || t.status === filterStatus;
    const matchSubject = filterSubject === 'all' || t.subject === filterSubject;
    return matchStatus && matchSubject;
  });

  function handleSave(form) {
    if (editTask) {
      onUpdate(editTask.id, form);
    } else {
      onAdd(form);
    }
    setEditTask(null);
  }

  function handleEdit(task) {
    setEditTask(task);
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
    setEditTask(null);
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>📋 作業</h1>
          <p>共 <strong style={{ color: 'var(--text-primary)' }}>{tasks.length}</strong> 件作業 · 顯示 <strong style={{ color: 'var(--accent-blue-light)' }}>{filtered.length}</strong> 件</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <div className="filter-group">
          <span className="filter-label">狀態：</span>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${filterStatus === f.value ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">科目：</span>
          <select
            className="form-select filter-select"
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s} value={s}>{s === 'all' ? '全部科目' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>沒有作業</h3>
          <p>變更篩選條件或新增作業以開始</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddTaskModal
        open={openModal}
        onClose={handleClose}
        onSave={handleSave}
        editTask={editTask}
      />
    </div>
  );
}
