import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { matchingAPI } from '@/services/api';

export default function MyRidesPage() {
  const { user } = useAuth();

  const { data: groups = [] } = useQuery({
    queryKey: ['my-groups', user?.id],
    queryFn: async () => {
      const res = await matchingAPI.getGroups();
      return res.data as any[];
    },
    enabled: Boolean(user?.id),
  });

  const myGroups =
    (groups as any[]).filter(
      (g) =>
        g.members?.includes(user?.id) ||
        g.memberDetails?.some((m: any) => m?.id === user?.id),
    ) || groups;

  const visible = myGroups.length > 0 ? myGroups : groups;

  return (
    <>
      <AppNavbar title="My Rides" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {visible.map((g: any, i: number) => (
            <motion.div
              key={g.id ?? i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">
                        {g.office?.name ?? 'Office'}
                      </h3>
                      <StatusBadge
                        status={g.status === 'ACTIVE' ? 'MATCHED' : 'COMPLETED'}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{g.route}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {g.date ?? ''} • {g.members?.length ?? g.memberDetails?.length ?? 0}{' '}
                      commuters
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {(g.memberDetails ?? []).map((m: any) => (
                      <div
                        key={m.id}
                        className="h-8 w-8 rounded-full bg-primary/20 border border-border flex items-center justify-center text-[11px] text-primary-foreground"
                      >
                        {m.name
                          .split(' ')
                          .map((p: string) => p[0])
                          .join('')}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
