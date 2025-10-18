'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Palette, Camera, Code, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { clearAdminSession } from '@/lib/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FileText, label: 'Paper Presentation', href: '/admin/dashboard/paper-presentation' },
  { icon: Palette, label: 'Web Designing', href: '/admin/dashboard/web-designing' },
  { icon: Camera, label: 'Reels', href: '/admin/dashboard/reels' },
  { icon: Camera, label: 'Photography', href: '/admin/dashboard/photography' },
  { icon: Code, label: 'Code Debugging', href: '/admin/dashboard/code-debugging' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin');
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">ELOQUENCE'25</h2>
        <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
