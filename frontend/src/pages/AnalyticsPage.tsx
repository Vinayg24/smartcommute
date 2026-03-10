import { useState } from 'react';
import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, TrendingUp, Route, Users, Leaf } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PEAK_HOURS = [
  { hour: '7AM', count: 8 }, { hour: '8AM', count: 22 }, { hour: '9AM', count: 45 },
  { hour: '10AM', count: 30 }, { hour: '11AM', count: 15 }, { hour: '12PM', count: 10 },
  { hour: '1PM', count: 8 }, { hour: '2PM', count: 12 }, { hour: '3PM', count: 18 },
  { hour: '4PM', count: 25 }, { hour: '5PM', count: 38 }, { hour: '6PM', count: 42 },
  { hour: '7PM', count: 20 },
];

const DAILY_TREND = [
  { day: 'Mon', requests: 45 }, { day: 'Tue', requests: 52 }, { day: 'Wed', requests: 38 },
  { day: 'Thu', requests: 60 }, { day: 'Fri', requests: 55 }, { day: 'Sat', requests: 12 }, { day: 'Sun', requests: 5 },
];

const OFFICE_TRAFFIC = [
  { name: 'Head Office', value: 35 }, { name: 'Tech Hub', value: 30 },
  { name: 'Operations', value: 15 }, { name: 'South Branch', value: 10 }, { name: 'East Office', value: 10 },
];

const SHARING_RATIO = [
  { name: 'Shared', value: 68 }, { name: 'Solo', value: 32 },
];

const PIE_COLORS = ['hsl(239, 84%, 67%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(280, 70%, 60%)'];

const KPIs = [
  { label: '₹ Saved This Month', value: 124000, prefix: '₹', icon: TrendingUp },
  { label: 'CO2 Reduced', value: 342, suffix: ' kg', icon: Leaf },
  { label: 'Match Rate', value: 68, suffix: '%', icon: Users },
  { label: 'Most Popular Route', text: 'Delhi → Gurugram', icon: Route },
];

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <>
      <AppNavbar title="Analytics" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-muted/50 w-40 h-9 text-sm" />
          <span className="text-muted-foreground">to</span>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-muted/50 w-40 h-9 text-sm" />
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIs.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover>
                <kpi.icon className="h-5 w-5 text-primary mb-2" />
                {kpi.text ? (
                  <p className="text-xl font-bold text-foreground">{kpi.text}</p>
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={kpi.value!} prefix={kpi.prefix || ''} suffix={kpi.suffix || ''} />
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-bold text-foreground mb-4">Peak Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={PEAK_HOURS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(235, 20%, 25%)" />
                <XAxis dataKey="hour" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(235, 25%, 18%)', border: '1px solid hsl(235, 20%, 25%)', borderRadius: '8px', color: 'hsl(220, 20%, 95%)' }} />
                <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-foreground mb-4">Daily Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={DAILY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(235, 20%, 25%)" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(235, 25%, 18%)', border: '1px solid hsl(235, 20%, 25%)', borderRadius: '8px', color: 'hsl(220, 20%, 95%)' }} />
                <Line type="monotone" dataKey="requests" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(142, 71%, 45%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-foreground mb-4">Office Traffic</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={OFFICE_TRAFFIC} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {OFFICE_TRAFFIC.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(235, 25%, 18%)', border: '1px solid hsl(235, 20%, 25%)', borderRadius: '8px', color: 'hsl(220, 20%, 95%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-foreground mb-4">Sharing vs Solo</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={SHARING_RATIO} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={({ name, value }) => `${name}: ${value}%`}>
                  <Cell fill="hsl(142, 71%, 45%)" />
                  <Cell fill="hsl(239, 84%, 67%)" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(235, 25%, 18%)', border: '1px solid hsl(235, 20%, 25%)', borderRadius: '8px', color: 'hsl(220, 20%, 95%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
