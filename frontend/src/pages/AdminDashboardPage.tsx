import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, matchingAPI, officeAPI, travelAPI } from '@/services/api';
import GlassCard from '@/components/GlassCard';
import AppNavbar from '@/components/AppNavbar';
import AnimatedCounter from '@/components/AnimatedCounter';
import CrowdMeter from '@/components/CrowdMeter';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Download, Users, Car, Leaf, DollarSign } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#fbbf24',
  APPROVED: '#38bdf8',
  MATCHED: '#6366f1',
  COMPLETED: '#22c55e',
};

export default function AdminDashboardPage() {
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await analyticsAPI.getDashboard();
      return res.data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const res = await travelAPI.getAll();
      return res.data;
    },
  });

  const { data: offices = [] } = useQuery({
    queryKey: ['admin-offices'],
    queryFn: async () => {
      const res = await officeAPI.getAll();
      return res.data;
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: async () => {
      const res = await matchingAPI.getGroups();
      return res.data;
    },
  });

  const requestsByOffice = analytics?.requestsByOffice ?? [];
  const statusBreakdown = analytics?.statusBreakdown ?? [];
  const officeCrowd = analytics?.officeCrowd ?? [];

  const latestRequests = useMemo(
    () => (requests as any[]).slice(0, 30),
    [requests],
  );

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

  return (
    <>
      <AppNavbar title="Admin Analytics" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Requests Today</span>
              <Car className="h-4 w-4 text-primary" />
            </div>
            <AnimatedCounter
              value={analytics?.totalRequestsToday ?? 0}
              className="text-2xl font-bold text-foreground"
            />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Active Ride Shares</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <AnimatedCounter
              value={analytics?.activeRideShares ?? 0}
              className="text-2xl font-bold text-foreground"
            />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Cost Saved (₹)</span>
              <DollarSign className="h-4 w-4 text-amber-300" />
            </div>
            <AnimatedCounter
              value={analytics?.costSaved ?? 0}
              prefix="₹"
              className="text-2xl font-bold text-foreground"
            />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">CO₂ Reduced (kg)</span>
              <Leaf className="h-4 w-4 text-emerald-400" />
            </div>
            <AnimatedCounter
              value={analytics?.co2Reduced ?? 0}
              suffix=" kg"
              decimals={1}
              className="text-2xl font-bold text-foreground"
            />
          </GlassCard>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Daily Demand (14 days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.dailyStats ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272f" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#6366f1"
                    dot={false}
                    name="Requests"
                  />
                  <Line
                    type="monotone"
                    dataKey="matches"
                    stroke="#22c55e"
                    dot={false}
                    name="Matches"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Status Breakdown
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {statusBreakdown.map((entry: any, index: number) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.status] ?? '#4b5563'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Requests by office & crowd */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Requests by Office
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByOffice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272f" />
                  <XAxis dataKey="office" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Office Crowd Levels
            </h3>
            <div className="space-y-3">
              {officeCrowd.map((c: any) => {
                const office = offices.find((o: any) => o.id === c.officeId);
                return (
                  <div
                    key={c.officeId}
                    className="flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {office?.name ?? 'Office'}
                      </p>
                      <p className="text-muted-foreground">
                        {c.count} commuters • {c.percentage}%
                      </p>
                    </div>
                    <CrowdMeter label={c.level} percentage={c.percentage} />
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Sharing groups */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Active Sharing Groups
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.map((g: any) => (
              <div
                key={g.id}
                className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">
                    {g.office?.name ?? 'Office'}
                  </p>
                  <StatusBadge status={g.status === 'ACTIVE' ? 'MATCHED' : 'COMPLETED'} />
                </div>
                <p className="text-[11px] text-muted-foreground">{g.route}</p>
                <div className="flex -space-x-2 mt-1">
                  {g.memberDetails?.map((m: any) => (
                    <div
                      key={m.id}
                      className="h-6 w-6 rounded-full bg-primary/20 border border-border flex items-center justify-center text-[10px] text-primary-foreground"
                    >
                      {m.name
                        .split(' ')
                        .map((p: string) => p[0])
                        .join('')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Requests table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Demand Requests
            </h3>
            <Button
              type="button"
              onClick={handleExportCSV}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60">
                  {[
                    'Employee',
                    'From',
                    'Office',
                    'Date',
                    'Time',
                    'Distance',
                    'Crowd',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-2 text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestRequests.map((r: any) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/40 hover:bg-muted/30"
                  >
                    <td className="py-2 px-2 text-foreground">
                      {r.employee?.name ?? '-'}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">{r.from}</td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {r.office?.name ?? '-'}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">{r.date}</td>
                    <td className="py-2 px-2 text-muted-foreground">{r.time}</td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {r.distance.toFixed(1)} km
                    </td>
                    <td className="py-2 px-2">
                      <StatusBadge status={r.crowd} />
                    </td>
                    <td className="py-2 px-2">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

