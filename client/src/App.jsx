import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatternsPage from './pages/PatternsPage';
import ProblemsPage from './pages/ProblemsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <UserDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/patterns" element={
            <ProtectedRoute>
              <AppLayout>
                <PatternsPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/problems" element={
            <ProtectedRoute>
              <AppLayout>
                <ProblemsPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/submissions" element={
            <ProtectedRoute>
              <AppLayout>
                <SubmissionsPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
