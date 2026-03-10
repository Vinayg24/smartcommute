import { useState } from 'react';
import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import StatusBadge from '@/components/StatusBadge';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, FileText, Activity, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
  department: string;
  status: 'active' | 'inactive';
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@sc.com', role: 'ADMIN', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Priya Singh', email: 'priya@sc.com', role: 'MANAGER', department: 'HR', status: 'active' },
  { id: '3', name: 'Amit Kumar', email: 'amit@sc.com', role: 'EMPLOYEE', department: 'Operations', status: 'active' },
  { id: '4', name: 'Sneha Patel', email: 'sneha@sc.com', role: 'EMPLOYEE', department: 'Engineering', status: 'active' },
  { id: '5', name: 'Vikram Das', email: 'vikram@sc.com', role: 'EMPLOYEE', department: 'Sales', status: 'inactive' },
  { id: '6', name: 'Ananya Gupta', email: 'ananya@sc.com', role: 'MANAGER', department: 'Finance', status: 'active' },
];

const SYSTEM_STATS = [
  { label: 'Total Employees', value: 156, icon: Users },
  { label: 'Total Requests', value: 1247, icon: FileText },
  { label: 'Active Today', value: 47, icon: Activity },
];

export default function AdminPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  const changeRole = (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: role as AdminUser['role'] } : u));
    toast.success('Role updated');
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast.success('User status updated');
  };

  return (
    <>
      <AppNavbar title="Admin Panel" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SYSTEM_STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover>
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={stat.value} /></p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <GlassCard>
          <h3 className="font-bold text-foreground text-lg mb-4">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['User', 'Department', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{u.department}</td>
                    <td className="py-3 px-3">
                      <Select value={u.role} onValueChange={(v) => changeRole(u.id, v)}>
                        <SelectTrigger className="w-28 h-8 text-xs bg-muted/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={u.status === 'active' ? 'CONFIRMED' : 'CANCELLED'} />
                    </td>
                    <td className="py-3 px-3">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(u.id)}
                        className={u.status === 'active' ? 'text-destructive hover:text-destructive text-xs' : 'text-success hover:text-success text-xs'}>
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
