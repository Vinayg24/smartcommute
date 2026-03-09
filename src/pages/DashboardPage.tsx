import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import CrowdMeter from '@/components/CrowdMeter';
import StatusBadge from '@/components/StatusBadge';
import { Car, Users, DollarSign, Leaf, Search, Download, ToggleLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// Mock data
const STATS = [
  { icon: Car, label: 'Total Requests Today', value: 47, prefix: '', emoji: '🚗' },
  { icon: Users, label: 'Active Ride Shares', value: 12, prefix: '', emoji: '👥' },
  { icon: DollarSign, label: 'Cost Saved', value: 8400, prefix: '₹', emoji: '💰' },
  { icon: Leaf, label: 'CO2 Reduced', value: 23.5, suffix: ' kg', decimals: 1, emoji: '🌱' },
];

const DEMAND_DATA = [
  { name: 'Rahul Sharma', from: 'Lajpat Nagar', office: 'Tech Hub', time: '9:00 AM', distance: '18 km', crowd: 'HIGH' as const, status: 'MATCHED' as const },
  { name: 'Priya Singh', from: 'Dwarka', office: 'Head Office', time: '10:30 AM', distance: '12 km', crowd: 'MEDIUM' as const, status: 'SOLO' as const },
  { name: 'Amit Kumar', from: 'Noida Sec 18', office: 'Operations', time: '9:30 AM', distance: '5 km', crowd: 'LOW' as const, status: 'MATCHED' as const },
  { name: 'Sneha Patel', from: 'Rohini', office: 'Tech Hub', time: '9:00 AM', distance: '28 km', crowd: 'HIGH' as const, status: 'PENDING' as const },
  { name: 'Vikram Das', from: 'Faridabad', office: 'South Branch', time: '11:00 AM', distance: '35 km', crowd: 'LOW' as const, status: 'SOLO' as const },
];

const CROWD_DATA = [
  { label: 'Head Office', percentage: 85 },
  { label: 'Tech Hub', percentage: 60 },
  { label: 'Operations', percentage: 25 },
  { label: 'South Branch', percentage: 15 },
  { label: 'East Office', percentage: 45 },
];

const MAP_EMPLOYEES = [
  { name: 'Rahul', dest: 'Tech Hub', x: 35, y: 40 },
  { name: 'Priya', dest: 'Head Office', x: 20, y: 55 },
  { name: 'Amit', dest: 'Operations', x: 70, y: 35 },
  { name: 'Sneha', dest: 'Tech Hub', x: 45, y: 70 },
  { name: 'Vikram', dest: 'South Branch', x: 60, y: 60 },
];

const MAP_OFFICES = [
  { name: 'Head Office', x: 30, y: 30 },
  { name: 'Tech Hub', x: 55, y: 25 },
  { name: 'Operations', x: 75, y: 50 },
];

const SHARING_GROUPS = [
  { members: ['Rahul', 'Sneha'], dest: 'Tech Hub', time: '9 AM' },
  { members: ['Amit', '2 others'], dest: 'Noida', time: '9:30 AM' },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [officeFilter, setOfficeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mapView, setMapView] = useState<'traffic' | 'routes' | 'employees'>('employees');

  const filtered = DEMAND_DATA.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (officeFilter !== 'all' && d.office !== officeFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <AppNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.emoji}</span>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} decimals={stat.decimals || 0} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Map + Crowd Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Placeholder Map */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">Live Travel Map</h3>
              <div className="flex gap-1">
                {(['traffic', 'routes', 'employees'] as const).map((v) => (
                  <Button key={v} size="sm" variant={mapView === v ? 'default' : 'ghost'} onClick={() => setMapView(v)}
                    className={mapView === v ? 'gradient-primary text-primary-foreground text-xs' : 'text-xs text-muted-foreground'}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            {/* Map placeholder */}
            <div className="relative h-72 rounded-lg bg-muted/30 border border-border overflow-hidden">
              {/* Dot grid */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              {/* Office markers */}
              {MAP_OFFICES.map((o) => (
                <motion.div key={o.name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                  className="absolute flex flex-col items-center" style={{ left: `${o.x}%`, top: `${o.y}%` }}>
                  <div className="h-4 w-4 rounded-sm bg-destructive border-2 border-destructive-foreground shadow-lg" />
                  <span className="text-[10px] text-foreground font-medium mt-1 whitespace-nowrap bg-card/80 px-1 rounded">{o.name}</span>
                </motion.div>
              ))}
              {/* Employee dots */}
              {MAP_EMPLOYEES.map((e, i) => (
                <motion.div key={e.name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="absolute flex flex-col items-center" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{e.name}</span>
                </motion.div>
              ))}
              {/* Sharing lines (SVG dashes) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="35%" y1="40%" x2="45%" y2="70%" stroke="hsl(142, 71%, 45%)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
              </svg>
            </div>
          </GlassCard>

          {/* Right Panel */}
          <div className="space-y-4">
            <GlassCard>
              <h3 className="font-bold text-foreground mb-4">Office Crowd Levels</h3>
              <div className="space-y-3">
                {CROWD_DATA.map((c) => <CrowdMeter key={c.label} {...c} />)}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-foreground mb-3">Sharing Groups</h3>
              <div className="space-y-2">
                {SHARING_GROUPS.map((g, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-muted/50 text-sm">
                    <p className="font-medium text-foreground">{g.members.join(' + ')}</p>
                    <p className="text-xs text-muted-foreground">→ {g.dest} at {g.time}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Demand Table */}
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-foreground text-lg">Demand Requests</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/50 w-40 h-9 text-sm" />
              </div>
              <Select value={officeFilter} onValueChange={setOfficeFilter}>
                <SelectTrigger className="w-32 h-9 bg-muted/50 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  <SelectItem value="Tech Hub">Tech Hub</SelectItem>
                  <SelectItem value="Head Office">Head Office</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="South Branch">South Branch</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-9 bg-muted/50 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="MATCHED">Matched</SelectItem>
                  <SelectItem value="SOLO">Solo</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Employee', 'From', 'Office', 'Time', 'Distance', 'Crowd', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <motion.tr key={d.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">{d.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.from}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.office}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.time}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.distance}</td>
                    <td className="py-3 px-3"><StatusBadge status={d.crowd} /></td>
                    <td className="py-3 px-3"><StatusBadge status={d.status} /></td>
                    <td className="py-3 px-3">
                      <Button size="sm" variant="ghost" className="text-primary text-xs h-7">View</Button>
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
