import { useState } from 'react';
import { motion } from 'framer-motion';
import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import MatchCard from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Ruler, X } from 'lucide-react';
import { toast } from 'sonner';

type RideStatus = 'PENDING' | 'MATCHED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface Ride {
  id: string;
  office: string;
  from: string;
  date: string;
  time: string;
  distance: string;
  crowd: 'LOW' | 'MEDIUM' | 'HIGH';
  status: RideStatus;
  matchedPerson?: string;
  pickupPoint?: string;
}

const MOCK_RIDES: Ride[] = [
  { id: '1', office: 'Tech Hub', from: 'Lajpat Nagar', date: '2024-03-09', time: '9:00 AM', distance: '18 km', crowd: 'HIGH', status: 'MATCHED', matchedPerson: 'Sneha Patel', pickupPoint: 'Rohini Metro' },
  { id: '2', office: 'Head Office', from: 'Dwarka', date: '2024-03-08', time: '10:30 AM', distance: '12 km', crowd: 'MEDIUM', status: 'CONFIRMED' },
  { id: '3', office: 'Operations', from: 'Noida Sec 18', date: '2024-03-07', time: '9:30 AM', distance: '5 km', crowd: 'LOW', status: 'COMPLETED' },
  { id: '4', office: 'South Branch', from: 'Faridabad', date: '2024-03-10', time: '11:00 AM', distance: '35 km', crowd: 'LOW', status: 'PENDING' },
  { id: '5', office: 'Tech Hub', from: 'Rohini', date: '2024-03-06', time: '9:00 AM', distance: '28 km', crowd: 'HIGH', status: 'CANCELLED' },
];

const STATUS_FLOW: RideStatus[] = ['PENDING', 'MATCHED', 'CONFIRMED', 'COMPLETED'];

export default function MyRidesPage() {
  const [rides, setRides] = useState(MOCK_RIDES);

  const cancelRide = (id: string) => {
    setRides((prev) => prev.map((r) => r.id === id ? { ...r, status: 'CANCELLED' as RideStatus } : r));
    toast.success('Ride cancelled');
  };

  return (
    <>
      <AppNavbar title="My Rides" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {rides.map((ride, i) => (
            <motion.div key={ride.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-foreground">{ride.office}</h3>
                      <StatusBadge status={ride.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ride.from}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{ride.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ride.time}</span>
                      <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" />{ride.distance}</span>
                    </div>
                    {/* Status flow */}
                    <div className="flex items-center gap-1 mt-3">
                      {STATUS_FLOW.map((s, idx) => {
                        const currentIdx = STATUS_FLOW.indexOf(ride.status);
                        const done = idx <= currentIdx && ride.status !== 'CANCELLED';
                        return (
                          <div key={s} className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${done ? 'bg-success' : 'bg-muted'}`} />
                            <span className={`text-[10px] ${done ? 'text-success' : 'text-muted-foreground'}`}>{s}</span>
                            {idx < STATUS_FLOW.length - 1 && <div className={`w-4 h-0.5 ${done ? 'bg-success' : 'bg-muted'}`} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {ride.status === 'PENDING' && (
                    <Button variant="outline" size="sm" onClick={() => cancelRide(ride.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      <X className="h-3.5 w-3.5 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
                {ride.status === 'MATCHED' && ride.matchedPerson && (
                  <div className="mt-4">
                    <MatchCard matchedPerson={ride.matchedPerson} pickupPoint={ride.pickupPoint || ''} office={ride.office} time={ride.time}
                      onAccept={() => { setRides((prev) => prev.map((r) => r.id === ride.id ? { ...r, status: 'CONFIRMED' } : r)); toast.success('Ride confirmed!'); }}
                      onDecline={() => { setRides((prev) => prev.map((r) => r.id === ride.id ? { ...r, status: 'PENDING', matchedPerson: undefined } : r)); }}
                    />
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
