import AppNavbar from '@/components/AppNavbar';
import GlassCard from '@/components/GlassCard';
import CrowdMeter from '@/components/CrowdMeter';
import { Building2, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const OFFICES = [
  { name: 'Head Office', address: 'Connaught Place, Delhi', crowd: 85, employees: 52, capacity: 60 },
  { name: 'Tech Hub', address: 'Cyber City, Gurugram', crowd: 60, employees: 38, capacity: 65 },
  { name: 'Operations', address: 'Sector 18, Noida', crowd: 25, employees: 20, capacity: 80 },
  { name: 'South Branch', address: 'Faridabad', crowd: 15, employees: 12, capacity: 80 },
  { name: 'East Office', address: 'Laxmi Nagar, Delhi', crowd: 45, employees: 27, capacity: 60 },
];

export default function OfficesPage() {
  return (
    <>
      <AppNavbar title="Offices" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICES.map((office, i) => (
            <motion.div key={office.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard hover>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{office.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{office.address}</p>
                  </div>
                </div>
                <CrowdMeter label="Current Crowd" percentage={office.crowd} className="mb-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {office.employees} present</span>
                  <span className="text-muted-foreground">Cap: {office.capacity}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
