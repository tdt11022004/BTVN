import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TodoPage from './pages/TodoPage';
import DocumentsPage from './pages/DocumentsPage';
import NotesPage from './pages/NotesPage';
import ImportPage from './pages/ImportPage';
import { useTasks } from './hooks/useTasks';

// ─── Auto-detect ?import= param on any page ───────────────────────────────
function ImportRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('import') && location.pathname !== '/import') {
      navigate(`/import${location.search}`);
    }
  }, [location, navigate]);

  return null;
}

// ─── Layout wrapper ───────────────────────────────────────────────────────
function AppLayout({ children, onAddTask, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isImportPage = location.pathname === '/import';

  if (isImportPage) return <>{children}</>;

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          onAddTask={onAddTask}
          onMenuToggle={() => setSidebarOpen(v => !v)}
        />
        <main>{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────
export default function App() {
  const {
    tasks, stats,
    addTask, updateTask, deleteTask, updateTaskStatus,
    toggleStep, addStep, deleteStep,
  } = useTasks();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <ImportRedirect />
      <AppLayout
        onAddTask={() => setTaskModalOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <Routes>
          <Route path="/" element={<DashboardPage tasks={tasks} stats={stats} />} />
          <Route path="/tasks" element={
            <TasksPage
              tasks={tasks}
              onAdd={addTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStatusChange={updateTaskStatus}
              openModal={taskModalOpen}
              setOpenModal={setTaskModalOpen}
            />
          } />
          <Route path="/todo" element={
            <TodoPage
              tasks={tasks}
              onToggleStep={toggleStep}
              onAddStep={addStep}
              onDeleteStep={deleteStep}
            />
          } />
          <Route path="/documents" element={<DocumentsPage tasks={tasks} />} />
          <Route path="/notes" element={<NotesPage tasks={tasks} />} />

          {/* Open Claw import route */}
          <Route path="/import" element={
            <ImportPage onImport={addTask} />
          } />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
