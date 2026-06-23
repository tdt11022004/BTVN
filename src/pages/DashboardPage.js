import React from 'react';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getPriority, getPriorityConfig, getStatusConfig, getDaysLeftLabel, sortTasksByDueDate } from '../utils/taskUtils';
import './DashboardPage.css';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <span className="stat-card-value" style={{ color }}>{value}</span>
        <span className="stat-card-label">{label}</span>
        {sub && <span className="stat-card-sub">{sub}</span>}
      </div>
    </div>
  );
}

function AlertBanner({ tasks }) {
  const urgent = tasks.filter(t => {
    const p = getPriority(t.dueDate);
    return (p === 'urgent' || p === 'overdue') && t.status !== 'completed';
  });

  if (urgent.length === 0) return null;

  return (
    <div className="alert-banner">
      <span className="alert-banner-icon">🚨</span>
      <span className="alert-banner-text">
        您有 <strong>{urgent.length}</strong> 件作業需要立即處理！
        {urgent.map(t => ` 「${t.name}」`).join('、')}
      </span>
    </div>
  );
}

export default function DashboardPage({ tasks, stats }) {
  const sorted = sortTasksByDueDate(tasks.filter(t => t.status !== 'completed'));
  const topPriority = sorted.slice(0, 5);

  // Week schedule table
  const weekDays = ['週一', '週二', '週三', '週四', '週五'];
  const weekTasks = sorted.slice(0, 5);

  return (
    <div className="page-container animate-fade-in">
      {/* Alert */}
      <AlertBanner tasks={tasks} />

      {/* Stats row */}
      <div className="dashboard-stats">
        <StatCard icon="📋" label="作業總數"   value={stats.total}      color="var(--accent-blue)"   />
        <StatCard icon="🔴" label="未完成"     value={stats.pending}    color="var(--accent-yellow)" />
        <StatCard icon="⚡" label="進行中"     value={stats.inProgress} color="var(--accent-orange)" />
        <StatCard icon="✅" label="已完成"     value={stats.completed}  color="var(--accent-green)"  />
      </div>

      <div className="dashboard-body">
        {/* Priority tasks */}
        <div className="dashboard-section">
          <h2 className="section-title">🔥 最高優先度</h2>
          {topPriority.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-state-icon">🎉</div>
              <h3>太棒了！目前沒有待完成的作業</h3>
            </div>
          ) : (
            <div className="priority-list">
              {topPriority.map((task, i) => {
                const priority = getPriority(task.dueDate);
                const prioConfig = getPriorityConfig(priority);
                const statusConfig = getStatusConfig(task.status);
                const daysLabel = getDaysLeftLabel(task.dueDate);
                return (
                  <div key={task.id} className="priority-item">
                    <span className="priority-rank">{i + 1}</span>
                    <div className="priority-info">
                      <span className="priority-subject">{task.subject}</span>
                      <span className="priority-name">{task.name}</span>
                    </div>
                    <div className="priority-meta">
                      <span className={`badge ${prioConfig.badge}`}>{prioConfig.icon} {daysLabel}</span>
                      <span className={`badge ${statusConfig.badge}`}>{statusConfig.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Week schedule table */}
        <div className="dashboard-section">
          <h2 className="section-title">📅 本週行程</h2>
          <div className="week-table-wrap">
            <table className="week-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>任務內容</th>
                  <th>科目</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {weekDays.map((day, i) => {
                  const task = weekTasks[i];
                  const statusConfig = task ? getStatusConfig(task.status) : null;
                  return (
                    <tr key={day}>
                      <td className="week-day">{day}</td>
                      <td className="week-task">{task ? task.name : <span className="text-muted">—</span>}</td>
                      <td>{task ? <span className="badge badge-blue">{task.subject}</span> : '—'}</td>
                      <td>{task ? <span className={`badge ${statusConfig.badge}`}>{statusConfig.label}</span> : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="week-table-note">* 顯示最近 5 件未完成且最快到期的作業</p>
        </div>
      </div>

      {/* Subjects breakdown */}
      <div className="dashboard-section">
        <h2 className="section-title">📚 依科目分類</h2>
        <div className="subjects-grid">
          {stats.subjects.map(subject => {
            const subTasks = tasks.filter(t => t.subject === subject);
            const done = subTasks.filter(t => t.status === 'completed').length;
            const pct = subTasks.length > 0 ? Math.round((done / subTasks.length) * 100) : 0;
            return (
              <div key={subject} className="subject-card">
                <div className="subject-card-header">
                  <span className="subject-name">{subject}</span>
                  <span className="subject-count">{done}/{subTasks.length}</span>
                </div>
                <div className="subject-bar">
                  <div className="subject-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="subject-pct">{pct}% 已完成</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
