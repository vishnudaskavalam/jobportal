import { createBrowserRouter } from 'react-router-dom';
import {
  HomePage,
  LoginPage,
  SignupPage,
  AdminDashboardPage,
  AdminJobsListPage,
  AdminJobFormPage,
  AdminJobDetailsPage,
  JobsPage,
  JobDetailsPage
} from '@pages';
import { AuthLayout, AdminLayout, UserLayout } from '@components';

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