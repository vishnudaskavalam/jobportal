import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminJobsListPage from '../pages/admin/AdminJobsListPage';
import AdminJobFormPage from '../pages/admin/AdminJobFormPage';
import JobsPage from '../pages/JobsPage';
import JobDetailsPage from '../pages/JobDetailsPage';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/login" element={<LoginPage onNavigateToHome={() => { }} />} />
      <Route path="/signup" element={<SignupPage onNavigateToHome={() => { }} />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/jobs" element={<AdminJobsListPage />} />
      <Route path="/admin/jobs/new" element={<AdminJobFormPage />} />
      <Route path="/admin/jobs/:id/edit" element={<AdminJobFormPage />} />
    </Routes>
  );
}