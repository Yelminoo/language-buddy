import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VocabularyPage from './pages/VocabularyPage';
import RoadmapPage from './pages/RoadmapPage';
import LevelPage from './pages/LevelPage';
import ResourcesPage from './pages/ResourcesPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#4f46e5' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><DashboardPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="/vocabulary" element={
            <PrivateRoute>
              <Layout><VocabularyPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="/roadmap" element={
            <PrivateRoute>
              <Layout><RoadmapPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="/roadmap/:code" element={
            <PrivateRoute>
              <Layout><LevelPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="/resources" element={
            <PrivateRoute>
              <Layout><ResourcesPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
