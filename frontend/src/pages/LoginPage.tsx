import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Building2, Crown, User2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [adminEmail, setAdminEmail] = useState('admin@smartcommute.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [employeeEmail, setEmployeeEmail] = useState('rahul@smartcommute.com');
  const [employeePassword, setEmployeePassword] = useState('user123');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showEmployeePass, setShowEmployeePass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setError(null);
    setLoadingAdmin(true);
    try {
      await login(adminEmail, adminPassword);
      navigate('/admin/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Invalid admin credentials');
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleEmployeeLogin = async () => {
    setError(null);
    setLoadingEmployee(true);
    try {
      await login(employeeEmail, employeePassword);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Invalid employee credentials');
    } finally {
      setLoadingEmployee(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <Building2 className="absolute -bottom-1 -right-1 h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">SmartCommute</h1>
            <p className="text-xs text-muted-foreground text-center">Office Travel Demand Generator – Demo Mode</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 mx-auto max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin card */}
          <div className="glass p-6 border border-purple-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-600/30 flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Admin Portal</h2>
                <p className="text-xs text-purple-200">Full analytics &amp; team management</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-muted/50 border-purple-500/40 h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <div className="relative">
                  <Input
                    type={showAdminPass ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-muted/50 border-purple-500/40 h-8 pr-8 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showAdminPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-9 text-xs font-semibold gradient-primary text-primary-foreground"
              disabled={loadingAdmin}
              type="button"
              onClick={handleAdminLogin}
            >
              {loadingAdmin ? 'Signing in…' : 'Login as Admin'}
            </Button>

            <ul className="mt-4 text-xs text-purple-100 space-y-1">
              <li>✓ Analytics Dashboard</li>
              <li>✓ Manage Requests</li>
              <li>✓ Export Reports</li>
              <li>✓ Office Management</li>
            </ul>
          </div>

          {/* Employee card */}
          <div className="glass p-6 border border-cyan-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-cyan-600/30 flex items-center justify-center">
                <User2 className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Employee Portal</h2>
                <p className="text-xs text-cyan-100">Book rides &amp; track your commute</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className="bg-muted/50 border-cyan-500/40 h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <div className="relative">
                  <Input
                    type={showEmployeePass ? 'text' : 'password'}
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                    className="bg-muted/50 border-cyan-500/40 h-8 pr-8 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmployeePass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showEmployeePass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-9 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
              disabled={loadingEmployee}
              type="button"
              onClick={handleEmployeeLogin}
            >
              {loadingEmployee ? 'Signing in…' : 'Login as Employee'}
            </Button>

            <ul className="mt-4 text-xs text-cyan-100 space-y-1">
              <li>✓ Request Rides</li>
              <li>✓ Join Carpools</li>
              <li>✓ Track Savings</li>
              <li>✓ View My Rides</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
