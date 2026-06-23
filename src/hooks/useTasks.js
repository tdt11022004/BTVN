import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getSeedTasks, sortTasksByDueDate, generateDefaultSteps } from '../utils/taskUtils';

const STORAGE_KEY = 'tdtapp_tasks';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First time: load seed data
  const seed = getSeedTasks();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((formData) => {
    const newTask = {
      id: uuidv4(),
      subject: formData.subject || 'Môn học khác',
      name: formData.name,
      dueDate: formData.dueDate || null,
      instructions: formData.instructions || '',
      status: 'pending',
      steps: generateDefaultSteps(formData.name),
      documents: [],
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => sortTasksByDueDate([...prev, newTask]));
    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTaskStatus = useCallback((id, status) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status } : t)
    );
  }, []);

  const toggleStep = useCallback((taskId, stepId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s) }
          : t
      )
    );
  }, []);

  const addStep = useCallback((taskId, text) => {
    const newStep = { id: uuidv4(), text, done: false };
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, steps: [...t.steps, newStep] } : t
      )
    );
  }, []);

  const deleteStep = useCallback((taskId, stepId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, steps: t.steps.filter(s => s.id !== stepId) } : t
      )
    );
  }, []);

  // Derived stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    subjects: [...new Set(tasks.map(t => t.subject))],
  };

  return {
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleStep,
    addStep,
    deleteStep,
  };
}
