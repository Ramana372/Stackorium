import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
}
