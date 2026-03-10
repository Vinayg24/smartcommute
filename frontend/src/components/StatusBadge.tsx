import { cn } from '@/lib/utils';

type StatusType = 'LOW' | 'MEDIUM' | 'HIGH' | 'MATCHED' | 'SOLO' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

const statusStyles: Record<StatusType, string> = {
  LOW: 'bg-success/20 text-success',
  MEDIUM: 'bg-warning/20 text-warning',
  HIGH: 'bg-destructive/20 text-destructive',
  MATCHED: 'bg-success/20 text-success',
  SOLO: 'bg-primary/20 text-primary',
  PENDING: 'bg-warning/20 text-warning',
  CONFIRMED: 'bg-success/20 text-success',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-destructive/20 text-destructive',
};

export default function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide', statusStyles[status], className)}>
      {status}
    </span>
  );
}
