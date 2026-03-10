import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TimelineStep {
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                step.status === 'completed' && 'bg-success border-success text-success-foreground',
                step.status === 'active' && 'border-primary bg-primary/20 text-primary',
                step.status === 'upcoming' && 'border-muted bg-muted text-muted-foreground'
              )}
            >
              {step.status === 'completed' ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('text-xs whitespace-nowrap', step.status === 'active' ? 'text-primary font-semibold' : 'text-muted-foreground')}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('flex-1 h-0.5 mx-2', step.status === 'completed' ? 'bg-success' : 'bg-muted')} />
          )}
        </div>
      ))}
    </div>
  );
}
