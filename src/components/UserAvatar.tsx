import { cn } from '@/lib/utils';

const COLORS = [
  'bg-primary', 'bg-success', 'bg-warning', 'bg-destructive',
  'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500',
];

function getColorFromName(name: string) {
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
  return COLORS[idx];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function UserAvatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  return (
    <div className={cn('rounded-full flex items-center justify-center text-primary-foreground font-semibold', getColorFromName(name), sizes[size], className)}>
      {getInitials(name)}
    </div>
  );
}
