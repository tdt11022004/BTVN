import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './TodoPage.css';

export default function TodoPage({ tasks, onToggleStep, onAddStep, onDeleteStep }) {
  const [newStepText, setNewStepText] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);

  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.steps?.length > 0);

  function handleAddStep(taskId) {
    const text = (newStepText[taskId] || '').trim();
    if (!text) return;
    onAddStep(taskId, text);
    setNewStepText(prev => ({ ...prev, [taskId]: '' }));
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>✅ 待辦清單</h1>
          <p>各作業需完成的步驟清單</p>
        </div>
      </div>

      {activeTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>太棒了！沒有待辦事項了</h3>
          <p>新增作業或將未完成的作業標記為進行中，以查看待辦清單</p>
        </div>
      ) : (
        <div className="todo-list">
          {activeTasks.map(task => {
            const done = task.steps.filter(s => s.done).length;
            const total = task.steps.length;
            const pct = Math.round((done / total) * 100);
            const isExpanded = expandedTask === task.id || expandedTask === null;

            return (
              <div key={task.id} className="todo-task-block">
                {/* Task header */}
                <div
                  className="todo-task-header"
                  onClick={() => setExpandedTask(prev => prev === task.id ? null : task.id)}
                >
                  <div className="todo-task-info">
                    <span className="todo-task-subject">{task.subject}</span>
                    <h3 className="todo-task-name">{task.name}</h3>
                  </div>
                  <div className="todo-task-progress-wrap">
                    <div className="todo-progress-bar">
                      <div className="todo-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="todo-progress-text">{done}/{total}</span>
                    <span className="todo-collapse-arrow">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Steps */}
                {isExpanded && (
                  <div className="todo-steps">
                    {task.steps.map((step, idx) => (
                      <div key={step.id} className={`todo-step ${step.done ? 'todo-step--done' : ''}`}>
                        <button
                          className="todo-step-check"
                          onClick={() => onToggleStep(task.id, step.id)}
                        >
                          {step.done ? '✅' : '○'}
                        </button>
                        <span className="todo-step-num">{idx + 1}.</span>
                        <span className="todo-step-text">{step.text}</span>
                        <button
                          className="todo-step-delete"
                          onClick={() => onDeleteStep(task.id, step.id)}
                          title="刪除此步驟"
                        >✕</button>
                      </div>
                    ))}

                    {/* Add step */}
                    <div className="todo-add-step">
                      <input
                        className="form-input"
                        placeholder="新增步驟..."
                        value={newStepText[task.id] || ''}
                        onChange={e => setNewStepText(prev => ({ ...prev, [task.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddStep(task.id)}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddStep(task.id)}
                      >＋ 新增</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
