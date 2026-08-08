import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DocsLayout } from '@/layouts/DocsLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

// Eagerly loaded: Home (critical path) + layouts
import { HomePage } from '@/pages/HomePage';
import { DocsHome } from '@/pages/DocsHome';
import { CategoryPage } from '@/pages/CategoryPage';
import { ArticlePage } from '@/pages/ArticlePage';

// Lazy loaded for code splitting
const RoadmapsPage = lazy(() => import('@/pages/RoadmapsPage').then((m) => ({ default: m.RoadmapsPage })));
const CheatSheetsPage = lazy(() => import('@/pages/CheatSheetsPage').then((m) => ({ default: m.CheatSheetsPage })));
const InterviewPage = lazy(() => import('@/pages/InterviewPage').then((m) => ({ default: m.InterviewPage })));
const ProgressPage = lazy(() => import('@/pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const UpdatePasswordPage = lazy(() => import('@/pages/UpdatePasswordPage').then((m) => ({ default: m.UpdatePasswordPage })));
const SignupPage = lazy(() => import('@/pages/SignupPage').then((m) => ({ default: m.SignupPage })));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function LazyFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LazyFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'docs',
        element: <DocsLayout />,
        children: [
          { index: true, element: <DocsHome /> },
          { path: ':category', element: <CategoryPage /> },
          { path: ':category/:slug', element: <ArticlePage /> },
        ],
      },
      { path: 'roadmaps', element: withSuspense(<RoadmapsPage />) },
      { path: 'cheatsheets', element: withSuspense(<CheatSheetsPage />) },
      { path: 'interview', element: withSuspense(<InterviewPage />) },
      { path: 'progress', element: withSuspense(<ProgressPage />) },
      { path: 'search', element: withSuspense(<SearchPage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
      {
        element: <AuthLayout />,
        children: [
          { path: 'auth/login', element: withSuspense(<LoginPage />) },
          { path: 'auth/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
          { path: 'auth/update-password', element: withSuspense(<UpdatePasswordPage />) },
          { path: 'auth/signup', element: withSuspense(<SignupPage />) },
          { path: 'auth/verify', element: withSuspense(<VerifyEmailPage />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
