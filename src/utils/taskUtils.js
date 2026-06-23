import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, isPast, parseISO } from 'date-fns';

// ─── Priority logic ───────────────────────────────────────────────────────────
export function getPriority(dueDateStr) {
  if (!dueDateStr) return 'low';
  const due = parseISO(dueDateStr);
  const daysLeft = differenceInDays(due, new Date());
  if (daysLeft < 0)  return 'overdue';
  if (daysLeft <= 1) return 'urgent';
  if (daysLeft <= 3) return 'high';
  if (daysLeft <= 7) return 'medium';
  return 'low';
}

export function getDaysLeft(dueDateStr) {
  if (!dueDateStr) return null;
  const due = parseISO(dueDateStr);
  return differenceInDays(due, new Date());
}

export function getDaysLeftLabel(dueDateStr) {
  const days = getDaysLeft(dueDateStr);
  if (days === null) return '';
  if (days < 0)  return `逾期 ${Math.abs(days)} 天`;
  if (days === 0) return '今天！';
  if (days === 1) return '明天';
  return `還有 ${days} 天`;
}

export function getPriorityConfig(priority) {
  const configs = {
    overdue: { label: '已逾期',   badge: 'badge-red',    color: 'var(--accent-red)',    icon: '❌' },
    urgent:  { label: '緊急',     badge: 'badge-red',    color: 'var(--accent-red)',    icon: '🔴' },
    high:    { label: '優先度高', badge: 'badge-yellow', color: 'var(--accent-yellow)', icon: '🟡' },
    medium:  { label: '中等',     badge: 'badge-blue',   color: 'var(--accent-blue)',   icon: '🔵' },
    low:     { label: '低',       badge: 'badge-gray',   color: 'var(--text-muted)',    icon: '⚪' },
  };
  return configs[priority] || configs.low;
}

export function getStatusConfig(status) {
  const configs = {
    pending:     { label: '未完成',   badge: 'badge-gray',   icon: '○' },
    in_progress: { label: '進行中',   badge: 'badge-blue',   icon: '◑' },
    completed:   { label: '已完成',   badge: 'badge-green',  icon: '●' },
  };
  return configs[status] || configs.pending;
}

// ─── Sort tasks ───────────────────────────────────────────────────────────────
export function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}

// ─── Default task steps ───────────────────────────────────────────────────────
export function generateDefaultSteps(taskName) {
  return [
    { id: uuidv4(), text: '仔細閱讀作業說明', done: false },
    { id: uuidv4(), text: `觀看與「${taskName}」相關的影片／資料`, done: false },
    { id: uuidv4(), text: '列出大綱／草擬想法', done: false },
    { id: uuidv4(), text: '完成主要內容', done: false },
    { id: uuidv4(), text: '檢查格式與錯字', done: false },
    { id: uuidv4(), text: '轉換為 PDF 格式（如需要）', done: false },
    { id: uuidv4(), text: '上傳至系統繳交', done: false },
  ];
}

// ─── Sample seed data ─────────────────────────────────────────────────────────
export function getSeedTasks() {
  const today = new Date();
  const fmt = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: uuidv4(),
      subject: '人工智慧',
      name: '觀看第三章講義影片',
      dueDate: fmt(1),
      instructions: '在 LMS 系統上觀看講義影片，記錄重要概念。',
      status: 'in_progress',
      steps: generateDefaultSteps('觀看第三章講義影片'),
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      subject: '軟體工程',
      name: '設計 Open Claw 應用案例',
      dueDate: fmt(2),
      instructions: '設計一個使用 Open Claw 的應用案例，撰寫 Word 報告並上傳至 Moodle。',
      status: 'in_progress',
      steps: generateDefaultSteps('設計 Open Claw 應用案例'),
      documents: [],
      notes: '已完成 60%',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      subject: '資料庫',
      name: '整理 ERD 報告內容',
      dueDate: fmt(3),
      instructions: '繪製圖書館管理系統的 ERD 圖，並說明各關聯。',
      status: 'pending',
      steps: generateDefaultSteps('整理 ERD 報告內容'),
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      subject: '計算機網路',
      name: '檢查 Lab 5 格式',
      dueDate: fmt(4),
      instructions: '完成關於 TCP/IP 協定的 Lab 5 報告，繳交 PDF 檔。',
      status: 'pending',
      steps: generateDefaultSteps('檢查 Lab 5 格式'),
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      subject: '網頁程式設計',
      name: '繳交期末專題',
      dueDate: fmt(7),
      instructions: '繳交完整原始碼與報告，並與教授進行現場展示。',
      status: 'pending',
      steps: generateDefaultSteps('繳交期末專題'),
      documents: [],
      notes: '需完善後端部分',
      createdAt: new Date().toISOString(),
    },
  ];
}
