import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import CrowdMeter from '@/components/CrowdMeter';
import StatusBadge from '@/components/StatusBadge';
import { Car, Users, DollarSign, Leaf, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsAPI, matchingAPI, officeAPI, travelAPI } from '@/services/api';
import RouteMap from '@/components/RouteMap';

// ─── LOADING SKELETON ───────────────────────────────────────
const StatSkeleton = () => (
  <div className="animate-pulse">
    <GlassCard>
      <div className="h-4 bg-muted rounded w-1/2 mb-3" />
      <div className="h-8 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-full" />
    </GlassCard>
  </div>
);

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <tr key={i} className="border-b border-border/50">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
          <td key={j} className="py-3 px-3">
            <div className="animate-pulse h-4 bg-muted rounded w-20" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ─── MAP EMPLOYEES & OFFICES (from real data) ───────────────
const MAP_POSITIONS = [
  { x: 35, y: 40 }, { x: 20, y: 55 },
  { x: 70, y: 35 }, { x: 45, y: 70 },
  { x: 60, y: 60 },
];

const OFFICE_POSITIONS = [
  { x: 30, y: 30 }, { x: 55, y: 25 },
  { x: 75, y: 50 }, { x: 40, y: 65 },
  { x: 65, y: 45 },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [officeFilter, setOfficeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    data: analytics,
  } = useQuery({
    queryKey: ['personal-analytics'],
    queryFn: async () => {
      const res = await analyticsAPI.getDashboard();
      return res.data;
    },
  });

  const {
    data: myRequests = [],
  } = useQuery({
    queryKey: ['travel-mine', user?.id],
    queryFn: async () => {
      const res = await travelAPI.getMine(user?.id);
      return res.data as any[];
    },
    enabled: Boolean(user?.id),
  });

  const {
    data: offices = [],
  } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const res = await officeAPI.getAll();
      return res.data;
    },
  });

  const {
    data: groups = [],
  } = useQuery({
    queryKey: ['sharing-groups'],
    queryFn: async () => {
      const res = await matchingAPI.getGroups();
      return res.data as any[];
    },
  });

  const myGroups = useMemo(
    () =>
      (groups as any[]).filter((g) =>
        g.members?.includes(user?.id) ||
        g.memberDetails?.some((m: any) => m?.id === user?.id),
      ),
    [groups, user?.id],
  );

  const myRequestsThisWeek = myRequests.length;
  const myRidesMatched = myRequests.filter((r: any) => r.status === 'MATCHED').length;
  const myCostSaved = myRequests.reduce(
    (sum: number, r: any) => sum + (r.costSaved || 0),
    0,
  );

  const STATS = [
    {
      icon: Car,
      label: 'My Requests This Week',
      value: myRequestsThisWeek,
      prefix: '',
      suffix: '',
      decimals: 0,
      emoji: '🚗',
    },
    {
      icon: Users,
      label: 'Rides Matched',
      value: myRidesMatched,
      prefix: '',
      suffix: '',
      decimals: 0,
      emoji: '👥',
    },
    {
      icon: DollarSign,
      label: 'My Cost Saved',
      value: myCostSaved,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      emoji: '💰',
    },
    {
      icon: Leaf,
      label: 'CO₂ Reduced',
      value: myRequests.reduce(
        (sum: number, r: any) => sum + (r.co2Reduced || 0),
        0,
      ),
      prefix: '',
      suffix: ' kg',
      decimals: 1,
      emoji: '🌱',
    },
  ];

  // ── Crowd Data from mock analytics ─────────────────────────
  const CROWD_DATA =
    analytics?.officeCrowd?.map((c: any) => ({
      label: offices.find((o: any) => o.id === c.officeId)?.name ?? 'Office',
      percentage: c.percentage,
    })) ?? [];

  // ── Filter travel requests ────────────────────────────────
  const filtered = myRequests.filter((d: any) => {
    const employeeName = d.employee?.name ?? '';
    const officeName = d.office?.name ?? '';
    if (search && !employeeName.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (officeFilter !== 'all' && officeName !== officeFilter)
      return false;
    if (statusFilter !== 'all' && d.booking_status !== statusFilter)
      return false;
    return true;
  });

  // ── CSV Export ────────────────────────────────────────────
  const handleExportCSV = async () => {
    const res = await analyticsAPI.exportCSV();
    const blob = res.data as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartcommute_requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const recent = filtered.slice(0, 3);

  const [formOffice, setFormOffice] = useState<string>('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formFrom, setFormFrom] = useState('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formOffice || !formDate || !formTime || !formFrom) return;
    await travelAPI.submit({
      employeeId: user.id,
      officeId: formOffice,
      from: formFrom,
      date: formDate,
      time: formTime,
    });
    await qc.invalidateQueries({ queryKey: ['travel-mine', user.id] });
    setSubmitMessage('Request submitted!');
    setTimeout(() => setSubmitMessage(null), 2000);
    setFormFrom('');
  };

  // ── Format time ──────────────────────────────────────────
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <AppNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {greeting}, {user?.name} 👋
          </h2>
          <p className="text-xs text-muted-foreground">
            Live view of your commute and ride shares
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.emoji}</span>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* ── Map + Crowd Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Static route map */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">Commute Overview</h3>
            </div>
            <RouteMap />
          </GlassCard>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Crowd Meters */}
            <GlassCard>
              <h3 className="font-bold text-foreground mb-4">
                Office Crowd Levels
              </h3>
              <div className="space-y-3">
                {CROWD_DATA.length > 0
                  ? CROWD_DATA.map((c: any) => (
                      <CrowdMeter key={c.label} {...c} />
                    ))
                  : offices.map((_: any, i: number) => (
                      <div
                        key={i}
                        className="animate-pulse h-8 bg-muted rounded"
                      />
                    ))}
              </div>
            </GlassCard>

            {/* Sharing Groups */}
            <GlassCard>
              <h3 className="font-bold text-foreground mb-3">
                Sharing Groups
              </h3>
              <div className="space-y-2">
                {(myGroups.length > 0 ? myGroups : groups)
                  .slice(0, 5)
                  .map((g: any, i: number) => (
                    <div
                      key={g.id ?? i}
                      className="p-2.5 rounded-lg bg-muted/50 text-sm"
                    >
                      <p className="font-medium text-foreground">
                        {(g.memberDetails?.length ?? g.members?.length ?? 0)} members sharing
                      </p>
                      <p className="text-xs text-muted-foreground">
                        → {g.office?.name ?? 'Office'} • {g.date ?? ''}
                      </p>
                      <span
                        className={`text-xs font-medium ${
                          g.status === 'CONFIRMED'
                            ? 'text-green-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ── Demand Table ── */}
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-foreground text-lg">
              Demand Requests
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/50 w-40 h-9 text-sm"
                />
              </div>

              {/* Office Filter */}
              <Select value={officeFilter} onValueChange={setOfficeFilter}>
                <SelectTrigger className="w-32 h-9 bg-muted/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices.map((o: any) => (
                    <SelectItem key={o.id} value={o.name}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-9 bg-muted/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="MATCHED">Matched</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Export CSV */}
              <Button
                className="h-9 px-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-1.5"
                onClick={handleExportCSV}
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    'Employee',
                    'From',
                    'Office',
                    'Time',
                    'Distance',
                    'Crowd',
                    'Status',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <TableSkeleton />
                ) : (
                  filtered.map((d: any, i: number) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-3 font-medium text-foreground">
                        {d.employee?.name ?? '-'}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {d.from_location ?? '-'}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {d.office?.name ?? '-'}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {formatTime(d.travel_time)}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {d.distance_km ? `${d.distance_km} km` : '-'}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={d.crowd_level} />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={d.booking_status} />
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          className="h-7 px-2 rounded-md text-primary text-xs hover:bg-muted/50"
                        >
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* No error banner in demo mode */}
        </GlassCard>
      </div>
    </>
  );
}