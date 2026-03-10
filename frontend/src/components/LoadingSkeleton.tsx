import { cn } from '@/lib/utils';

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-xl space-y-4">
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-3 w-2/3" />
    </div>
  );
}
