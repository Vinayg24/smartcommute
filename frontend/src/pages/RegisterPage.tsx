import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Car, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';

const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Operations', 'Finance'];

function PasswordStrength({ password }: { password: string }) {
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const colors = ['bg-destructive', 'bg-warning', 'bg-warning', 'bg-success'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? colors[strength - 1] : 'bg-muted'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength - 1] || 'Too short'}</p>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', employeeId: '', email: '', phone: '', department: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) { toast.error('Please fill all fields'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await authAPI.register({
        name: form.name,
        employee_id: form.employeeId,
        email: form.email,
        phone: form.phone,
        department: form.department,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 w-full max-w-lg relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center relative">
            <Car className="h-6 w-6 text-primary-foreground" />
            <Building2 className="absolute -bottom-1 -right-1 h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">SmartCommute</h1>
            <p className="text-xs text-muted-foreground">Create your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input placeholder="Rahul Sharma" value={form.name} onChange={(e) => update('name', e.target.value)} className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label>Employee ID</Label>
              <Input placeholder="EMP001" value={form.employeeId} onChange={(e) => update('employeeId', e.target.value)} className="bg-muted/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="you@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="bg-muted/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => update('department', v)}>
              <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} className="bg-muted/50 pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="bg-muted/50" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground font-semibold h-11">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
