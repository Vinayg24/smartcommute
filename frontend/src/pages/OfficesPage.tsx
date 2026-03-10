import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import { Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { officeAPI } from '@/services/api';

type Office = {
  id: string;
  name: string;
  address: string;
  city?: string | null;
  latitude: number;
  longitude: number;
  phone?: string | null;
  email?: string | null;
  capacity: number;
};

export default function OfficesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const res = await officeAPI.getAll();
      return res.data as Office[];
    },
  });

  return (
    <>
      <AppNavbar title="Offices" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {isLoading && (
          <div className="max-w-3xl mx-auto text-muted-foreground">Loading offices...</div>
        )}
        {error && (
          <div className="max-w-3xl mx-auto text-destructive">
            Failed to load offices.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((office, i) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{office.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {office.address}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <span>City: {office.city || '-'}</span>
                  <span>Capacity: {office.capacity}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
