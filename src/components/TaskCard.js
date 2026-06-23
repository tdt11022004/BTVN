import React from 'react';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getPriority, getPriorityConfig, getStatusConfig, getDaysLeftLabel } from '../utils/taskUtils';
import './TaskCard.css';

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const priority = getPriority(task.dueDate);
  const prioConfig = getPriorityConfig(priority);
  const statusConfig = getStatusConfig(task.status);
  const daysLabel = getDaysLeftLabel(task.dueDate);

  const completedSteps = task.steps?.filter(s => s.done).length || 0;
  const totalSteps = task.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  function handleStatusCycle() {
    const cycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    onStatusChange(task.id, cycle[task.status]);
  }

  const dueDateFormatted = task.dueDate
    ? format(parseISO(task.dueDate), "dd/MM/yyyy (EEEE)", { locale: zhTW })
    : '尚未設定期限';

  return (
    <div className={`task-card ${priority === 'overdue' ? 'task-card--overdue' : ''} ${task.status === 'completed' ? 'task-card--completed' : ''}`}>
      {/* Priority strip */}
      <div className="task-card-strip" style={{ background: prioConfig.color }} />

      <div className="task-card-body">
        {/* Top row */}
        <div className="task-card-top">
          <span className="task-card-subject">{task.subject}</span>
          <div className="task-card-actions">
            <button className="btn btn-icon btn-secondary" onClick={() => onEdit(task)} title="編輯">✏️</button>
            <button className="btn btn-icon btn-danger" onClick={() => onDelete(task.id)} title="刪除">🗑️</button>
          </div>
        </div>

        {/* Name */}
        <h3 className="task-card-name">{task.name}</h3>

        {/* Instructions */}
        {task.instructions && (
          <p className="task-card-instructions">{task.instructions}</p>
        )}

        {/* Progress bar */}
        {totalSteps > 0 && (
          <div className="task-card-progress">
            <div className="task-progress-bar">
              <div className="task-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="task-progress-label">{completedSteps}/{totalSteps} 步驟</span>
          </div>
        )}

        {/* Footer */}
        <div className="task-card-footer">
          <div className="task-card-meta">
            <span className={`badge ${prioConfig.badge}`}>{prioConfig.icon} {prioConfig.label}</span>
            <span className="task-card-due" title={dueDateFormatted}>
              📅 {daysLabel || dueDateFormatted}
            </span>
          </div>

          <button
            className={`task-card-status-btn badge ${statusConfig.badge}`}
            onClick={handleStatusCycle}
            title="點擊以變更狀態"
          >
            {statusConfig.icon} {statusConfig.label}
          </button>
        </div>
      </div>
    </div>
  );
}
