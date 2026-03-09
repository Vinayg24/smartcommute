import { useTheme } from '@/contexts/ThemeContext';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar({ title }: { title: string }) {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shrink-0">
      <h1 className="text-lg font-bold text-foreground ml-12 lg:ml-0">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <NotificationDropdown />
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80">
                <UserAvatar name={user.name} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuItem className="text-foreground">{user.name}</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground text-xs">{user.email}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
