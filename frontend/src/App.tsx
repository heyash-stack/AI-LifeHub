import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        Loading session...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<div style={{ color: 'var(--text-primary)' }}>Tasks Module (Coming Soon)</div>} />
          <Route path="habits" element={<div style={{ color: 'var(--text-primary)' }}>Habits Module (Coming Soon)</div>} />
          <Route path="chat" element={<div style={{ color: 'var(--text-primary)' }}>AI Assistant Module (Coming Soon)</div>} />
          <Route path="journal" element={<div style={{ color: 'var(--text-primary)' }}>Journal Module (Coming Soon)</div>} />
          <Route path="analytics" element={<div style={{ color: 'var(--text-primary)' }}>Analytics Module (Coming Soon)</div>} />
          <Route path="settings" element={<div style={{ color: 'var(--text-primary)' }}>Settings Module (Coming Soon)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
