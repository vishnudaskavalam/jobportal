import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/user/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminJobsListPage from '../pages/admin/AdminJobsListPage';
import AdminJobFormPage from '../pages/admin/AdminJobFormPage';
import AdminJobDetailsPage from '../pages/admin/AdminJobDetailsPage';
import JobsPage from '../pages/user/JobsPage';
import JobDetailsPage from '../pages/user/JobDetailsPage';
import AuthLayout from '../componets/layout/AuthLayout';
import AdminLayout from '../componets/layout/AdminLayout';
import UserLayout from '../componets/layout/UserLayout';

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/jobs",
        element: <JobsPage />
      },
      {
        path: "/jobs/:id",
        element: <JobDetailsPage />
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignupPage />
      }
    ]
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardPage />
      },
      {
        path: "/admin/jobs",
        element: <AdminJobsListPage />
      },
      {
        path: "/admin/jobs/new",
        element: <AdminJobFormPage />
      },
      {
        path: "/admin/jobs/:id/edit",
        element: <AdminJobFormPage />
      },
      {
        path: "/admin/jobs/:id",
        element: <AdminJobDetailsPage />
      }
    ]
  }
]);