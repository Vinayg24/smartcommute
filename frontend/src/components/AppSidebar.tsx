import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import StatusBadge from '@/components/StatusBadge';
import {
  LayoutDashboard, PlusCircle, Car, BarChart3, Building2, Shield, LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['EMPLOYEE', 'ADMIN'] },
  { to: '/new-request', icon: PlusCircle, label: 'New Request', roles: ['EMPLOYEE', 'ADMIN'] },
  { to: '/my-rides', icon: Car, label: 'My Rides', roles: ['EMPLOYEE', 'ADMIN'] },
  { to: '/offices', icon: Building2, label: 'Offices', roles: ['EMPLOYEE', 'ADMIN'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['ADMIN'] },
  { to: '/admin', icon: Shield, label: 'Admin', roles: ['ADMIN'] },
];

export default function AppSidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fix: check user.role directly — isManager may not exist in mock auth
  const filtered = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">SmartCommute</h2>
            <p className="text-xs text-muted-foreground">Demand Generator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {filtered.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'gradient-primary text-primary-foreground shadow-lg glow-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <UserAvatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              {/* Show role badge clearly */}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                user.role === 'ADMIN'
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-blue-500/20 text-blue-300"
              )}>
                {user.role === 'ADMIN' ? '👑 ADMIN' : '👤 EMPLOYEE'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full px-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 min-h-screen bg-sidebar border-r border-sidebar-border shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar z-50 lg:hidden border-r border-sidebar-border"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}