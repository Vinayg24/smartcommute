import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CrowdMeterProps {
  label: string;
  percentage: number;
  className?: string;
}

function getColor(pct: number) {
  if (pct >= 70) return 'bg-destructive';
  if (pct >= 40) return 'bg-warning';
  return 'bg-success';
}

function getTextColor(pct: number) {
  if (pct >= 70) return 'text-destructive';
  if (pct >= 40) return 'text-warning';
  return 'text-success';
}

export default function CrowdMeter({ label, percentage, className }: CrowdMeterProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold', getTextColor(percentage))}>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getColor(percentage))}
        />
      </div>
    </div>
  );
}
