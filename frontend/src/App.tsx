import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Login } from './pages/Login';
import Register from './pages/Register'; // <-- Add this
import { Habits } from './pages/Habits';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-secondary)',
        }}
      >
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

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
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
          <Route path="tasks" element={<Tasks />} />
          <Route path="habits" element={<Habits />} />
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